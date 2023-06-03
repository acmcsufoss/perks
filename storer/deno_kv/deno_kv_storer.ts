import type { Award, MintedPerk } from "../../perks/mod.ts";
import type {
  AwardQuery,
  Diagnosis,
  ListQuery,
  MintQuery,
  PerkQuery,
  PreuseQuery,
  RevokeQuery,
  StoredSummary,
  Storer,
  UnmintQuery,
} from "../mod.ts";

/**
 * DenoKVStorer uses Deno KV to implement the Storer interface.
 *
 * See:
 * https://deno.land/api?unstable=&s=Deno.Kv
 */
export class DenoKVStorer implements Storer {
  constructor(
    public readonly kv: Deno.Kv,
    public readonly namespace: string[] = [],
  ) {}

  public async doPerkQuery(q: PerkQuery): Promise<MintedPerk> {
    const result = await this.kv.get<MintedPerk>(
      makePerksKey(this.namespace, q.perk_id),
    );
    if (result?.value === null) {
      throw new Error(`Perk not found: ${q.perk_id}`);
    }

    return result.value;
  }

  public async doMintQuery(q: MintQuery): Promise<MintedPerk> {
    const perk = makeMintedPerk(q, makeNewOptions());
    const result = await this.kv.set(
      makePerksKey(this.namespace, perk.id),
      perk,
    );
    if (!result.ok) {
      throw new Error(`Failed to mint perk: ${q.type}`);
    }

    return perk;
  }

  public async doUnmintQuery(q: UnmintQuery): Promise<MintedPerk> {
    const perkResult = await this.kv.get<MintedPerk>(
      makePerksKey(this.namespace, q.id),
    );
    if (perkResult?.value === null) {
      throw new Error(`Perk not found: ${q.id}`);
    }

    const result = await this.kv
      .atomic()
      .check(perkResult)
      .delete(makePerksKey(this.namespace, q.id))
      .commit();
    if (!result.ok) {
      throw new Error(`Failed to unmint perk: ${q.id}`);
    }

    return perkResult.value;
  }

  public async doAwardQuery(q: AwardQuery): Promise<Award> {
    const award = makeAward(q, makeNewOptions());
    const result = await this.kv.set(
      makeAwardsKey(this.namespace, award.id),
      award,
    );
    if (!result.ok) {
      throw new Error(`Failed to award perk: ${q.mint_id}`);
    }

    return award;
  }

  public async doRevokeQuery(q: RevokeQuery): Promise<Award> {
    const awardResult = await this.kv.get<Award>(
      makeAwardsKey(this.namespace, q.id),
    );
    if (awardResult?.value === null) {
      throw new Error(`Award not found: ${q.id}`);
    }

    const result = await this.kv
      .atomic()
      .check(awardResult)
      .delete(makeAwardsKey(this.namespace, q.id))
      .commit();
    if (!result.ok) {
      throw new Error(`Failed to revoke perk: ${q.id}`);
    }

    return awardResult.value;
  }

  /**
   * TODO: Revise KV architecture to list perks and awards more efficiently.
   */
  public async doListQuery(q: ListQuery): Promise<StoredSummary[]> {
    const summaries: StoredSummary[] = [];
    for await (
      const awardResult of this.kv.list<Award>({
        prefix: makeAwardsKey(this.namespace),
      })
    ) {
      if (
        q.awardee_id !== undefined &&
        awardResult.value.awardee_id !== q.awardee_id
      ) {
        continue;
      }

      const perkResult = await this.kv
        .get<MintedPerk>(
          makePerksKey(this.namespace, awardResult.value.mint_id),
        );
      if (perkResult?.value === null) {
        throw new Error(`Perk not found: ${awardResult.value.mint_id}`);
      }

      summaries.push({
        award: awardResult.value,
        perk: perkResult.value,
      });
    }

    return summaries;
  }

  public async doPreuseQuery(q: PreuseQuery): Promise<StoredSummary> {
    const awardResult = await this.kv.get<Award>(
      makeAwardsKey(this.namespace, q.award_id),
    );
    if (awardResult?.value === null) {
      throw new Error(`Award not found: ${q.award_id}`);
    }

    const perkResult = await this.kv.get<MintedPerk>(
      makePerksKey(this.namespace, awardResult.value.mint_id),
    );
    if (perkResult?.value === null) {
      throw new Error(`Perk not found: ${awardResult.value.mint_id}`);
    }
    return { award: awardResult.value, perk: perkResult.value };
  }

  public async doUseQuery(q: PreuseQuery): Promise<StoredSummary> {
    const awardResult = await this.kv.get<Award>(
      makeAwardsKey(this.namespace, q.award_id),
    );
    if (awardResult?.value === null) {
      throw new Error(`Award not found: ${q.award_id}`);
    }

    const perkResult = await this.kv.get<MintedPerk>(
      makePerksKey(this.namespace, awardResult.value.mint_id),
    );
    if (perkResult?.value === null) {
      throw new Error(`Perk not found: ${awardResult.value.mint_id}`);
    }

    const { timestamp } = makeNewOptions();
    if (
      perkResult.value.milliseconds + perkResult.value.minted_at > timestamp
    ) {
      throw new Error(`Perk has expired: ${q.award_id}`);
    }
    if (perkResult.value.available <= 0) {
      throw new Error(`Perk no longer available: ${q.award_id}`);
    }

    const result = await this.kv
      .atomic()
      .check(awardResult, perkResult)
      .set(
        makePerksKey(this.namespace, perkResult.value.id),
        {
          ...perkResult.value,
          available: perkResult.value.available - 1,
        },
      )
      .commit();
    if (!result.ok) {
      throw new Error(`Failed to use perk: ${q.award_id}`);
    }

    return { award: awardResult.value, perk: perkResult.value };
  }

  public async doDiagnoseQuery(): Promise<Diagnosis> {
    const diagnosis: Diagnosis = {
      perks: 0,
      awards: 0,
    };

    await Promise.all([
      (async () => {
        for await (
          const _ of this.kv.list<MintedPerk>({
            prefix: makePerksKey(this.namespace),
          })
        ) {
          diagnosis.perks++;
        }
      })(),
      (async () => {
        for await (
          const _ of this.kv.list<Award>({
            prefix: makeAwardsKey(this.namespace),
          })
        ) {
          diagnosis.awards++;
        }
      })(),
    ]);

    return diagnosis;
  }
}

/**
 * makeMintedPerk creates a new minted perk from a mint query.
 */
export function makeMintedPerk(q: MintQuery, o: NewOptions): MintedPerk {
  return {
    id: o.uuid,
    minted_at: o.timestamp,
    type: q.type,
    minter_id: q.minter_id,
    milliseconds: q.milliseconds,
    max_uses: q.max_uses,
    available: q.max_uses,
  };
}

/**
 * makeAward creates a new award from an award query.
 */
export function makeAward(q: AwardQuery, o: NewOptions): Award {
  return {
    id: o.uuid,
    mint_id: q.mint_id,
    awardee_id: q.awardee_id,
    awarder_id: q.awarder_id,
    awarded_at: o.timestamp,
  };
}

/**
 * makeNewOptions creates a new storage options object.
 */
export function makeNewOptions(): NewOptions {
  return {
    timestamp: new Date().toISOString(),
    uuid: crypto.randomUUID(),
  };
}

/**
 * NewOptions is the options for creating a new object.
 */
export interface NewOptions {
  /**
   * timestamp is the serialized timestamp at which the object was created.
   */
  timestamp: string;

  /**
   * uuid is the randomly generated UUID to identify the object.
   */
  uuid: string;
}

/**
 * TABLE_PERKS is the name of the table that stores perks.
 */
export const TABLE_PERKS = "perks";

/**
 * makePerksKey creates a key for the perks table.
 */
export function makePerksKey(namespace: string[], perkID?: string): Deno.KvKey {
  if (perkID !== undefined) {
    return [...namespace, TABLE_PERKS, perkID];
  }

  return [...namespace, TABLE_PERKS];
}

/**
 * TABLE_AWARDS is the name of the table that stores awards.
 */
export const TABLE_AWARDS = "awards";

/**
 * makeAwardsKey creates a key for the awards table.
 */
export function makeAwardsKey(
  namespace: string[],
  awardID?: string,
): Deno.KvKey {
  if (awardID !== undefined) {
    return [...namespace, TABLE_AWARDS, awardID];
  }

  return [...namespace, TABLE_AWARDS];
}

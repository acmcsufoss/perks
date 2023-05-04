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
    if (result.value === null) {
      throw new Error(`Perk not found: ${q.perk_id}`);
    }

    return result.value;
  }

  public async doMintQuery(q: MintQuery): Promise<MintedPerk> {
    const perk = makeMintedPerk(q, makeNewOptions());
    const result = await this.kv
      .atomic()
      .set(
        makePerksKey(this.namespace, perk.id),
        perk,
      )
      .commit();
    if (!result.ok) {
      throw new Error(`Failed to mint perk: ${q.type}`);
    }

    return perk;
  }

  public async doUnmintQuery(q: UnmintQuery): Promise<MintedPerk> {
    const perk = await this.doPerkQuery({ perk_id: q.id });
    const result = await this.kv
      .atomic()
      .delete(makePerksKey(this.namespace, q.id))
      .commit();
    if (!result.ok) {
      throw new Error(`Failed to unmint perk: ${q.id}`);
    }

    return perk;
  }

  public async doAwardQuery(q: AwardQuery): Promise<Award> {
    const award = makeAward(q, makeNewOptions());
    const result = await this.kv
      .atomic()
      .set(
        makeAwardsKey(this.namespace, award.id),
        award,
      )
      .commit();
    if (!result.ok) {
      throw new Error(`Failed to award perk: ${q.mint_id}`);
    }

    return award;
  }

  public async doRevokeQuery(q: RevokeQuery): Promise<Award> {
    const { value: award } = await this.kv.get<Award>(
      makeAwardsKey(this.namespace, q.id),
    );
    if (award === null) {
      throw new Error(`Award not found: ${q.id}`);
    }

    const result = await this.kv
      .atomic()
      .delete(makeAwardsKey(this.namespace, q.id))
      .commit();
    if (!result.ok) {
      throw new Error(`Failed to revoke perk: ${q.id}`);
    }

    return award;
  }

  /**
   * TODO: Revise KV architecture to list perks and awards more efficiently.
   */
  public async doListQuery(q: ListQuery): Promise<StoredSummary[]> {
    const summaries: StoredSummary[] = [];
    for await (
      const { value: award } of this.kv.list<Award>({
        prefix: makeAwardsKey(this.namespace),
      })
    ) {
      if (q.awardee_id !== undefined && award.awardee_id !== q.awardee_id) {
        continue;
      }

      const perk = await this.doPerkQuery({ perk_id: award.mint_id });
      summaries.push({
        award,
        perk,
      });
    }

    return summaries;
  }

  // TODO:
  // Implement remaining queries.
  //

  public async doPreuseQuery(q: PreuseQuery): Promise<StoredSummary> {
    // const perk = await this.doPerkQuery({ perk_id: q.award_id });
    // const { value: award } = await this.kv.get<Award>(
    //   makeAwardsKey(this.namespace, perk.),
    // );
    // if (award === null) {
    //   throw new Error(`Award not found: ${q.id}`);
    // }

    throw new Error("Method not implemented.");
  }

  public async doUseQuery(q: PreuseQuery): Promise<StoredSummary> {
    throw new Error("Method not implemented.");
  }

  public async doDiagnoseQuery(): Promise<Diagnosis> {
    throw new Error("Method not implemented.");
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

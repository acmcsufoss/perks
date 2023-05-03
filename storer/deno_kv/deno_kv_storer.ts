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

// TODO: Implement DenoKVStorer methods.
// See:
// https://deno.land/api?unstable=&s=Deno.Kv
//

/**
 * DenoKVStorer uses Deno KV to implement the Storer interface.
 */
export class DenoKVStorer implements Storer {
  constructor(
    public readonly kv: Deno.Kv,
  ) {}

  public async doPerkQuery(q: PerkQuery): Promise<MintedPerk> {
    throw new Error("Method not implemented.");
  }

  public async doMintQuery(q: MintQuery): Promise<MintedPerk> {
    throw new Error("Method not implemented.");
  }

  public async doUnmintQuery(q: UnmintQuery): Promise<MintedPerk> {
    throw new Error("Method not implemented.");
  }

  public async doAwardQuery(q: AwardQuery): Promise<Award> {
    throw new Error("Method not implemented.");
  }

  public async doRevokeQuery(q: RevokeQuery): Promise<Award> {
    throw new Error("Method not implemented.");
  }

  public async doListQuery(q: ListQuery): Promise<StoredSummary[]> {
    throw new Error("Method not implemented.");
  }

  public async doPreuseQuery(q: PreuseQuery): Promise<StoredSummary> {
    throw new Error("Method not implemented.");
  }

  public async doUseQuery(q: PreuseQuery): Promise<StoredSummary> {
    throw new Error("Method not implemented.");
  }

  public async doDiagnoseQuery(): Promise<Diagnosis> {
    throw new Error("Method not implemented.");
  }
}

import type { Award, MintedPerk } from "../../perks/perk.ts";
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
} from "../storer.ts";

/**
 * KVStorer uses Deno KV to implement the Storer interface.
 */
export class KVStorer implements Storer {
  constructor(
    public readonly kv: Deno.Kv,
  ) {}

  // TODO: Implement KVStorer methods.
  // See:
  // https://deno.land/api?unstable=&s=Deno.Kv
}

import type { Award, ID, MintedPerk } from "../perks/mod.ts";

/**
 * Diagnosis is the result of a diagnosis query.
 */
export interface Diagnosis {
  perks: number;
  awards: number;
}

/**
 * MintQuery is the input to a mint query.
 */
export interface MintQuery {
  type: string;
  minter_id: ID;
  max_uses: number;
  milliseconds: number;
}

/**
 * PerkQuery is the input to a perk query.
 */
export interface PerkQuery {
  perk_id: ID;
}

/**
 * StoredPerk is the perk as stored in the store.
 */
export type StoredPerk = MintedPerk;

/**
 * UnmintQuery is the input to an unmint query.
 */
export type UnmintQuery = Pick<MintedPerk, "id">;

/**
 * AwardQuery is the input to an award query. The award query adds a new award
 * to the store.
 */
export interface AwardQuery {
  awarder_id: ID;
  awardee_id: ID;
  mint_id: ID;
}

/**
 * StoredAward is the award as stored in the store.
 */
export type StoredAward = Award;

/**
 * RevokeQuery is the input to a revoke query.
 *
 * The revoke query is the inverse of the award query in that it removes an
 * award from the store.
 */
export type RevokeQuery = Pick<Award, "id">;

/**
 * ListQuery is the input to a list query.
 */
export interface ListQuery {
  awardee_id?: ID;
}

/**
 * StoredSummary is the summary of an award and its associated perk as stored
 * in the store.
 */
export interface StoredSummary {
  perk: StoredPerk;
  award: StoredAward;
}

/**
 * PreuseQuery is the input to a preuse query.
 *
 * The preuse query returns the perk associated with the given mint_id.
 */
export interface PreuseQuery {
  mint_id: ID;
}

/**
 * UseQuery is the input to a use query.
 *
 * The use query subtracts one from the available count of the minted perk
 * associated with the given mint_id.
 */
export type UseQuery = PreuseQuery;

/**
 * Storer stores what authorized users use to mint and award perks.
 */
export interface Storer {
  /**
   * doPerkQuery returns the single perk by perk ID.
   */
  doPerkQuery: (q: PerkQuery) => Promise<StoredPerk>;

  /**
   * doMintQuery adds a new perk to the store.
   */
  doMintQuery: (q: MintQuery) => Promise<StoredPerk>;

  /**
   * doUnmintQuery removes a perk from the store.
   */
  doUnmintQuery: (q: UnmintQuery) => Promise<StoredPerk>;

  /**
   * doAwardQuery adds a new award to the store.
   */
  doAwardQuery: (q: AwardQuery) => Promise<StoredAward>;

  /**
   * doRevokeQuery removes an award from the store.
   */
  doRevokeQuery: (q: RevokeQuery) => Promise<StoredAward>;

  /**
   * doListQuery returns a list of awards and their associated perks
   * for the given awardee.
   *
   * If awardee_id is not provided, all awards and their associated perks
   * are returned.
   */
  doListQuery: (q: ListQuery) => Promise<StoredSummary[]>;

  /**
   * doPreuseQuery returns the perk associated with the given mint_id.
   */
  doPreuseQuery: (q: PreuseQuery) => Promise<StoredSummary>;

  /**
   * doUseQuery subtracts one from the available count of the minted perk
   * associated with the given mint_id.
   */
  doUseQuery: (q: UseQuery) => Promise<StoredSummary>;

  /**
   * doDiagnoseQuery returns the number of perks and awards in the store.
   */
  doDiagnoseQuery: () => Promise<Diagnosis>;
}

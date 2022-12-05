import type { Award, MintedPerk } from "../perks/mod.ts";

export const SQL_TABLE_PERKS = `CREATE TABLE IF NOT EXISTS perks (
  id SERIAL PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  minter VARCHAR(255) NOT NULL,
  minted_at TIMESTAMP NOT NULL DEFAULT NOW(),
  max_uses INTEGER NOT NULL,
  milliseconds INTEGER NOT NULL,
  available INTEGER NOT NULL,
  activated TIMESTAMP,
);`;

export const SQL_TABLE_AWARDS = `CREATE TABLE IF NOT EXISTS awards (
  id SERIAL PRIMARY KEY,
  awarder VARCHAR(255) NOT NULL,
  awardee VARCHAR(255) NOT NULL,
  mint_id INTEGER NOT NULL REFERENCES perks(id) ON DELETE CASCADE,
);`;

export interface MintQuery {
  type: string;
  minter: string;
  max_uses: number;
  milliseconds: number;
}

export type StoredPerk = MintedPerk;

export const SQL_QUERY_MINT = `INSERT INTO perks (
  type,
  minter,
  max_uses,
  milliseconds,
  available,
) VALUES (
  $1,
  $2,
  $3,
  $4,
  $5,
) RETURNING *;`;

export type UnmintQuery = Pick<MintedPerk, "id">;

export const SQL_QUERY_UNMINT = `DELETE FROM perks
  WHERE id = $1
  RETURNING *;`;

export interface AwardQuery {
  awarder: string;
  awardee: string;
  mint_id: number;
}

export type StoredAward = Award;

export const SQL_QUERY_AWARD = `INSERT INTO awards (
  awarder,
  awardee,
  mint_id,
) VALUES (
  $1,
  $2,
  $3,
) RETURNING *;`;

export type RevokeQuery = Pick<Award, "id">;

export const SQL_QUERY_REVOKE = `DELETE FROM awards
  WHERE id = $1
  RETURNING *;`;

export interface ListQuery {
  awardee?: string;
}

export interface StoredSummary {
  perk: StoredPerk;
  award: StoredAward;
}

export const SQL_QUERY_LIST = `SELECT
  perks.id AS perk_id,
  perks.type AS perk_type,
  perks.minter AS perk_minter,
  perks.max_uses AS perk_max_uses,
  perks.milliseconds AS perk_milliseconds,
  perks.available AS perk_available,
  perks.activated AS perk_activated,
  awards.id AS award_id,
  awards.awarder AS award_awarder,
  awards.awardee AS award_awardee,
  awards.mint_id AS award_mint_id
FROM awards
INNER JOIN perks ON perks.id = awards.mint_id
WHERE
  $1 IS NULL OR
  awards.awardee = $1;`;

export interface UseQuery {
  id: number;
}

export const SQL_QUERY_USE = `UPDATE perks SET
  activated = NOW() IF available == max_uses
  available = available - 1
WHERE
  id = $1 AND
RETURNING *;`;

/**
 * Storer stores what authorized users use to mint and award perks.
 */
export interface Storer {
  doMintQuery: (q: MintQuery) => Promise<StoredPerk>;
  doUnmintQuery: (q: UnmintQuery) => Promise<StoredPerk>;
  doAwardQuery: (q: AwardQuery) => Promise<StoredAward>;
  doRevokeQuery: (q: RevokeQuery) => Promise<StoredAward>;
  doListQuery: (q: ListQuery) => Promise<StoredSummary[]>;
  doUseQuery: (q: UseQuery) => Promise<StoredPerk>;

  createTables: () => Promise<void>;
}

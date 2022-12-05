import type { Award, MintedPerk } from "../mod.ts";

/**
 * Client is what authorized users use to mint and award perks.
 */
export interface Client {
  /** example mint: /perks mint <perk_name> <max_uses?> <milliseconds?> */
  mint: (r: MintRequest) => Promise<MintResponse>;

  /** example unmint: /perks unmint <mint_id> */
  unmint: (r: UnmintRequest) => Promise<UnmintResponse>;

  /** example award: /perks award <mint_id> <member_id> */
  award: (r: AwardRequest) => Promise<AwardResponse>;

  /** example list: /perks list <member_id?> */
  list: (r: ListRequest) => Promise<ListResponse>;

  /** example revoke: /perks revoke <award_id> */
  revoke: (r: RevokeRequest) => Promise<RevokeResponse>;

  /** example use: /perks use <perk_name> <query?> */
  use: (r: UseRequest) => Promise<UseResponse>;
}

type OmitID<T> = Omit<T, "id">;

export type MintRequest = OmitID<MintedPerk>;
export type MintResponse = MintedPerk;

export type UnmintRequest = Pick<MintedPerk, "id">;
export type UnmintResponse = MintedPerk;

export const SQL_QUERY_UNMINT = `DELETE FROM perks
  WHERE id = $1
  RETURNING *;`;

export type AwardRequest = OmitID<Award>;
export type AwardResponse = Award;

export interface AwardSummary {
  perk: MintedPerk;
  award: Award;
}

export interface ListRequest {
  member_id?: string;
}

export interface ListResponse {
  awards: AwardSummary[];
}

export interface RevokeRequest {
  award_id: string;
}

export type RevokeResponse = AwardResponse;

export const SQL_QUERY_REVOKE = `DELETE FROM awards
  WHERE id = $1
  RETURNING *;`;

export interface UseRequest {
  award_id: string;
  query: string;
}

export type UseResponse = AwardResponse;

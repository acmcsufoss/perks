import type { Award, MintedPerk } from "./perk.ts";

type OmitID<T> = Omit<T, "id">;

export type MintRequest = OmitID<MintedPerk>;
export type MintResponse = MintedPerk;

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

export interface UseRequest {
  member_id: string;
  award_id: string;
}

export type UseResponse = AwardResponse;

/**
 * Client is what authorized users use to mint and award perks.
 */
export interface Client {
  /** example mint: /perks mint <perk_name> <max_uses?> <milliseconds?> */
  mint: (r: MintRequest) => Promise<MintResponse>;

  /** example award: /perks award <mint_id> <member_id> */
  award: (r: AwardRequest) => Promise<AwardResponse>;

  /** example list: /perks list <member_id?> */
  list: (r: ListRequest) => Promise<ListResponse>;

  /** example revoke: /perks revoke <award_id> */
  revoke: (r: RevokeRequest) => Promise<RevokeResponse>;

  /** example use: /perks use <perk_name> */
  use: (r: UseRequest) => Promise<UseRequest>;
}

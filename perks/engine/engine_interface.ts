import type { APIInteractionResponse } from "../../bot/deps.ts";
import type { Award, ID, MintedPerk } from "../mod.ts";

/**
 * EngineInterface is the interface for the perks engine.
 *
 * The perks engine is the core of the perks system. It is responsible for
 * minting perks, awarding perks, and revoking perks.
 */
export interface EngineInterface {
  /**
   * mint mints a new perk.
   */
  mint: (r: MintRequest) => Promise<MintResponse>;

  /**
   * unmint unmints a perk.
   */
  unmint: (r: UnmintRequest) => Promise<UnmintResponse>;

  /**
   * award awards a perk.
   */
  award: (r: AwardRequest) => Promise<AwardResponse>;

  /**
   * list lists all perks by awardee ID or all perks if no awardee ID is
   * provided.
   */
  list: (r: ListRequest) => Promise<ListResponse>;

  /**
   * revoke revokes an award.
   */
  revoke: (r: RevokeRequest) => Promise<RevokeResponse>;

  /**
   * use uses a perk.
   */
  use: (r: UseRequest) => Promise<UseResponse>;
}

/**
 * MintRequest is the request to the mint method.
 */
export interface MintRequest {
  /**
   * type is the name of the perk to be minted.
   */
  type: string;

  /**
   * minter_id is the ID of the user who minted this perk.
   */
  minter_id: ID;

  /**
   * minter_role_ids is the list of role IDs the minter has.
   */
  minter_role_ids: string[];

  /**
   * max_uses is the maximum number of times this perk can be consumed.
   */
  max_uses?: number;

  /**
   * milliseconds is the number of milliseconds this perk is valid for.
   */
  milliseconds?: number;
}

/**
 * MintResponse is the response from the mint method.
 */
export type MintResponse = MintedPerk;

/**
 * UnmintRequest is the request to the unmint method.
 */
export interface UnmintRequest extends Pick<MintedPerk, "id"> {
  /**
   * minter_role_ids is the list of role IDs the minter has.
   */
  minter_role_ids: string[];
}

/**
 * UnmintResponse is the response from the unmint method.
 */
export type UnmintResponse = MintedPerk;

/**
 * AwardRequest is the request to the award method.
 */
export interface AwardRequest extends Omit<Award, "id" | "awarded_at"> {
  /**
   * awarder_role_ids is the list of role IDs the awarder has.
   */
  awarder_role_ids: string[];
}

/**
 * AwardResponse is the response from the award method.
 */
export type AwardResponse = Award;

/**
 * AwardSummary is a summary of an award.
 */
export interface AwardSummary {
  /**
   * perk is the minted perk.
   */
  perk: MintedPerk;

  /**
   * award is the award of the minted perk.
   */
  award: Award;
}

/**
 * ListRequest is the request to the list method.
 */
export interface ListRequest {
  /**
   * actor_id is the ID of the user who is listing awards.
   */
  actor_id: ID;

  /**
   * awarder_role_ids is the list of role IDs the awarder has.
   */
  awarder_role_ids: string[];

  /**
   * awardee_id is the ID of the user to list awards for.
   */
  awardee_id?: ID;
}

/**
 * ListResponse is the response from the list method.
 */
export interface ListResponse {
  awards: AwardSummary[];
}

/**
 * RevokeRequest is the request to the revoke method.
 */
export interface RevokeRequest {
  /**
   * award_id is the ID of the award to revoke.
   */
  award_id: ID;

  /**
   * awarder_role_ids is the list of role IDs the awarder has.
   */
  awarder_role_ids: string[];
}

/**
 * RevokeResponse is the response from the revoke method.
 */
export type RevokeResponse = Award;

/**
 * UseRequest is the request to the use method.
 */
export interface UseRequest {
  /**
   * award_id is the ID of the award to use.
   */
  award_id: ID;

  /**
   * actor_id is the ID of the user who is using the award.
   */
  actor_id: ID;

  /**
   * awarder_role_ids is the list of role IDs the awarder has.
   */
  awarder_role_ids: string[];

  /**
   * query is the query string to use.
   */
  query?: string;
}

/**
 * UseResponse is the response from the use method.
 */
export interface UseResponse {
  data: APIInteractionResponse;
}

import type { Award, MintedPerk } from "../perks/mod.ts";

/**
 * PartialExcept is a type that allows you to specify a type and a set of keys
 * that must be present. This is useful for when you want to specify a type
 * that is a subset of another type, but you want to ensure that some keys are
 * present.
 *
 * Attribution: https://stackoverflow.com/a/49725198
 */
type PartialExcept<T, Keys extends keyof T = keyof T> =
  & Pick<T, Exclude<keyof T, Keys>>
  & {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export interface PerkCreateRequest {
  type: string; // The name of the perk to be minted.
  minter: string; // The ID of the authorized user who minted the perk.
  max_uses?: number; // The number of times this perk can be consumed.
  milliseconds?: number; // The number of milliseconds this perk is valid for.
}

export type PerkUpdateRequest = PartialExcept<MintedPerk, "id">;

export type PerkListRequest = Partial<MintedPerk>;

export type StoredPerk = MintedPerk;

export interface PerkStorer {
  createPerk(r: PerkCreateRequest): Promise<StoredPerk>;
  updatePerk(r: PerkUpdateRequest): Promise<StoredPerk>;
  getPerk(id: string): Promise<StoredPerk>;
  getPerkList(r: PerkListRequest): Promise<StoredPerk[]>;
}

export interface AwardCreateRequest {
  awarder: string; // The authorized ID of the user who granted the award.
  awardee: string; // The ID of the member who received the award.
  mint_id: string; // ID of minted perk awarded to grantee.
}

export type AwardUpdateRequest = PartialExcept<MintedPerk, "id">;

export type AwardListRequest = Partial<MintedPerk>;

export type StoredAward = Award;

export interface AwardStorer {
  createAward(r: AwardCreateRequest): Promise<StoredAward>;
  updateAward(r: AwardUpdateRequest): Promise<StoredAward>;
  getAward(id: string): Promise<StoredAward>;
  getAwardList(r: AwardListRequest): Promise<StoredAward[]>;
}

/**
 * Storer stores what authorized users use to mint and award perks.
 */
export interface Storer extends PerkStorer, AwardStorer {
}

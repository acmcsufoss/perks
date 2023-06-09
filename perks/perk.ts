/**
 * ID is a unique identifier.
 */
export type ID = string;

/**
 * Award is a record of a perk being awarded to a member. An award acts as a
 * certificate that binds a perk to a member.
 */
export interface Award {
  /** id is a UUID generated by the server on award. */
  id: ID;

  /** awarder_id is the authorized ID of the user who granted the award. */
  awarder_id: ID;

  /** awardee_id is the ID of the member who received the award. */
  awardee_id: ID;

  /** mint_id is the ID of minted perk awarded to grantee. */
  mint_id: ID;

  /** awarded_at is the timestamp the award was granted. */
  awarded_at: string;
}

/**
 * MintedPerk is a perk that has been minted and is ready to be awarded.
 */
export interface MintedPerk {
  /** id is a UUID generated by the server on mint. */
  id: ID;

  /** type is the name of the perk to be minted. */
  type: string;

  /** minter_id is the authorized ID of the user who minted the perk. */
  minter_id: ID;

  /** minted_at is the timestamp the perk was minted. */
  minted_at: string;

  /** max_uses is the number of times this perk can be consumed. */
  max_uses: number;

  /** milliseconds is the number of milliseconds this perk is valid for. */
  milliseconds: number;

  /** available is the number of uses remaining. */
  available: number;

  /** activated is the timestamp the perk was activated. */
  activated?: string;
}

/**
 * Perk to be minted.
 */
export interface Perk {
  /** name is the unique name of the perk. */
  name: string;

  /** description is a description of the perk. */
  description: string;

  /** default_max_uses is the default number of times this perk can be consumed. */
  default_max_uses: number;

  /** default_milliseconds is the default number of milliseconds this perk is valid for. */
  default_milliseconds: number;
}

/**
 * parseIsAvailable checks if a perk is currently available.
 */
export function parseIsAvailable(perk: MintedPerk, date = new Date()) {
  // Get the current time in milliseconds.
  const currentTime = date.getTime();

  // Check if the perk is activated.
  const activatedAt = getActivatedTime(perk);

  // Check if perk is expired.
  const isExpired = perk.milliseconds > 0 &&
    currentTime - activatedAt > perk.milliseconds;

  // Check if perk is available and not expired.
  return perk.available > 0 && !isExpired;
}

/**
 * getActivatedTime returns the activation time of the perk in milliseconds.
 */
function getActivatedTime(perk: MintedPerk) {
  // If the perk is activated, return the activation time in milliseconds.
  if (perk.activated) {
    return new Date(perk.activated).getTime();
  }

  // Perk is not activated, return 0.
  return 0;
}

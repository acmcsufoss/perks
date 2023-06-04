import type {
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandOption,
} from "../../deps.ts";
import { ApplicationCommandOptionType } from "../../deps.ts";

export const AWARD = "award";
export const AWARD_DESCRIPTION = "Award a perk to a member";
export const AWARD_MINT_ID = "mint_id";
export const AWARD_MINT_ID_DESCRIPTION = "The mint ID of the perk";
export const AWARD_MEMBER = "member";
export const AWARD_MEMBER_DESCRIPTION = "The member to award the perk to";

/** Example: /perks award <mint_id> <awardee_id> */
export const SUB_AWARD: APIApplicationCommandOption = {
  name: AWARD,
  description: AWARD_DESCRIPTION,
  type: ApplicationCommandOptionType.Subcommand,
  options: [
    {
      name: AWARD_MINT_ID,
      description: AWARD_MINT_ID_DESCRIPTION,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: AWARD_MEMBER,
      description: AWARD_MEMBER_DESCRIPTION,
      type: ApplicationCommandOptionType.User, // Note: Award multiple members via ApplicationCommandOptionType.Mentionable
      required: false,
    },
  ],
};

/**
 * parseAwardOptions parses the options for the award command.
 */
export function parseAwardOptions(
  options: APIApplicationCommandInteractionDataOption[],
): {
  [AWARD_MINT_ID]: string;
  [AWARD_MEMBER]?: string;
} {
  const idOption = options.find((option) => option.name === AWARD_MINT_ID);
  if (idOption?.type !== ApplicationCommandOptionType.String) {
    throw new Error("Invalid ID type");
  }

  const awardeeOption = options.find((option) => option.name === AWARD_MEMBER);
  if (
    awardeeOption && awardeeOption.type !== ApplicationCommandOptionType.User
  ) {
    throw new Error("Invalid awardee type");
  }

  return {
    mint_id: idOption.value,
    member: awardeeOption?.value,
  };
}

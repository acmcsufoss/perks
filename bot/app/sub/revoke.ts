import type {
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandOption,
} from "../../deps.ts";
import { ApplicationCommandOptionType } from "../../deps.ts";

export const REVOKE = "revoke";
export const REVOKE_DESCRIPTION = "Revoke a perk";
export const REVOKE_AWARD_ID = "award_id";
export const REVOKE_AWARD_ID_DESCRIPTION = "The ID of the award";

/** example revoke: /perks revoke <award_id> */
export const SUB_REVOKE: APIApplicationCommandOption = {
  name: REVOKE,
  description: REVOKE_DESCRIPTION,
  type: ApplicationCommandOptionType.Subcommand,
  options: [
    {
      name: REVOKE_AWARD_ID,
      description: REVOKE_AWARD_ID_DESCRIPTION,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

/**
 * parseRevokeOptions parses the options for the revoke command.
 */
export function parseRevokeOptions(
  options: APIApplicationCommandInteractionDataOption[],
): {
  [REVOKE_AWARD_ID]: string;
} {
  const idOption = options.find((option) => option.name === REVOKE_AWARD_ID);
  if (idOption?.type !== ApplicationCommandOptionType.String) {
    throw new Error("Invalid ID type");
  }

  return {
    award_id: idOption.value,
  };
}

import type {
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandOption,
} from "../../deps.ts";
import { ApplicationCommandOptionType } from "../../deps.ts";

export const UNMINT = "unmint";
export const UNMINT_DESCRIPTION = "Unmint a perk";
export const UNMINT_MINT_ID = "mint_id";
export const REVOKE_MINT_ID_DESCRIPTION = "The ID of the minted perk";

/** example revoke: /perks unmint <mint_id> */
export const SUB_UNMINT: APIApplicationCommandOption = {
  name: UNMINT,
  description: UNMINT_DESCRIPTION,
  type: ApplicationCommandOptionType.Subcommand,
  options: [
    {
      name: UNMINT_MINT_ID,
      description: REVOKE_MINT_ID_DESCRIPTION,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
};

/**
 * parseUnmintOptions parses the options for the unmint command.
 */
export function parseUnmintOptions(
  options: APIApplicationCommandInteractionDataOption[],
): {
  [UNMINT_MINT_ID]: string;
} {
  const idOption = options.find((option) => option.name === UNMINT_MINT_ID);
  if (idOption?.type !== ApplicationCommandOptionType.String) {
    throw new Error("Invalid ID type");
  }

  return {
    mint_id: idOption.value,
  };
}

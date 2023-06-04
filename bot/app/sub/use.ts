import type {
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandOption,
} from "../../deps.ts";
import { ApplicationCommandOptionType } from "../../deps.ts";

export const USE = "use";
export const USE_DESCRIPTION = "Use a perk";
export const USE_AWARD_ID = "award_id";
export const USE_AWARD_ID_DESCRIPTION = "The ID of the award of the perk";
export const USE_QUERY = "query";
export const USE_QUERY_DESCRIPTION = "The query to use with the perk";

/** Example: /perks use <perk_name> <query?> */
export const SUB_USE: APIApplicationCommandOption = {
  name: USE,
  description: USE_DESCRIPTION,
  type: ApplicationCommandOptionType.Subcommand,
  options: [
    {
      name: USE_AWARD_ID,
      description: USE_AWARD_ID_DESCRIPTION,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: USE_QUERY,
      description: USE_QUERY_DESCRIPTION,
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
};

/**
 * parseUseOptions parses the options for the use command.
 */
export function parseUseOptions(
  options: APIApplicationCommandInteractionDataOption[],
): {
  [USE_AWARD_ID]: string;
  [USE_QUERY]?: string;
} {
  const idOption = options.find((option) => option.name === USE_AWARD_ID);
  if (idOption?.type !== ApplicationCommandOptionType.String) {
    throw new Error("Invalid ID type");
  }

  const queryOption = options.find((option) => option.name === USE_QUERY);
  if (queryOption && queryOption.type !== ApplicationCommandOptionType.String) {
    throw new Error("Invalid query type");
  }

  return {
    award_id: idOption.value,
    query: queryOption?.value,
  };
}

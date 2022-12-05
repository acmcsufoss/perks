import type { APIApplicationCommandOption } from "../../../deps.ts";
import { ApplicationCommandOptionType } from "../../../deps.ts";

export const USE = "use";
export const USE_DESCRIPTION = "Use a perk";
export const USE_NAME = "Perk name";
export const USE_NAME_DESCRIPTION = "The name of the perk";
export const USE_QUERY = "Perk query";
export const USE_QUERY_DESCRIPTION = "The query to use with the perk";

/** Example: /perks use <perk_name> <query?> */
export const SUB_USE: APIApplicationCommandOption = {
  name: USE,
  description: USE_DESCRIPTION,
  type: ApplicationCommandOptionType.Subcommand,
  options: [
    {
      name: USE_NAME,
      description: USE_NAME_DESCRIPTION,
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

import type { APIApplicationCommandOption } from "../../deps.ts";
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

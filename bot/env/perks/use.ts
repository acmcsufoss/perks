import type { APIApplicationCommandOption } from "../../deps.ts";
import { ApplicationCommandOptionType } from "../../deps.ts";

export const USE = "use";
export const USE_DESCRIPTION = "Use a perk";
export const USE_NAME = "Perk name";
export const USE_NAME_DESCRIPTION = "The name of the perk";

/** Example: /perks use <perk_name> */
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
  ],
};

import type { APIApplicationCommandOption } from "../../deps.ts";
import { ApplicationCommandOptionType } from "../../deps.ts";

export const MINT = "mint";
export const MINT_DESCRIPTION = "Mint a new perk";
export const MINT_NAME = "Perk name";
export const MINT_NAME_DESCRIPTION = "The name of the perk";
export const MINT_MAX_USES = "Max uses";
export const MINT_MAX_USES_DESCRIPTION =
  "The number of times this perk can be consumed (default: 10)";
export const MINT_MILLISECONDS = "Milliseconds";
export const MINT_MILLISECONDS_DESCRIPTION =
  "The number of milliseconds this perk is valid for (default: 3600000)";

/** Example: /perks mint <perk_name> <max_uses?> <milliseconds?> */
export const SUB_MINT: APIApplicationCommandOption = {
  name: MINT,
  description: MINT_DESCRIPTION,
  type: ApplicationCommandOptionType.Subcommand,
  options: [
    {
      name: MINT_NAME,
      description: MINT_NAME_DESCRIPTION,
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: MINT_MAX_USES,
      description: MINT_MAX_USES_DESCRIPTION,
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
    {
      name: MINT_MILLISECONDS,
      description: MINT_MILLISECONDS_DESCRIPTION,
      type: ApplicationCommandOptionType.Integer,
      required: false,
    },
  ],
};

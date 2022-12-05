import type { RESTPostAPIApplicationCommandsJSONBody } from "../../deps.ts";

import { SUB_AWARD } from "./sub/award.ts";
import { SUB_MINT } from "./sub/mint.ts";
import { SUB_REVOKE } from "./sub/revoke.ts";
import { SUB_USE } from "./sub/use.ts";
import { SUB_LIST } from "./sub/list.ts";

export const PERKS = "perks";
export const PERKS_DESCRIPTION =
  "Set of Discord Application Commands to reward and activate perks";

/**
 * CMD_PERKS is the top-level command for the Perks Application Commands.
 */
export const CMD_PERKS: RESTPostAPIApplicationCommandsJSONBody = {
  name: PERKS,
  description: PERKS_DESCRIPTION,
  options: [SUB_MINT, SUB_AWARD, SUB_USE, SUB_REVOKE, SUB_LIST],
};

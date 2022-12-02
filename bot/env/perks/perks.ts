import type { RESTPostAPIApplicationCommandsJSONBody } from "../../deps.ts";

import { SUB_AWARD } from "./award.ts";
import { SUB_MINT } from "./mint.ts";
import { SUB_REVOKE } from "./revoke.ts";
import { SUB_USE } from "./use.ts";
import { SUB_LIST } from "./list.ts";

export const PERKS = "perks";
export const PERKS_DESCRIPTION =
  "Set of Discord Application Commands to reward and activate perks";

export const APP_PERKS: RESTPostAPIApplicationCommandsJSONBody = {
  name: PERKS,
  description: PERKS_DESCRIPTION,
  options: [SUB_MINT, SUB_AWARD, SUB_USE, SUB_REVOKE, SUB_LIST],
};

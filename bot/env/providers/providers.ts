import type { APIApplicationCommandOptionChoice } from "../../deps.ts";

import { Breakfast } from "./breakfast/mod.ts";

export const perks = [
  Breakfast,
];

/**
 * PROVIDER_NAMES contains the possible choices when picking a perk by name.
 */
export const PROVIDER_NAMES: APIApplicationCommandOptionChoice<string>[] = perks
  .map(({ name: n }) => ({ name: n, value: n }));

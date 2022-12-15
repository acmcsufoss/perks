import type { Provider } from "../../../perks/provider/mod.ts";
import type { APIApplicationCommandOptionChoice } from "../../deps.ts";

import { Breakfast } from "./breakfast/mod.ts";

export const providers: Provider[] = [
  new Breakfast(),
];

/**
 * PROVIDER_NAMES contains the possible choices when picking a perk by name.
 */
export const PROVIDER_NAMES: APIApplicationCommandOptionChoice<string>[] =
  providers.map(({ name: n }) => ({ name: n, value: n }));

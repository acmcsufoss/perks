import type { Provider } from "../../../perks/provider/mod.ts";
import type { APIApplicationCommandOptionChoice } from "../../deps.ts";
import { mustEnv } from "../env.ts";

import { Breakfast } from "./breakfast/mod.ts";
import { Dalle2 } from "./dalle2/dalle2.ts";

const env = mustEnv();

export const providers: Provider[] = [
  new Breakfast(),
  new Dalle2(env.openaiAPIKey),
];

/**
 * PROVIDER_NAMES contains the possible choices when picking a perk by name.
 */
export const PROVIDER_NAMES: APIApplicationCommandOptionChoice<string>[] =
  providers.map(({ name: n }) => ({ name: n, value: n }));

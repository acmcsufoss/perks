import type { APIApplicationCommandOptionChoice } from "../../../bot/deps.ts";
import { ENV } from "../../../bot/env/mod.ts";
import type { Provider } from "../mod.ts";
import { Breakfast } from "./breakfast/mod.ts";
import { Dalle2 } from "./dalle2/mod.ts";

export const providers: Provider[] = [
  new Breakfast(),
  new Dalle2(ENV.openaiAPIKey),
];

/**
 * PROVIDER_NAMES contains the possible choices when picking a perk by name.
 */
export const PROVIDER_NAMES: APIApplicationCommandOptionChoice<string>[] =
  providers.map(({ name: n }) => ({ name: n, value: n }));

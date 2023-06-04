// Run:
// deno run -A bot/http/main.ts
// ngrok http 8000

import { serve } from "./deps.ts";
import { ENV } from "../env/mod.ts";
import { APP_PERKS } from "../env/app/mod.ts";
import { providers } from "../env/providers/mod.ts";
import { Registry } from "../../perks/provider/registry/mod.ts";
import { overwrite } from "../client/mod.ts";
import { Handler } from "./handler/mod.ts";
import { Engine } from "../../perks/engine/mod.ts";
import { DenoKVStorer } from "../../storer/deno_kv/mod.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  // Implement Storer class.
  const store = new DenoKVStorer(await Deno.openKv());

  // Create a Perks provider registry.
  const registry = new Registry(providers);

  // Create a Perks engine.
  const engine = new Engine(store, registry);

  // Overwrite the Discord Application Command.
  const overwritten = await overwrite({
    botID: ENV.botID,
    botToken: ENV.botToken,
    app: APP_PERKS,
  });
  if (!overwritten.ok) {
    throw new Error(
      `Failed to overwrite Discord Application Command. Error: ${await overwritten
        .text()}`,
    );
  }

  // Create a new handler.
  const handler = new Handler(engine, ENV.publicKey);

  serve(async (r: Request) => {
    const u = new URL(r.url);
    switch (u.pathname) {
      // TODO: Handle env.registerPath. This helper endpoint is used to
      // register the bot with a Discord user's guild.

      default: {
        return await handler.handle(r);
      }
    }
  });
}

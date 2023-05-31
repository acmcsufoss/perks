// Run:
// deno run -A --unstable bot/http/main.ts
// ngrok http 8000

import { serve } from "./deps.ts";
import { mustEnv } from "../env/mod.ts";
import { APP_PERKS } from "../env/app/mod.ts";
import { providers } from "../env/providers/mod.ts";
import { Registry } from "../../perks/provider/registry/mod.ts";
import { overwrite } from "../client/mod.ts";
import { DefaultHandler } from "./handler/default/mod.ts";
import { DefaultEngine } from "../../perks/engine/default/mod.ts";
import { DenoKVStorer } from "../../storer/deno_kv/mod.ts";

if (import.meta.main) {
  await main();
}

async function main() {
  // Retrieve the required environment variables.
  const env = mustEnv();

  // Implement Storer class.
  const store = new DenoKVStorer(await Deno.openKv());

  // Create a Perks provider registry.
  const registry = new Registry(providers);

  // Create a Perks engine.
  const engine = new DefaultEngine(store, registry);

  // Overwrite the Discord Application Command.
  const { ok } = await overwrite({ ...env, app: APP_PERKS });
  if (!ok) {
    throw new Error("Failed to overwrite Discord Application Command");
  }

  // Create a new handler.
  const handler = new DefaultHandler(engine, env.publicKey);

  serve(async (r: Request) => {
    const u = new URL(r.url);
    switch (u.pathname) {
      case env.diagnosePath: {
        const diagnosis = await store.diagnoseTables();
        return new Response(JSON.stringify(diagnosis, null, 2));
      }

      // TODO: Handle env.registerPath.

      default: {
        return await handler.handle(r);
      }
    }
  });
}

// Run:
// deno run -A bot/http/main.ts
// ngrok http 8000

import { postgres, serve } from "./deps.ts";

import { PgStorer } from "../../storer/pg/mod.ts";
import { mustEnv } from "../env/mod.ts";
import { APP_PERKS } from "../env/app/mod.ts";
import { providers } from "../env/providers/mod.ts";
import { Registry } from "../../perks/provider/registry/mod.ts";
import { overwrite } from "../client/client.ts";
import { Engine } from "../../perks/engine/mod.ts";
import { DefaultHandler } from "./handler/default/handler.ts";

// Retrieve the required environment variables.
const env = mustEnv();

// Create a database pool with three connections that are lazily established.
const pool = new postgres.Pool(env.databaseURL, 3, true);

// Implement Storer class.
const store = new PgStorer(pool);

// Create tables if they don't exist.
// await store.dropTables();

// await store.createTables();

// TEST QUERIES 
await store.doMintQuery({
  type: "mint",
  minter: "test",
  max_uses: 1,
  milliseconds: 100
})

await store.doMintQuery({
  type: "mint2",
  minter: "test2",
  max_uses: 1,
  milliseconds: 100
})

await store.doAwardQuery({
  awarder: "test",
  awardee: "test",
  mint_id: 1,
})

await store.doUnmintQuery({
  id: 1
})




// Create a Perks provider registry.
const registry = new Registry(providers);

// Create a Perks engine.
const engine = new Engine(store, registry);

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
      // Diagnose the database.
      const diagnosis = await store.diagnoseTables();
      return new Response(JSON.stringify(diagnosis, null, 2));
    }

    default: {
      // Handle the request.
      return await handler.handle(r);
    }
  }
});

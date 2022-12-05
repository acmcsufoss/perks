// Run:
// deno run -A bot/http/main.ts

import { postgres, serve } from "./deps.ts";

import { PgStorer } from "../../storer/pg/mod.ts";
import { mustEnv } from "../env/mod.ts";
import { CMD_PERKS } from "../env/cmd/mod.ts";
import { overwrite } from "../client/client.ts";
import { DefaultHandler } from "./handler/default/handler.ts";

// Retrieve the required environment variables.
const env = mustEnv();

// Create a database pool with three connections that are lazily established.
const pool = new postgres.Pool(env.databaseURL, 3, true);

// Implement Storer class.
const store = new PgStorer(pool);

// Create a new handler.
const handler = new DefaultHandler(store, env.publicKey);

// Overwrite application commands.
// TODO: Call this from within a GitHub workflow.
await overwrite({ ...env, body: CMD_PERKS });

serve(async (r: Request) => {
  const u = new URL(r.url);

  switch (u.pathname) {
    case env.registerPath: {
      const opts = { ...env, body: CMD_PERKS };
      const guildID = u.searchParams.get("guild_id");
      if (guildID) {
        opts.guildID = guildID;
      }

      return await overwrite(opts);
    }

    default: {
      // Handle the request.
      return await handler.handle(r);
    }
  }
});

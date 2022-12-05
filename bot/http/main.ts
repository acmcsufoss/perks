import { postgres, serve } from "./deps.ts";

import { mustEnv } from "../env/mod.ts";
import { CMD_PERKS } from "../env/cmd/mod.ts";

import { PgStorer } from "../../storer/pg/mod.ts";

import { overwrite } from "../client/client.ts";

import { DefaultHandler } from "./handler/default/handler.ts";

// Retrieve the required environment variables.
const env = mustEnv();

// Overwrite application commands.
await overwrite({ ...env, body: CMD_PERKS });

serve(async (r: Request) => {
  // Create a database pool with three connections that are lazily established
  const pool = new postgres.Pool(env.databaseURL, 3, true);

  // Implement Storer class.
  const store = new PgStorer(pool);

  // Create a new handler.
  const handler = new DefaultHandler(store, env.publicKey);

  // Handle the request.
  return await handler.handle(r);
});

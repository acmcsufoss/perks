// TODO: Copy Postgres example https://dash.deno.com/playground/tutorial-postgres
import { postgres, serve } from "./deps.ts";

import { mustEnv } from "../env/mod.ts";
import { APP_PERKS } from "../env/perks/mod.ts";

import { PostgresStorer } from "../../storer/pg/mod.ts";

import { overwrite } from "../client/client.ts";

import { DefaultHandler } from "./handler/default/handler.ts";

serve(async (r: Request) => {
  const env = mustEnv();

  // Create a database pool with three connections that are lazily established
  const pool = new postgres.Pool(env.databaseURL, 3, true);

  // Implement Storer class.
  const store = new PostgresStorer(pool);

  await overwrite({ ...env, body: APP_PERKS });
  const handler = new DefaultHandler(storer, env.publicKey);
  return await handler.handle(r);
});

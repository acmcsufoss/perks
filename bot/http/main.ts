import { serve } from "../deps.ts";
import { ENV } from "../env/mod.ts";
import { APP_PERKS } from "../env/app/mod.ts";
import { providers } from "../env/providers/mod.ts";
import { Registry } from "../../perks/provider/registry/mod.ts";
import { overwrite } from "../client/mod.ts";
import { Handler } from "./handler/mod.ts";
import { Engine } from "../../perks/engine/mod.ts";
import { DenoKVStorer } from "../../storer/deno_kv/mod.ts";
import { doNgrok } from "./ngrok.ts";

if (import.meta.main) {
  await main();
}

/**
 * main is the entrypoint for the HTTP server.
 */
async function main() {
  // In development mode, we use ngrok to expose the server to the Internet.
  if (ENV.dev) {
    doNgrok()
      .then((url) => console.log("Interactions endpoint URL:", url))
      .catch((error) => console.error(error))
      .finally(() => console.log("Ngrok done!"));
  }

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

  // Start the server.
  serve(
    (r: Request) => {
      const u = new URL(r.url);
      switch (u.pathname) {
        // TODO: Handle env.registerPath. This helper endpoint is used to
        // register the bot with a Discord user's guild.

        default: {
          return handler.handle(r);
        }
      }
    },
    {
      port: ENV.port,
      onListen() {
        console.log(`Listening on http://localhost:${ENV.port}`);
      },
    },
  );
}

import { serve } from "./bot/deps.ts";
import { overwrite } from "./bot/client/mod.ts";
import { ENV } from "./bot/env/mod.ts";
import { APP_PERKS } from "./bot/app/mod.ts";
import { providers } from "./perks/provider/providers/mod.ts";
import { Registry } from "./perks/provider/registry/mod.ts";
import { Handler } from "./bot/http/handler/mod.ts";
import { doNgrok } from "./bot/http/ngrok.ts";
import { Engine } from "./perks/engine/mod.ts";
import { DenoKVStorer } from "./storer/deno_kv/mod.ts";

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
      .then((url) => {
        console.log(`Interactions endpoint URL: ${url}`);
        console.log(
          `Discord application information URL: https://discord.com/developers/applications/${ENV.botID}/information`,
        );
        console.log(`Invite URL: ${url}${ENV.invitePath}`);
      })
      .catch((error) => console.error(error));
  }

  // Implement Storer class.
  const kv = await Deno.openKv(ENV.dev ? "./kv.db" : undefined);
  const store = new DenoKVStorer(kv, ["perks"]);

  // Create a Perks provider registry.
  const registry = new Registry(providers);

  // Create a Perks engine.
  const engine = new Engine(
    store,
    registry,
    ENV.adminRoleIDs,
    ENV.memberRoleIDs,
  );

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
  serve((r: Request) => {
    const u = new URL(r.url);
    switch (u.pathname) {
      case ENV.invitePath: {
        return Response.redirect(
          `https://discord.com/api/oauth2/authorize?client_id=${ENV.botID}&scope=applications.commands`,
        );
      }

      default: {
        return handler.handle(r)
          .catch((error) => {
            console.log(error);
            return new Response(
              "Internal Server Error",
              { status: 500 },
            );
          });
      }
    }
  }, {
    port: ENV.port,
    onListen() {
      console.log(`Listening on http://localhost:${ENV.port}`);
    },
  });
}

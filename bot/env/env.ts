import { loadSync, parseBoolean } from "../deps.ts";

loadSync({ export: true });

/**
 * ENV is a collection of environment variables.
 */
export const ENV = {
  // Required environment variables.
  publicKey: Deno.env.get("PUBLIC_KEY") || "",
  guildID: Deno.env.get("GUILD_ID") || "",
  botID: Deno.env.get("BOT_ID") || "",
  botToken: Deno.env.get("BOT_TOKEN") || "",

  // Optional environment variables.
  dev: parseBoolean(Deno.env.get("DEV")),
  // registerPath: Deno.env.get("REGISTER_PATH") || "/__register", // Register is how you add a bot to a server.
  // diagnosePath: Deno.env.get("DIAGNOSE_PATH") || "/__diagnose", // Diagnose is how you check the database.

  // Provider environment variables.
  port: parseInt(Deno.env.get("PORT") || "8080"),
  openaiAPIKey: Deno.env.get("OPENAI_API_KEY") || "",
} as const;

import "https://deno.land/std@0.190.0/dotenv/load.ts";

export const ENV = {
  // Required environment variables.
  publicKey: Deno.env.get("PUBLIC_KEY") || "",
  guildID: Deno.env.get("GUILD_ID") || "",
  botID: Deno.env.get("BOT_ID") || "",
  botToken: Deno.env.get("BOT_TOKEN") || "",

  // Optional environment variables.
  // registerPath: Deno.env.get("REGISTER_PATH") || "/__register", // Register is how you add a bot to a server.
  // diagnosePath: Deno.env.get("DIAGNOSE_PATH") || "/__diagnose", // Diagnose is how you check the database.

  // Provider environment variables.
  openaiAPIKey: Deno.env.get("OPENAI_API_KEY") || "",
} as const;

export type Env = typeof ENV;

export function mustEnv(): Env {
  for (const [key, value] of Object.entries(ENV)) {
    if (value === "") {
      throw new Error(`Missing environment variable: ${key}`);
    }
  }

  return ENV;
}

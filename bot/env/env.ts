export const ENV = {
  publicKey: Deno.env.get("PUBLIC_KEY") || "",
  guildID: Deno.env.get("GUILD_ID") || "",
  botToken: Deno.env.get("BOT_TOKEN") || "",
  databaseURL: Deno.env.get("DATABASE_URL") || "",
  databasePass: Deno.env.get("DATABASE_PASS") || "",
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

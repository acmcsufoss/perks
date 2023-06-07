import { loadSync, parseBoolean } from "../deps.ts";

loadSync({ export: true });

/**
 * ENV is a collection of environment variables.
 */
export const ENV = {
  // Required environment variables.
  publicKey: Deno.env.get("PUBLIC_KEY") || "",
  botID: Deno.env.get("BOT_ID") || "",
  botToken: Deno.env.get("BOT_TOKEN") || "",
  adminRoleIDs: Deno.env.get("ADMIN_ROLES")?.split(",") || [],
  memberRoleIDs: Deno.env.get("MEMBER_ROLES")?.split(",") || [],

  // Optional environment variables.
  dev: parseBoolean(Deno.env.get("DEV")),
  invitePath: Deno.env.get("INVITE_PATH") || "/__invite",

  // Provider environment variables.
  port: parseInt(Deno.env.get("PORT") || "8080"),
  openaiAPIKey: Deno.env.get("OPENAI_API_KEY") || "",
} as const;

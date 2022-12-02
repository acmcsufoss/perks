import type { RESTPostAPIApplicationCommandsJSONBody } from "../deps.ts";

const DISCORD_API_URL = "https://discord.com/api/v8";

export interface OverwriteConfig {
  publicKey: string;
  guildID: string;
  botToken: string;
  body: RESTPostAPIApplicationCommandsJSONBody;
}

/**
 * overwrite overwrites the Discord Slash Commands associated with this server.
 *
 * Based on this cURL command:
 * ```bash
 * BOT_TOKEN='replace_me_with_bot_token'
 * CLIENT_ID='replace_me_with_client_id'
 * curl -X POST \
 * -H 'Content-Type: application/json' \
 * -H "Authorization: Bot $BOT_TOKEN" \
 * -d '{"name":"hello","description":"Greet a person","options":[{"name":"name","description":"The name of the person","type":3,"required":true}]}' \
 * "https://discord.com/api/v8/applications/$CLIENT_ID/commands"
 */
export async function overwrite(
  { publicKey, guildID, botToken, body }: OverwriteConfig,
) {
  const url = makeRegisterGuildCommandsURL(publicKey, guildID);
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": makeBotAuthorization(botToken),
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error(
      `Failed to overwrite Discord Slash Commands: ${response.status} ${response.statusText}`,
    );
  }
  const result = await response.json();
  console.log({ result });
}

function makeRegisterGuildCommandsURL(
  clientID: string,
  guildID: string,
  base = DISCORD_API_URL,
) {
  return new URL(`${base}/applications/${clientID}/guilds/${guildID}/commands`);
}

// TODO: Expose a function to delete the commands.
// function makeDeleteGuildCommandsURL(
//   clientID: string,
//   guildID: string,
//   commandID: string,
//   base = DISCORD_API_URL,
// ) {
//   return new URL(
//     `${base}/applications/${clientID}/guilds/${guildID}/commands/${commandID}`,
//   );
// }

function makeBotAuthorization(botToken: string) {
  return botToken.startsWith("Bot ") ? botToken : `Bot ${botToken}`;
}

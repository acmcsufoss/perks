import type { APIApplicationCommandInteractionDataOption } from "../../../deps.ts";
import { InteractionResponseType } from "../../../deps.ts";

export function handle(data: APIApplicationCommandInteractionDataOption[]) {
  // This is a command interaction. We will handle it in a bit.
  console.log("Handling: ", { data });
  return new Response(JSON.stringify({
    type: InteractionResponseType.ChannelMessageWithSource,
    data: {
      content: "Hello World!",
    },
  }));
}

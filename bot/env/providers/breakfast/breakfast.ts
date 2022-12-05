import type { APIInteractionResponse } from "../../../../bot/deps.ts";
import { InteractionResponseType } from "../../../../bot/deps.ts";

import type {
  Provider,
  ProviderRequest,
} from "../../../../perks/provider/mod.ts";

export class Breakfast implements Provider {
  public readonly name = "breakfast";

  // TODO: Figure out the only properties we want to return.
  public async use(r: ProviderRequest): Promise<APIInteractionResponse> {
    const food = await pickRandomBreakfastEmoji();
    return Promise.resolve({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: {
        content:
          `This ${r.perk.type} perk was minted by ${r.perk.minter} at ${r.perk.minted_at}.

This perk was awarded to ${r.award.awardee} by ${r.award.awarder} at ${r.award.awarded_at}.
        
You have ${r.perk.available - 1} uses remaining.
        
Here is your breakfast: ${food}`,
      },
    });
  }
}

const randomBreakfastEmoji = ["🥞", "🥓", "🍳", "🥐", "🥯"];

function pickRandomBreakfastEmoji(): Promise<string> {
  return Promise.resolve(
    randomBreakfastEmoji[~~(Math.random() * randomBreakfastEmoji.length)],
  );
}

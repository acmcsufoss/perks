import type { APIInteractionResponse } from "../../../../bot/deps.ts";
import { InteractionResponseType } from "../../../../bot/deps.ts";

import type { Image, ImageOptions } from "./deps.ts";

import type {
  Provider,
  ProviderRequest,
} from "../../../../perks/provider/mod.ts";

/**
 * DALLE2 is the name of the provider.
 */
export const DALLE2 = "dalle2";

/**
 * DALLE2 is a provider that uses OpenAI's DALL-E model to generate images.
 */
export class Dalle2 implements Provider {
  public readonly name = DALLE2;

  constructor(public readonly openaiAPIKey: string) {}

  public async use(r: ProviderRequest): Promise<APIInteractionResponse> {
    const prompt = r.query ?? makeRandomPrompt();
    const imageData = await generateOpenAIImage(this.openaiAPIKey, { prompt });
    const content = `Here is your generated image: ${imageData.data[0].url}`;
    return Promise.resolve({
      type: InteractionResponseType.ChannelMessageWithSource,
      data: { content },
    });
  }
}

const OPENAI_API_URL = "https://api.openai.com/v1/images/generations";

async function generateOpenAIImage(
  openaiAPIKey: string,
  request: ImageOptions,
): Promise<Image> {
  const response = await fetch(
    OPENAI_API_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${openaiAPIKey}`,
      },
      body: JSON.stringify(request),
    },
  );

  return response.json();
}

function makeRandomPrompt(): string {
  return "A cute cat";
}

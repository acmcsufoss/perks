import type { APIInteractionResponse } from "../../bot/deps.ts";

/**
 * Provider for a Perk.
 */
export interface Provider {
  use(query: string): Promise<APIInteractionResponse>;
}

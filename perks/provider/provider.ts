import type { APIInteractionResponse } from "../../bot/deps.ts";
import type { StoredSummary } from "../../storer/mod.ts";

export interface ProviderRequest extends StoredSummary {
  query?: string;
}

/**
 * Provider for a Perk.
 */
export interface Provider {
  name: string;

  use(r: ProviderRequest): Promise<APIInteractionResponse>;
}

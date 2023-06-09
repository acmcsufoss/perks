import { assertEquals } from "../dev_deps.ts";
import type { MintedPerk } from "./perk.ts";
import { parseIsAvailable } from "./perk.ts";

const TEST_AVAILABLE_PERK: MintedPerk = {
  id: "1",
  type: "test",
  minter_id: "1",
  minted_at: "2023-01-01T00:00:00.000Z",
  max_uses: 1,
  milliseconds: 0,
  available: 1,
};

const TEST_INFINITE_PERK: MintedPerk = {
  id: "1",
  type: "test",
  minter_id: "1",
  minted_at: "2023-01-01T00:00:00.000Z",
  max_uses: 0,
  milliseconds: 0,
  available: -1,
};

const TEST_UNAVAILABLE_PERK: MintedPerk = {
  id: "1",
  type: "test",
  minter_id: "1",
  minted_at: "2023-01-01T00:00:00.000Z",
  max_uses: 1,
  milliseconds: 0,
  available: 0,
};

const TEST_EXPIRED_PERK: MintedPerk = {
  id: "1",
  type: "test",
  minter_id: "1",
  minted_at: "2023-01-01T00:00:00.000Z",
  max_uses: 1,
  milliseconds: 1,
  available: 1,
};

Deno.test("parseIsAvailable returns true when available", () => {
  assertEquals(parseIsAvailable(TEST_AVAILABLE_PERK), true);
});

Deno.test("parseIsAvailable returns true when infinite", () => {
  assertEquals(parseIsAvailable(TEST_INFINITE_PERK), true);
});

Deno.test("parseIsAvailable returns false when not available", () => {
  assertEquals(parseIsAvailable(TEST_UNAVAILABLE_PERK), false);
});

Deno.test("parseIsAvailable returns false when expired", () => {
  assertEquals(parseIsAvailable(TEST_EXPIRED_PERK), false);
});

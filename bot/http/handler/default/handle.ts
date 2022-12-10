import type {
  APIApplicationCommandInteractionDataSubcommandOption,
  APIChatInputApplicationCommandInteraction,
  APIInteractionResponse,
} from "../../../deps.ts";
import {
  ApplicationCommandOptionType,
  InteractionResponseType,
} from "../../../deps.ts";

import type { Client, UseRequest } from "../../../../perks/client/mod.ts";
import {
  MINT,
  MINT_MAX_USES,
  MINT_MILLISECONDS,
} from "../../../env/app/sub/mint.ts";
import { UNMINT, UNMINT_MINT_ID } from "../../../env/app/sub/unmint.ts";
import {
  AWARD,
  AWARD_MEMBER,
  AWARD_MINT_ID,
} from "../../../env/app/sub/award.ts";
import { REVOKE, REVOKE_AWARD_ID } from "../../../env/app/sub/revoke.ts";
import { LIST, LIST_AWARD_MEMBER } from "../../../env/app/sub/list.ts";
import { USE, USE_MINT_ID, USE_QUERY } from "../../../env/app/sub/use.ts";

export async function handle(
  client: Client,
  interaction: APIChatInputApplicationCommandInteraction,
): Promise<APIInteractionResponse> {
  if (!interaction.data.options || interaction.data.options.length === 0) {
    throw new Error("No options provided");
  }

  const { 0: { name, type } } = interaction.data.options;
  if (type !== ApplicationCommandOptionType.Subcommand) {
    throw new Error("Invalid option type");
  }

  if (!interaction.member) {
    console.log({ interaction });
    throw new Error("No user provided");
  }

  const { 0: { options } } = (interaction.data
    .options as APIApplicationCommandInteractionDataSubcommandOption[]);

  switch (name) {
    case MINT: {
      const result = await client.mint({
        type: name,
        minter: interaction.member.user.id,
        max_uses: Number(
          options?.find((o) => o.name === MINT_MAX_USES)?.value,
        ),
        milliseconds: Number(
          options?.find((o) => o.name === MINT_MILLISECONDS)?.value,
        ),
      });

      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Minted ${result.type} perk with ID ${result.id}`,
        },
      };
    }

    case UNMINT: {
      const id = options?.find((o) => o.name === UNMINT_MINT_ID)?.value;
      if (!id) {
        throw new Error("No ID provided");
      }

      const result = await client.unmint({ id: String(id) });
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Unminted ${result.type} perk with ID ${result.id}`,
        },
      };
    }

    case AWARD: {
      const id = options?.find((o) => o.name === AWARD_MINT_ID)?.value;
      if (!id) {
        throw new Error("No ID provided");
      }

      const awardee = options?.find((o) => o.name === AWARD_MEMBER)?.value;
      if (!awardee) {
        throw new Error("No member provided");
      }

      const result = await client.award({
        mint_id: String(id),
        awarder: interaction.user?.id ?? "0",
        awardee: String(awardee),
      });
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content:
            `Awarded perk ${result.mint_id} to ${result.awardee} (award ID: ${result.id})`,
        },
      };
    }

    case REVOKE: {
      const id = options?.find((o) => o.name === REVOKE_AWARD_ID)?.value;
      if (!id) {
        throw new Error("No ID provided");
      }

      const result = await client.revoke({ award_id: String(id) });
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: `Revoked perk ${result.mint_id} from ${result.awardee}`,
        },
      };
    }

    case LIST: {
      const id = options?.find((o) => o.name === LIST_AWARD_MEMBER)?.value;
      const request = id ? { awardee: String(id) } : {};
      const result = await client.list(request);
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: result.awards.map((r) =>
            `${r.perk.type} perk ${r.award.id} (mint ID: ${r.perk.id}; uses remaining: ${r.perk.available}) awarded to ${r.award.awardee} by ${r.award.awarder} at ${r.award.awarded_at}`
          ).join("\n"),
        },
      };
    }

    case USE: {
      const id = options?.find((o) => o.name === USE_MINT_ID)?.value;
      if (!id) {
        throw new Error("No name provided");
      }

      const request: UseRequest = { mint_id: String(id) };
      const query = options?.find((o) => o.name === USE_QUERY)?.value;
      if (query) {
        request.query = String(query);
      }

      const result = await client.use(request);
      return result.data;
    }

    default: {
      return {
        type: InteractionResponseType.ChannelMessageWithSource,
        data: {
          content: "Hello World!",
        },
      };
    }
  }
}

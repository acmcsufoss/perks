import type {
  APIApplicationCommandInteractionDataBasicOption,
  APIChatInputApplicationCommandInteraction,
  APIInteractionResponse,
} from "../../deps.ts";
import { ApplicationCommandOptionType } from "../../deps.ts";
import type { EngineInterface, UseRequest } from "../../../perks/engine/mod.ts";
import { MINT, MINT_MAX_USES, MINT_MILLISECONDS } from "../../app/sub/mint.ts";
import { UNMINT, UNMINT_MINT_ID } from "../../app/sub/unmint.ts";
import { AWARD, AWARD_MEMBER, AWARD_MINT_ID } from "../../app/sub/award.ts";
import { REVOKE, REVOKE_AWARD_ID } from "../../app/sub/revoke.ts";
import { LIST, LIST_AWARD_MEMBER } from "../../app/sub/list.ts";
import { USE, USE_MINT_ID, USE_QUERY } from "../../app/sub/use.ts";
import {
  makeAwardInteractionResponse,
  makeErrorInteractionResponse,
  makeListInteractionResponse,
  makeMintInteractionResponse,
  makeRevokeInteractionResponse,
  makeUnmintInteractionResponse,
} from "./responses.ts";

/**
 * handle handles an interaction.
 */
export async function handle(
  engine: EngineInterface,
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
    throw new Error("No user provided");
  }

  const options = parseOptions(
    interaction.data
      .options as APIApplicationCommandInteractionDataBasicOption[],
  );

  switch (name) {
    case MINT: {
      const result = await engine.mint({
        type: name,
        minter_id: interaction.member.user.id,
        max_uses: options[ApplicationCommandOptionType.Integer][MINT_MAX_USES],
        milliseconds:
          options[ApplicationCommandOptionType.Integer][MINT_MILLISECONDS],
      });

      return makeMintInteractionResponse(result);
    }

    case UNMINT: {
      const id = options[ApplicationCommandOptionType.String][UNMINT_MINT_ID];
      if (!id) {
        return makeErrorInteractionResponse("No ID provided");
      }

      const result = await engine.unmint({ id: id });
      return makeUnmintInteractionResponse(result);
    }

    case AWARD: {
      const id = options[ApplicationCommandOptionType.String][AWARD_MINT_ID];
      if (!id) {
        return makeErrorInteractionResponse("No ID provided");
      }

      const awardee_id =
        options[ApplicationCommandOptionType.User][AWARD_MEMBER];
      if (!awardee_id) {
        return makeErrorInteractionResponse("No member provided");
      }

      const result = await engine.award({
        mint_id: id,
        awarder_id: interaction.member.user.id,
        awardee_id: awardee_id,
      });
      return makeAwardInteractionResponse(result);
    }

    case REVOKE: {
      const id = options[ApplicationCommandOptionType.String][REVOKE_AWARD_ID];
      if (!id) {
        return makeErrorInteractionResponse("No ID provided");
      }

      const result = await engine.revoke({ award_id: id });
      return makeRevokeInteractionResponse(result);
    }

    case LIST: {
      const id = options[ApplicationCommandOptionType.User][LIST_AWARD_MEMBER];
      const request = id ? { awardee_id: id } : {};
      const result = await engine.list(request);
      return makeListInteractionResponse(result);
    }

    case USE: {
      const id = options[ApplicationCommandOptionType.String][USE_MINT_ID];
      if (!id) {
        return makeErrorInteractionResponse("No ID provided");
      }

      const request: UseRequest = { mint_id: id };
      const query = options[ApplicationCommandOptionType.String][USE_QUERY];
      if (query) {
        request.query = query;
      }

      const result = await engine.use(request);
      return result.data;
    }

    default: {
      return makeErrorInteractionResponse("Invalid command. Please try again.");
    }
  }
}

// TODO: Infer more specific return types based on registered application command options.
function parseOptions(
  options: APIApplicationCommandInteractionDataBasicOption[],
) {
  const result = {
    [ApplicationCommandOptionType.String]: {} as Record<string, string>,
    [ApplicationCommandOptionType.Integer]: {} as Record<string, number>,
    [ApplicationCommandOptionType.Boolean]: {} as Record<string, boolean>,
    [ApplicationCommandOptionType.User]: {} as Record<string, string>,
    [ApplicationCommandOptionType.Channel]: {} as Record<string, string>,
    [ApplicationCommandOptionType.Role]: {} as Record<string, string>,
    [ApplicationCommandOptionType.Mentionable]: {} as Record<string, string>,
    [ApplicationCommandOptionType.Number]: {} as Record<string, number>,
    [ApplicationCommandOptionType.Attachment]: {} as Record<string, string>,
    [ApplicationCommandOptionType.Subcommand]: {} as Record<string, unknown>,
    [ApplicationCommandOptionType.SubcommandGroup]: {} as Record<
      string,
      unknown
    >,
  } as const;

  for (const o of options) {
    result[o.type][o.name] = o.value;
  }

  return result;
}

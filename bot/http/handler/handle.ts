import type {
  APIChatInputApplicationCommandInteraction,
  APIInteractionResponse,
} from "../../deps.ts";
import { ApplicationCommandOptionType } from "../../deps.ts";
import type { EngineInterface } from "../../../perks/engine/mod.ts";
import { MINT, parseMintOptions } from "../../app/sub/mint.ts";
import { parseUnmintOptions, UNMINT } from "../../app/sub/unmint.ts";
import { AWARD, parseAwardOptions } from "../../app/sub/award.ts";
import { parseRevokeOptions, REVOKE } from "../../app/sub/revoke.ts";
import { LIST, parseListOptions } from "../../app/sub/list.ts";
import { parseUseOptions, USE } from "../../app/sub/use.ts";
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

  switch (name) {
    case MINT: {
      const subcommandOptions = interaction.data.options.find((option) =>
        option.name === MINT
      );
      if (
        subcommandOptions?.type !== ApplicationCommandOptionType.Subcommand ||
        !subcommandOptions.options
      ) {
        throw new Error("Invalid option type");
      }

      const options = parseMintOptions(subcommandOptions.options);
      const result = await engine.mint({
        type: options.name,
        minter_id: interaction.member.user.id,
        minter_role_ids: interaction.member.roles,
        max_uses: options.max_uses,
        milliseconds: options.milliseconds,
      });

      return makeMintInteractionResponse(result);
    }

    case UNMINT: {
      const subcommandOptions = interaction.data.options.find((option) =>
        option.name === UNMINT
      );
      if (
        subcommandOptions?.type !== ApplicationCommandOptionType.Subcommand ||
        !subcommandOptions.options
      ) {
        throw new Error("Invalid option type");
      }

      const options = parseUnmintOptions(subcommandOptions.options);
      const result = await engine.unmint({
        id: options.mint_id,
        minter_role_ids: interaction.member.roles,
      });
      return makeUnmintInteractionResponse(result);
    }

    case AWARD: {
      const subcommandOptions = interaction.data.options.find((option) =>
        option.name === AWARD
      );
      if (
        subcommandOptions?.type !== ApplicationCommandOptionType.Subcommand ||
        !subcommandOptions.options
      ) {
        throw new Error("Invalid option type");
      }

      const options = parseAwardOptions(subcommandOptions.options);
      const result = await engine.award({
        mint_id: options.mint_id,
        awarder_id: interaction.member.user.id,
        awardee_id: options.member ?? interaction.member.user.id,
        awarder_role_ids: interaction.member.roles,
      });
      return makeAwardInteractionResponse(result);
    }

    case REVOKE: {
      const subcommandOptions = interaction.data.options.find((option) =>
        option.name === REVOKE
      );
      if (
        subcommandOptions?.type !== ApplicationCommandOptionType.Subcommand ||
        !subcommandOptions.options
      ) {
        throw new Error("Invalid option type");
      }

      const options = parseRevokeOptions(subcommandOptions.options);
      const result = await engine.revoke({
        award_id: options.award_id,
        awarder_role_ids: interaction.member.roles,
      });
      return makeRevokeInteractionResponse(result);
    }

    case LIST: {
      const subcommandOptions = interaction.data.options.find((option) =>
        option.name === LIST
      );
      if (
        subcommandOptions?.type !== ApplicationCommandOptionType.Subcommand ||
        !subcommandOptions.options
      ) {
        throw new Error("Invalid option type");
      }

      const options = parseListOptions(subcommandOptions.options);
      const result = await engine.list({
        awardee_id: options.awardee,
        actor_id: interaction.member.user.id,
        awarder_role_ids: interaction.member.roles,
      });
      return makeListInteractionResponse(result);
    }

    case USE: {
      const subcommandOptions = interaction.data.options.find((option) =>
        option.name === USE
      );
      if (
        subcommandOptions?.type !== ApplicationCommandOptionType.Subcommand ||
        !subcommandOptions.options
      ) {
        throw new Error("Invalid option type");
      }

      const options = parseUseOptions(subcommandOptions.options);
      const result = await engine.use({
        award_id: options.award_id,
        query: options.query,
        actor_id: interaction.member.user.id,
        awarder_role_ids: interaction.member.roles,
      });
      return result.data;
    }

    default: {
      return makeErrorInteractionResponse("Invalid command. Please try again.");
    }
  }
}

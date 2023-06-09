import type {
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandOption,
} from "../../deps.ts";
import { ApplicationCommandOptionType } from "../../deps.ts";

export const LIST = "list";
export const LIST_DESCRIPTION = "List perks";
export const LIST_AWARD_MEMBER = "awardee";
export const LIST_AWARD_MEMBER_DESCRIPTION = "The member to list perks for";

/** Example: /perks list <awardee_id?> */
export const SUB_LIST: APIApplicationCommandOption = {
  name: LIST,
  description: LIST_DESCRIPTION,
  type: ApplicationCommandOptionType.Subcommand,
  options: [
    {
      name: LIST_AWARD_MEMBER,
      description: LIST_AWARD_MEMBER_DESCRIPTION,
      type: ApplicationCommandOptionType.User,
      required: false,
    },
  ],
};

/**
 * parseListOptions parses the options for the list command.
 */
export function parseListOptions(
  options: APIApplicationCommandInteractionDataOption[],
): {
  [LIST_AWARD_MEMBER]?: string;
} {
  const awardeeOption = options.find((option) =>
    option.name === LIST_AWARD_MEMBER
  );
  if (
    awardeeOption && awardeeOption.type !== ApplicationCommandOptionType.User
  ) {
    throw new Error("Invalid awardee type");
  }

  return {
    awardee: awardeeOption?.value,
  };
}

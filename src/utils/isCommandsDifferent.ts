import { ApplicationCommand, ApplicationCommandOption } from "discord.js";

interface Choice {
  name: string;
  value: string;
}

interface CommandOption {
  name: string;
  description?: string;
  type?: string;
  required?: boolean;
  choices?: Choice[];
}

interface Command {
  description: string;
  options?: CommandOption[];
}

const areCommandsDifferent = (existingCommand: ApplicationCommand, localCommand: Command): boolean => {

  const areChoicesDifferent = (existingChoices: Choice[], localChoices: Choice[]): boolean => {
    for (const localChoice of localChoices) {
      const existingChoice = existingChoices.find(choice => choice.name === localChoice.name);

      if (!existingChoice || localChoice.value !== existingChoice.value) {
        return true;
      }
    }
    return false;
  };

  const areOptionsDifferent = (existingOptions, localOptions: CommandOption[]): boolean => {
    for (const localOption of localOptions) {
      const existingOption = existingOptions.find(option => option.name === localOption.name);

      if (!existingOption) {
        return true;
      }

      if (
        localOption.description !== existingOption.description ||
        localOption.type !== existingOption.type ||
        (localOption.required || false) !== existingOption.required ||
        (localOption.choices?.length || 0) !== (existingOption.choices?.length || 0) ||
        areChoicesDifferent(localOption.choices || [], existingOption.choices || [])
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    existingCommand.description !== localCommand.description ||
    (existingCommand.options?.length || 0) !== (localCommand.options?.length || 0) ||
    areOptionsDifferent(existingCommand.options || [], localCommand.options || [])
  );
};

export default areCommandsDifferent;

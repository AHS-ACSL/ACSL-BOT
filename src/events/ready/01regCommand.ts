import { Client, ApplicationCommand } from "discord.js"; // Import relevant types from discord.js
import { testServer } from "../../../config.json";
import getApplicationCommands from "../../utils/getApplicationCommands";
import getlocalCommands,{ Command } from "../../utils/getLocalCommands";
import isCommandsDifferent from "../../utils/isCommandsDifferent";

const regCommand = async (client: Client) => {
  try {
    const localCommands: Command[] = await getlocalCommands();
    const applicationCommands = await getApplicationCommands(
      client,
      testServer
    );

    //console.log(localCommands);
    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;
      const existingCommand = applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`Deleted command ${name}`);
          continue;
        }

        if (isCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });
          console.log(`Edited command ${name}`);
        }
      } else {
        if (localCommand.deleted) {
          console.log(`Skipping Command ${name} as it is set to be deleted`);
          continue;
        }

        await applicationCommands.create({ name, description, options });
        console.log(`Created command ${name}`);
      }
    }
  } catch (error) {
    console.error(`Error registering commands: ${error}`);

  }
};

export default regCommand;

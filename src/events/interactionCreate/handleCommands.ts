import { Client, CommandInteraction } from "discord.js";
import { devs, testServer } from "../../../config.json";
import getlocalCommands, { Command } from "../../utils/getLocalCommands";

const handleInteraction = async (client: Client, interaction): Promise<void> => {
    if (!interaction.isCommand()) return;

    const localCommands = await getlocalCommands();

    try {
        const commandObject = localCommands.find((cmd) => cmd.name === interaction.commandName) as Command;
        console.log(commandObject);
        console.log(localCommands);
        if (!commandObject) return;
        
        if (commandObject.devOnly && !devs.includes(interaction.user.id)) {
            await interaction.reply({ content: "This is developer only", ephemeral: true });
            return;
        }
        if (commandObject.testOnly && interaction.guild!.id !== testServer) {
            await interaction.reply({ content: "This command cannot be run here", ephemeral: true });
            return;
        }

        if (commandObject.permissionsRequired) {
            for (const permission of commandObject.permissionsRequired) {
                if (!interaction.member!.permissions.has(permission)) {
                    await interaction.reply({ content: "You do not have the required permissions to run this command", ephemeral: true });
                    return;
                }
            }
        }

        if (commandObject.botPermissions) {
            const bot = interaction.guild!.members.cache.get(client.user!.id);
            for (const permission of commandObject.botPermissions) {
                if (!bot!.permissions.has(permission)) {
                    await interaction.reply({ content: "I do not have the required permissions to run this command", ephemeral: true });
                    return;
                }
            }
        }

        await commandObject.callback(client, interaction);

    } catch (error) {
        console.log(`Error running commands: ${error}`);
    }
};

export default handleInteraction;

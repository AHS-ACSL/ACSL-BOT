import { Client, ApplicationCommandManager, GuildApplicationCommandManager } from 'discord.js';

async function getApplicationCommands(client: Client, guildID: string | null): Promise<ApplicationCommandManager> {
    let applicationCommands: ApplicationCommandManager | GuildApplicationCommandManager;

    if (guildID) {
        const guild = await client.guilds.fetch(guildID);
        applicationCommands = guild.commands;
    } else {
        applicationCommands = client.application?.commands!;
    }

    await (applicationCommands as ApplicationCommandManager).fetch();
    return applicationCommands as ApplicationCommandManager;
}

export default getApplicationCommands;

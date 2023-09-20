import path from 'path';
import getAllFiles from '../utils/getAllFiles';
import type { Client } from 'discord.js';

const registerEvents = (client: Client) => {
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);
    for (const eventFolder of eventFolders) {
        const eventFiles = getAllFiles(eventFolder);
        eventFiles.sort((a, b) => a > b ? 1 : -1);
        const eventName = path.basename(eventFolder.replace(/\\/g, '/'));

        client.on(eventName, async (args: any) => {
            for (const eventFile of eventFiles) {
                const eventFunction = await import(eventFile);
                await eventFunction.default(client, args);
            }
        });
    }
};

export default registerEvents;

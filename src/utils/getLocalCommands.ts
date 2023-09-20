import path from 'path';
import getAllFiles from './getAllFiles';

export interface Command {
    name: string;
    description: string;
    options?: any[];  
    deleted?: boolean;
    devOnly?: boolean;
    testOnly?: boolean;
    permissionsRequired?: string[];
    botPermissions?: string[];
    callback?: (client: any, interaction: any) => Promise<void>;
}

const getloadCommands = (exceptions: string[] = []): Command[] => {
    let localCommands: Command[] = [];

    const commandsCategories = getAllFiles(path.join(__dirname, '..', 'commands'), true);

    for (const commandCategory of commandsCategories) {
        const commandFiles = getAllFiles(commandCategory);

        for (const commandFile of commandFiles) {
            const commandObject: Command = require(commandFile);
            if (exceptions.includes(commandObject.name)) continue;
            localCommands.push(commandObject);
        }
    }

    return localCommands;
}

export default getloadCommands;

import { Client, Message, TextChannel } from 'discord.js';
import config from '../../../config.json';

let lastCount: number = 0;
let lastMsgAuthor: string | null;

const countingHandler = async (client: Client, message: Message): Promise<void> => {
    if (!message.guild || message.author.bot) return;

    const countingChannel: TextChannel | undefined = client.channels.cache.get(config.countingChannel) as TextChannel;
    if (!countingChannel) return;

    if (message.channel.id === countingChannel.id) {
        let currentCount: number = parseInt(message.content);

        // Check if the message is a valid number
        if (isNaN(currentCount)) {
            await message.react('❌');
            await countingChannel.send(`Unable to parse as a number, next number is ${lastCount + 1}.`);
            return;
        }

        if (currentCount === lastCount + 1 && (!lastMsgAuthor || message.author.id !== lastMsgAuthor)) {
            await message.react('👍');
            lastCount = currentCount;
            lastMsgAuthor = message.author.id;
        } else {
            await message.react('❌');
            await countingChannel.send(`${message.author.username} messed up at number ${lastCount + 1}. Restarting at 1.`);
            lastCount = 0;
            lastMsgAuthor = null;
        }
    }
};

export default countingHandler;

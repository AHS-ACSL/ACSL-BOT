const config = require('../../../config.json');

let lastCount = 0;
let lastMsgAuthor;

module.exports = async (client, message) => {
    if (!message.guild || message.author.bot) return;

    const countingChannel = client.channels.cache.get(config.countingChannel);
    if (!countingChannel) return;

    if (message.channel.id === countingChannel.id) {
        let currentCount = parseInt(message.content);

        // Check if the message is a valid number
        if (isNaN(currentCount)) {
            message.react('❌');
            countingChannel.send(`Unable to parse as a number, next number is ${lastCount + 1}.`);
            return;
        }

        if (currentCount === lastCount + 1 && (!lastMsgAuthor || message.author.id !== lastMsgAuthor)) {
            message.react('👍');
            lastCount = currentCount;
            lastMsgAuthor = message.author.id;
        } else {
            message.react('❌');
            countingChannel.send(`${message.author.username} messed up at number ${lastCount + 1}. Restarting at 1.`);
            lastCount = 0;
            lastMsgAuthor = null;
        }
    }
};

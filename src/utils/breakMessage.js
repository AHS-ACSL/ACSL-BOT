async function sendMessage(channel, message, options = {}) {
    // Split the message into lines
    let lines = message.split('\n');
    let messageChunks = [];
    let currentChunk = '';

    // Combine lines back into chunks of less than or equal to 2000 characters
    for (const line of lines) {
        const potentialChunk = currentChunk + line + '\n';
        if (potentialChunk.length > 2000) {
            messageChunks.push(currentChunk);
            currentChunk = line + '\n';
        } else {
            currentChunk = potentialChunk;
        }
    }

    // Push any remaining content into the chunks
    if (currentChunk) {
        messageChunks.push(currentChunk);
    }

    // If the message is still too long, split every 2000 characters
    for (let i = 0; i < messageChunks.length; i++) {
        let chunk = messageChunks[i];
        while (chunk.length > 2000) {
            const part = chunk.substring(0, 2000);
            chunk = chunk.substring(2000);
            messageChunks.splice(i, 1, part, chunk);
        }
    }

    // Send each chunk as a separate message
    for (const chunk of messageChunks) {
        await channel.send(chunk, options);
    }
}

module.exports = sendMessage;

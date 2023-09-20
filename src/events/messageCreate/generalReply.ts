module.exports = async (client, message) => {
    if (!message.guild || message.author.bot) return;
    replyMessage(message);
};

const replyMessage = (message) => {

    switch (message.content.toLowerCase()) {
        case 'hello':
            message.reply(`error: 'cout<<"world"<<endl;' was not declared in this scope`);
            break;
        case 'hi':
            message.reply(`im not here`);
            break;
        case 'help':
            message.reply(`Im sorry, but I cant help you`);
            break;
        case 'java bad':
            message.reply(`I agree`);
            break;
        case 'java good':
            message.reply(`I disagree`);
            break;
        case 'java':
            message.reply(`at least its not javascript`);
            break;
    }

};
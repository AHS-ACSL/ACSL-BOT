module.exports = {
    name: 'ping',
    description: 'Pong!',
    //devOnly: bool,
    //testOnly: bool,
    //options: Object[],
    //deleted : bool,

    callback: (client,interaction) =>{
        interaction.reply(`Pong! ${client.ws.ping}ms`);
    }
}
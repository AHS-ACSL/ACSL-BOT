module.exports = {
    name: 'ping',
    description: 'Pong!',
    //devOnly: bool,
    //testOnly: bool,
    //options: Object[],
    //deleted : bool,

    callback: async (client,interaction) =>{
        await interaction.deferReply();

        const reply = await interaction.fetchReply();

        const ping = reply.createdTimestamp - interaction.createdTimestamp;

        interaction.editReply(`Pong! ${ping}ms | Websocket: ${client.ws.ping}ms`);
    }
}
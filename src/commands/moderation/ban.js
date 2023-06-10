const {ApplicationCommandOptionType, PermissionFlagsBits} = require('discord.js');

module.exports = {
    deleted: true,
    name: 'ban',
    description: 'this should never be used lol',
    options: [
    {
        name: 'user',
        description: 'the user to ban',
        required: true,
        type: ApplicationCommandOptionType.Mentionable,
    },
    {
        name: 'reason',
        description: 'the reason for the ban',
        required: false,
        type: ApplicationCommandOptionType.String,
    },
    ],

    permissionsRequired:[PermissionFlagsBits.Administrator],
    botPermissions:[PermissionFlagsBits.Administrator],



    callback: (client,interaction) =>{
        interaction.reply(`Lets not do that.`);
    }
}
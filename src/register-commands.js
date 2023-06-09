require("dotenv").config();
const {REST, Routes, ApplicationCommandOptionType} = require("discord.js");

const commands = [
    {
        name: "render-latex",
        description: "Renders latex code into an image",
        options: [
            {
                name: "code",
                description: "The latex code to render",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: "embed",
        description: "Embeds a message",
        options: [
            {
                name: "title",
                description: "The title of the embed",
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: "description",
                description: "The description of the embed",
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ]
    },
    {
        name: "sentreactionroles",
        description: "to reset the reaction roles message"
    }
];

const rest = new REST({version: "10"}).setToken(process.env.TOKEN);

(async() =>{
    try{
        console.log("Started refreshing application (/) commands.");
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {body: commands}
        );
        console.log("Successfully reloaded application (/) commands.");
    } catch(error){
        console.error(error);
    }
})();
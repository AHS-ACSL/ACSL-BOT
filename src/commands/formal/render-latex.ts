const {ApplicationCommandOptionType} = require("discord.js");
module.exports = {
    name: 'render-latex',
    description: 'finally something useful',
    //devOnly: bool,
    //testOnly: bool,
    options: Object[
        {
            name: "code",
            description: "The latex code to render",
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    //deleted : bool,

    callback: async (client,interaction) =>{
        const code = interaction.options.getString("code");
        const encodedCode = encodeURIComponent(code);
        const latexImageURL = `https://latex.codecogs.com/png.latex?\\bg_white\\dpi{200}${encodedCode}`;
        interaction.reply(latexImageURL);
    }
}
require("dotenv").config();
const {Client, IntentsBitField} = require("discord.js");

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on("ready", (c) => {
    console.log(`${c.user.tag} is ready!`);
});

client.on("messageCreate", (msg) => {
    if (msg.author.bot) {
      return;
    }
  

    switch(msg.content) {
        case "ping":
            msg.reply("pong");
            break;
        case "hello":
            msg.reply(`error: 'cout<<"world"<<endl;' was not declared in this scope`);
            break;
        
    }
  });

client.login(process.env.TOKEN);
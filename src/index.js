require("dotenv").config();
const {
  Client,
  IntentsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("messageCreate", (msg) => {
  if (msg.author.bot) {
    return;
  }

  switch (msg.content) {
    case "ping":
      msg.reply("pong");
      break;
    case "hello":
      msg.reply(`error: 'cout<<"world"<<endl;' was not declared in this scope`);
      break;
  }
});

const roles = [
  {
    id: "1116609854371549264",
    label: "Java",
  },
  {
    id: "1116609879411531867",
    label: "Python 3",
  },
  {
    id: "1116609910348730438",
    label: "C++",
  },
];

client.on("interactionCreate", async (interaction) => {
  if (interaction.isCommand()) {
    if (interaction.commandName === "hey") {
      interaction.reply("hello!");
    }
    if (interaction.commandName === "embed") {
      const title = interaction.options.getString("title");
      const description = interaction.options.getString("description");
      const embed = new EmbedBuilder()
        .setTitle(title)
        .setDescription(description)
        .setColor(13631488);
      interaction.reply({embeds: [embed]});
    }
    if(interaction.commandName === "sentreactionroles"){
      if(!interaction.member.permissions.has(8)) return;
      try {
        interaction.reply({
          content: "Sent the reaction roles message!",
          ephemeral: true,
        });
        const channel = await client.channels.cache.get("1116832903180075018");
        if (!channel) return;
    
        const row = new ActionRowBuilder();
    
        roles.forEach((role) => {
          row.components.push(
            new ButtonBuilder()
              .setCustomId(role.id)
              .setLabel(role.label)
              .setStyle(ButtonStyle.Primary)
          );
        });

        const message = new EmbedBuilder()
        .setTitle("Choose the programming langauge you are familiar with.")
        .setDescription("ACSL supports Java, Python 3, and C++.")
        .setColor(13631488);
    
        await channel.send({
          content: "",
          embeds: [message],
          components: [row],
        });
      } catch (error) {
        console.log(error);
      }
    }
  } else if (interaction.isButton()) {
    try {
      await interaction.deferReply({ephemeral: true});
      const role = interaction.guild.roles.cache.get(interaction.customId);
      if (!role) {
        await interaction.editReply({
          content: "I couldn't find that role",
        });
        return;
      }

      const hasRole = interaction.member.roles.cache.has(role.id);

      if (hasRole) {
        await interaction.member.roles.remove(role);
        await interaction.editReply(`The role ${role} has been removed.`);
        return;
      }

      await interaction.member.roles.add(role);
      await interaction.editReply(`The role ${role} has been added.`);
    } catch (error) {
      console.log(error);
    }
  }
});

client.on("ready", async (c) => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.login(process.env.TOKEN);

import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonStyle,
  ButtonBuilder,
} from "discord.js";

const roles = [
    // {
    //   id: "1116609854371549264",
    //   label: "Java",
    // },
    // {
    //   id: "1116609879411531867",
    //   label: "Python 3",
    // },
    // {
    //   id: "1116609910348730438",
    //   label: "C++",
    // },
    {
      id: "1125248687329779832",
      label: "Click me!",
    }
  ];

module.exports = {
    name: 'sentreactionroles',
    description: 'admin only',
    //devOnly: bool,
    //testOnly: bool,
    //options: Object[],
    //deleted : true,

    callback: async (client,interaction) =>{
        if (!interaction.member.permissions.has(8)){return}
        interaction.reply("The message has been sent.");
        const channel = await client.channels.cache.get(interaction.channelId);
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
          .setTitle("Click the button to get pinged when a new question is posted!")
          .setDescription("Our grading server supports Javascript, Java, Python 3, and C++.")
          .setColor(13631488);

        await channel.send({
          content: "",
          embeds: [message],
          components: [row],
        });
    }
}
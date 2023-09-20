const { ApplicationCommandOptionType, EmbedBuilder } = require("discord.js");

module.exports = {
  name: "embed",
  description: "Send an embed message",
  options: [
    {
      name: "title",
      description: "The title of the embed",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "description",
      description: "The description of the embed",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "color",
      description: "The color of the embed in hex",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
    {
      name: "thumbnail",
      description: "The URL of the thumbnail image",
      type: ApplicationCommandOptionType.String,
      required: false,
    },
  ],
  callback: async (client, interaction) => {
    await interaction.deferReply({ephemeral: true});
    try {
      const title = interaction.options.getString("title");
      const description = interaction.options.getString("description");
      const colorHex = interaction.options.getString("color") || "D10000"; // Default color if not provided
      const colorDec = parseInt(colorHex, 16); // Convert hex color to decimal

      const thumbnail = interaction.options.getString("thumbnail");

      const user = interaction.user;
      const author = {
        name: user.username,
        iconURL: user.displayAvatarURL(),
      };

      const exampleEmbed = new EmbedBuilder()
        .setColor(colorDec)
        .setTitle(title)
        .setDescription(description)
        .setAuthor(author)
        .setTimestamp()
        .setFooter({text:"ACSL Club", iconURL: client.user.displayAvatarURL()});
      if(thumbnail) exampleEmbed.setThumbnail(thumbnail)

      const channel = interaction.channel;
      await channel.send({ embeds: [exampleEmbed] });

      await interaction.editReply({ content:"request complete", ephemeral: true });
    } catch (error) {
      await interaction.editReply({ content: error + "", ephemeral: true });
      throw error;
    }
  },
};

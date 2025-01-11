import {
  Client,
  Message,
  TextChannel,
  ChannelType,
  EmbedBuilder,
} from "discord.js";
import config from "../../../config.json";

const activeModmailSessions = new Set<string>();

const modmailHandler = async (
  client: Client,
  message: Message
): Promise<void> => {
  try {
    if (message.author.bot) return;
    if (message.channel.type !== ChannelType.DM) return;
    if (!message.content.trim()) return;

    if (activeModmailSessions.has(message.author.id)) {
      return;
    }

    activeModmailSessions.add(message.author.id);

    const confirmEmbed = new EmbedBuilder()
      .setTitle("Modmail Confirmation")
      .setDescription(
        `**You wrote:**\n${message.content}\n\n` +
          "Would you like to send this to the moderators?\n" +
          "Type `yes` or `no` within **30 seconds**."
      )
      .setColor("Blue");

    await message.channel.send({ embeds: [confirmEmbed] });

    const filter = (m: Message) =>
      m.author.id === message.author.id &&
      ["yes", "no"].includes(m.content.toLowerCase());

    const collected = await message.channel.awaitMessages({
      filter,
      max: 1,
      time: 30_000,
    });

    if (collected.size === 0) {
      await message.channel.send(
        "No response within 30 seconds. Your message was **not** sent."
      );
      activeModmailSessions.delete(message.author.id);
      return;
    }

    const userReply = collected.first()?.content.toLowerCase();
    if (userReply === "yes") {
      const mailChannel = client.channels.cache.get(config.mailChannel);
      if (!mailChannel || mailChannel.type !== ChannelType.GuildText) {
        await message.channel.send(
          "Sorry, I could not send your message to the moderators. Contact an admin."
        );
        activeModmailSessions.delete(message.author.id);
        return;
      }

      const mailEmbed = new EmbedBuilder()
        .setTitle("New Modmail")
        .setDescription(
          `**From:** \`${message.author.tag}\`\n${message.content}`
        )
        .setColor("Green")
        .setFooter({ text: `User ID: ${message.author.id}` })
        .setTimestamp();

      await (mailChannel as TextChannel).send({ embeds: [mailEmbed] });

      await message.channel.send(
        "Your message has been sent to the moderators."
      );
    } else {
      await message.channel.send("Your message was **not** sent.");
    }
  } catch (error) {
    console.error("Error in modmail handler:", error);
  } finally {
    activeModmailSessions.delete(message.author.id);
  }
};

export default modmailHandler;

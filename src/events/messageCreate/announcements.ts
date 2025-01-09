import { Client, Message, TextChannel } from "discord.js";
import config from "../../../config.json";

const handleAnnouncementMessages = async (
  client: Client,
  message: Message
): Promise<void> => {
  try {
    if (message.author.bot || !message.content) return;

    if (message.channel.id === config.announcementChannel) {
      const { content } = message;

      await message.delete().catch((err) => {
        console.error("Failed to delete announcement message:", err);
      });

      const targetChannel = client.channels.cache.get(
        config.announcementChannel
      ) as TextChannel;
      if (targetChannel) {
        await targetChannel.send(`${content}`);
      } else {
        console.warn("Could not find the keepAdymousChannel in the cache.");
      }
    }
  } catch (error) {
    console.error("Error in handleAnnouncementMessages:", error);
  }
};

export default handleAnnouncementMessages;

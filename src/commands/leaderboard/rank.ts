
import { Client, CommandInteraction } from 'discord.js';
import Level from '../../models/Level';
const getUserLevel = async (userId, guildId) => {
  try {
    const level = await Level.findOne({ userId: userId, guildId: guildId });
    return level;
  } catch (error) {
    console.log(`Error retrieving user level: ${error}`);
  }
};

export default {
  name: 'rank',
  description: 'Show your current level',
  async callback(client: Client, interaction: CommandInteraction) { 
    try {
      const userId = interaction.user.id;
      const guildId = interaction.guild.id;
      const userLevel = await getUserLevel(userId, guildId);

      if (!userLevel) {
        await interaction.reply('You have no level yet.');
        return;
      }

      await interaction.reply(`Your current level is ${userLevel.level}.`);
    } catch (error) {
      console.log(`Error executing rank command: ${error}`);
    }
  },
};

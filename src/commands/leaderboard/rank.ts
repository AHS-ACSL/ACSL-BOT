import { Client, CommandInteraction } from 'discord.js';
import Level from '../../models/Level';
import SpellError from '../../models/SpellError';

const getUserLevel = async (userId: string, guildId: string) => {
  try {
    const level = await Level.findOne({ userId: userId, guildId: guildId });
    return level;
  } catch (error) {
    console.log(`Error retrieving user level: ${error}`);
  }
};

const getUserSpellErrors = async (userId: string, guildId: string) => {
  try {
    const spellError = await SpellError.findOne({ userId: userId, guildId: guildId });
    return spellError ? spellError.spellerrors : 0;
  } catch (error) {
    console.log(`Error retrieving user spell errors: ${error}`);
  }
};

export default {
  name: 'rank',
  description: 'Show your current level and spell errors',
  async callback(client: Client, interaction: CommandInteraction) { 
    try {
      const userId = interaction.user.id;
      const guildId = interaction.guild.id;
      const userLevel = await getUserLevel(userId, guildId);
      const userSpellErrors = await getUserSpellErrors(userId, guildId);

      if (!userLevel) {
        await interaction.reply(`You have no level yet. But you have made **${userSpellErrors}** spelling errors.`);
        return;
      }

      await interaction.reply(`Your current level is **${userLevel.level}**. You have made **${userSpellErrors}** spelling errors.`);
    } catch (error) {
      console.log(`Error executing rank command: ${error}`);
    }
  },
};

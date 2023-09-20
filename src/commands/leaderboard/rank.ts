const sequelize = require('../../index.js');
const Level = sequelize.Level;

const getUserLevel = async (userId, guildId) => {
  try {
    const level = await Level.findOne({
      where: { userId: userId, guildId: guildId },
    });

    return level;
  } catch (error) {
    console.log(`Error retrieving user level: ${error}`);
  }
};

module.exports = {
  name: 'rank',
  description: 'Show your current level',
  callback: async (client, interaction) => {
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

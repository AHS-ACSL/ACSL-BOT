const sequelize = require('../../index.js');
const Level = sequelize.Level;

const generateLeaderboard = async (guildId) => {
  try {
    const leaderboard = await Level.findAll({
      where: { guildId: guildId },
      order: [
        ['level', 'DESC'],
        ['xp', 'DESC'],
      ],
    });

    return leaderboard;
  } catch (error) {
    console.log(`Error generating leaderboard: ${error}`);
  }
};

module.exports = {
  name: 'leaderboard',
  description: 'Show the current level leaderboard',
  callback: async (client, interaction) => {
    try {
      const guildId = interaction.guild.id;
      const leaderboard = await generateLeaderboard(guildId);

      let leaderboardMessage = 'ACSL Level Leaderboard(Not offical):\n';
      leaderboard.forEach((level, index) => {
        const member = interaction.guild.members.cache.get(level.userId);
        leaderboardMessage += `${index + 1}. ${member.displayName} - Level ${level.level}\n`;
      });

      await interaction.reply(leaderboardMessage);
    } catch (error) {
      console.log(`Error executing leaderboard command: ${error}`);
    }
  },
};

import sequelize from '../../index.js';
//TODO: remove any
const Level:any = sequelize.Level;

const generateLeaderboard = async (guildId) => {
  try {
    const leaderboard = await Level.findAll({
      where: { guildId: guildId },
      order: [
        ['level', 'DESC'],
        ['xp', 'DESC'],
      ],
      limit: 10 // limit the leaderboard to top 10
    });

    return leaderboard;
  } catch (error) {
    console.log(`Error generating leaderboard: ${error}`);
  }
};

export default {
  name: 'leaderboard',
  description: 'Show the current level leaderboard',
  callback: async (client, interaction) => {
    try {
      const guildId = interaction.guild.id;
      const leaderboard = await generateLeaderboard(guildId);

      let leaderboardMessage = 'ACSL Level Leaderboard(Not official):\n';

      for (let i = 0; i < leaderboard.length; i++) {
        const member = await interaction.guild.members.fetch(leaderboard[i].userId);
        if (member) {
          leaderboardMessage += `${i + 1}. ${member.displayName} - Level ${leaderboard[i].level}\n`;
        } else {
          leaderboardMessage += `${i + 1}. Unknown User (ID: ${leaderboard[i].userId}) - Level ${leaderboard[i].level}\n`;
        }
      }

      await interaction.reply(leaderboardMessage);
    } catch (error) {
      console.log(`Error executing leaderboard command: ${error}`);
    }
  },
};

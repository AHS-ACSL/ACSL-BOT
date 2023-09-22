import { Client, CommandInteraction } from 'discord.js'; 
import Level from '../../models/Level';
import SpellError from '../../models/SpellError'; // Assuming you have a model called SpellError

const generateLeaderboard = async (guildId: string) => {
  try {
    const leaderboard = await Level.find({ guildId: guildId })
      .sort({ level: -1, xp: -1 }) 
      .limit(10)
      .exec();

    return leaderboard;
  } catch (error) {
    console.log(`Error generating level leaderboard: ${error}`);
  }
};

const generateSpellErrorLeaderboard = async (guildId: string) => {
  try {
    const errorLeaderboard = await SpellError.find({ guildId: guildId })
      .sort({ spellerrors: -1 }) // Sorting by most errors
      .limit(10)
      .exec();

    return errorLeaderboard;
  } catch (error) {
    console.log(`Error generating spell error leaderboard: ${error}`);
  }
};

export default {
  name: 'leaderboard',
  description: 'Show the current level and spell error leaderboards',
  async callback(client: Client, interaction: CommandInteraction) {
    try {
      const guildId = interaction.guild.id;
      const leaderboard = await generateLeaderboard(guildId);
      const errorLeaderboard = await generateSpellErrorLeaderboard(guildId);

      let leaderboardMessage = '**ACSL Level Leaderboard:**\n';

      for (let i = 0; i < leaderboard.length; i++) {
        const member = await interaction.guild.members.fetch(leaderboard[i].userId);
        if (member) {
          leaderboardMessage += `${i + 1}. ${member.displayName} - Level ${leaderboard[i].level}\n`;
        } else {
          leaderboardMessage += `${i + 1}. Unknown User (ID: ${leaderboard[i].userId}) - Level ${leaderboard[i].level}\n`;
        }
      }

      leaderboardMessage += '\n**ACSL Spell Error Leaderboard:**\n';

      for (let i = 0; i < errorLeaderboard.length; i++) {
        const member = await interaction.guild.members.fetch(errorLeaderboard[i].userId);
        if (member) {
          leaderboardMessage += `${i + 1}. ${member.displayName} - ${errorLeaderboard[i].spellerrors} errors\n`;
        } else {
          leaderboardMessage += `${i + 1}. Unknown User (ID: ${errorLeaderboard[i].userId}) - ${errorLeaderboard[i].spellerrors} errors\n`;
        }
      }

      await interaction.reply(leaderboardMessage);
    } catch (error) {
      console.log(`Error executing leaderboard command: ${error}`);
    }
  },
};

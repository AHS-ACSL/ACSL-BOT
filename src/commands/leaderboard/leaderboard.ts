import { Client, CommandInteraction } from "discord.js";
import Level from "../../models/Level";
import SpellError from "../../models/SpellError";

const generateLeaderboard = async (guildId: string) => {
  try {
    return await Level.find({ guildId })
      .sort({ level: -1, xp: -1 })
      .limit(10)
      .exec();
  } catch (error) {
    console.error(`Error generating level leaderboard: ${error}`);
    return [];
  }
};

const generateSpellErrorLeaderboard = async (guildId: string) => {
  try {
    return await SpellError.find({ guildId })
      .sort({ spellerrors: -1 })
      .limit(10)
      .exec();
  } catch (error) {
    console.error(`Error generating spell error leaderboard: ${error}`);
    return [];
  }
};

export default {
  name: "leaderboard",
  description: "Show the current level and spell error leaderboards",
  async callback(client: Client, interaction: CommandInteraction) {
    try {
      await interaction.deferReply();

      const { guild } = interaction;
      if (!guild) {
        await interaction.editReply(
          "This command can only be used inside a guild."
        );
        return;
      }

      const guildId = guild.id;
      const [leaderboard, errorLeaderboard] = await Promise.all([
        generateLeaderboard(guildId),
        generateSpellErrorLeaderboard(guildId),
      ]);

      let leaderboardMessage = "**ACSL Level Leaderboard:**\n";

      const levelLines = await Promise.all(
        leaderboard.map(async (record, i) => {
          const { userId, level } = record;
          let memberDisplay = `Unknown User (ID: ${userId})`;

          try {
            const member = await guild.members.fetch(userId);
            if (member) {
              memberDisplay = member.displayName;
            }
          } catch (err: any) {
            //Probably DiscordAPIError 10007: unknown member
          }

          return `${i + 1}. ${memberDisplay} - Level ${level}`;
        })
      );

      leaderboardMessage += levelLines.join("\n");

      leaderboardMessage += "\n\n**ACSL Spell Error Leaderboard:**\n";

      const errorLines = await Promise.all(
        errorLeaderboard.map(async (record, i) => {
          const { userId, spellerrors } = record;
          let memberDisplay = `Unknown User (ID: ${userId})`;

          try {
            const member = await guild.members.fetch(userId);
            if (member) {
              memberDisplay = member.displayName;
            }
          } catch (err: any) {
            //sigma error handling
          }

          return `${i + 1}. ${memberDisplay} - ${spellerrors} errors`;
        })
      );

      leaderboardMessage += errorLines.join("\n");

      await interaction.editReply(leaderboardMessage);
    } catch (error) {
      console.error(`Error executing leaderboard command: ${error}`);
      try {
        await interaction.editReply(
          "An error occurred while generating the leaderboard."
        );
      } catch {
        //sigma error handling
      }
    }
  },
};

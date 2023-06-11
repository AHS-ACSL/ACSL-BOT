const { Client, Message } = require('discord.js');
const calculateLevelXp = require('../../utils/calculateLevelXp');
const sequelize = require('../../index.js');
const Level = sequelize.Level;
const cooldowns = new Set();

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param {Client} client
 * @param {Message} message
 */
module.exports = async (client, message) => {
  if (!message.guild || message.author.bot || cooldowns.has(message.author.id)) return;

  const xpToGive = getRandomXp(5, 15);

  try {
    let level = await Level.findOne({ where: { userId: message.author.id, guildId: message.guild.id } });

    if (level) {
      level.xp += xpToGive;

      if (level.xp > calculateLevelXp(level.level)) {
        level.xp = 0;
        level.level += 1;

        message.channel.send(`${message.member} you have leveled up to **level ${level.level}**.`);
      }

      await level.save().catch((e) => {
        console.log(`Error saving updated level ${e}`);
        return;
      });
      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60000);
    }
    else {
      level = await Level.create({
        userId: message.author.id,
        guildId: message.guild.id,
        xp: xpToGive,
      });

      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60000);
    }
  } catch (error) {
    console.log(`Error giving xp: ${error}`);
  }
};

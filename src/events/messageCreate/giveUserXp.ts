import { Client, Message, GuildChannel } from 'discord.js';
import calculateLevelXp from '../../utils/calculateLevelXp';
import sequelize from '../../index';
import config from '../../../config.json';



//TODO: remove any
const LevelData: any  = sequelize.Level;
const cooldowns = new Set<string>();

function getRandomXp(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 *
 * @param client - The Discord client
 * @param message - The message that was sent
 */
export default async (client: Client, message: Message): Promise<void> => {
  if (!message.guild || message.author.bot || cooldowns.has(message.author.id)) return;

  const xpToGive = getRandomXp(5, 15);

  try {
    let level = await LevelData.findOne({ where: { userId: message.author.id, guildId: message.guild.id } });
    if (level) {
      level.xp += xpToGive;

      if (level.xp > calculateLevelXp(level.level)) {
        level.xp = 0;
        level.level += 1;

        let redirectChannel = client.channels.cache.get(config.levelingChannel) as GuildChannel;

        (redirectChannel as any).send(`${message.member!.displayName} you have leveled up to **level ${level.level}**.`);
      }

      await level.save().catch((e: Error) => {
        console.log(`Error saving updated level ${e.message}`);
        return;
      });

      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60000);
    } else {
      level = await level.create({
        userId: message.author.id,
        guildId: message.guild.id,
        xp: xpToGive,
      });

      cooldowns.add(message.author.id);
      setTimeout(() => {
        cooldowns.delete(message.author.id);
      }, 60000);
    }
  } catch (error: any) {
    console.log(`Error giving xp: ${error.message}`);
  }
};

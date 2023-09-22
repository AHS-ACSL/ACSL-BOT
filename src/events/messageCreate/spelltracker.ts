import { Client, Message } from "discord.js";
import spellchecker from 'simple-spellchecker';
import SpellError from "../../models/SpellError";
import nlp from 'compromise';

const dictionary = spellchecker.getDictionarySync("en-US");

const spelltracker = async (client: Client, message: Message): Promise<void> => {
  if (!message.guild || message.author.bot) return;

  const namedEntities = nlp(message.content).people().out('array');
  const places = nlp(message.content).places().out('array');
  const pronouns = nlp(message.content).pronouns().out('array');

  const cleanedText = message.content.replace(/[.,'"!?(){}]/g, ' ').toLowerCase().split(/\s+/);

  let errorCount = 0;

  cleanedText.forEach(word => {
    if (!namedEntities.includes(word) && !places.includes(word) && !pronouns.includes(word) && word && !dictionary.spellCheck(word)) {
      errorCount++;
    }
  });

  try {
    let spellError = await SpellError.findOne({
      userId: message.author.id,
      guildId: message.guild.id
    });

    if (spellError) {
      errorCount += (spellError.spellerrors as number);
      spellError.spellerrors = errorCount; 
      await spellError.save();
    } else {
      const newSpellError = new SpellError({
        userId: message.author.id,
        guildId: message.guild.id,
        spellerrors: errorCount 
      });

      await newSpellError.save();
    }

    console.debug(`Spell errors tracked for ${message.author.username}: ${errorCount}`);
  } catch (error: any) {
    console.error(`Error tracking spell errors: ${error.message}`);
  }
};

export default spelltracker;

import dotenv from 'dotenv';
import { Client, IntentsBitField, Partials } from 'discord.js';
import eventHandler from './handlers/eventHandler';
import LevelModel from './models/Level';
import mongoose, { Mongoose } from 'mongoose';


dotenv.config();

const client: Client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
    IntentsBitField.Flags.DirectMessageTyping,
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
  ],
});





(async () => {
  try {
    await mongoose.connect(process.env.MONGODB)
    console.log('Connected to DB.');
    console.log(process.memoryUsage())

    eventHandler(client);
    await client.login(process.env.TOKEN!);
    console.log(process.memoryUsage())
  } catch (error) {
    console.error(`Error: ${error}`);
  }
})();


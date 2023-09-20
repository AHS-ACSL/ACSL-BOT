import dotenv from 'dotenv';
import { Client, IntentsBitField, Partials } from 'discord.js';
import { Sequelize, Model } from 'sequelize';
import eventHandler from './handlers/eventHandler';
import LevelModel from './models/Level';

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

interface ExtendedSequelize extends Sequelize {
    Level: typeof Model
}

const sequelize = new Sequelize(process.env.DB_NAME!, process.env.DB_USER!, process.env.DB_PASSWORD!, {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT!),
  dialect: 'mysql',
  logging: false,
}) as ExtendedSequelize;

sequelize.Level = LevelModel(sequelize);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB.');

    await sequelize.sync();

    eventHandler(client);
    await client.login(process.env.TOKEN!);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
})();

export default sequelize;

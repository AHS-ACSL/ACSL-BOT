require('dotenv').config();
const { Client, IntentsBitField, Partials } = require('discord.js');
const { Sequelize } = require('sequelize');
const eventHandler = require('./handlers/eventHandler');
const Level = require('./models/Level');

const client = new Client({
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
    Partials.Message
  ]
});

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: false,
});

sequelize.Level = Level(sequelize);

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB.');

    await sequelize.sync();

    eventHandler(client);
    await client.login(process.env.TOKEN);
  } catch (error) {
    console.log(`Error: ${error}`);
  }
})();

module.exports = sequelize;

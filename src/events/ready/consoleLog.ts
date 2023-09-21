import { Client } from 'discord.js';

const onLogin = (client: Client): void => {
    console.log(`Logged in as ${client.user?.tag}`);
};

export default onLogin;

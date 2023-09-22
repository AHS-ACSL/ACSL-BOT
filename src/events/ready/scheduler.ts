
import cron from 'node-cron';
import { Client } from 'discord.js';



function fetchEmails(client: Client): void {
}

export default (client: Client): void => {
  cron.schedule('*/3 * * * *', () => {
    fetchEmails(client);
  });
};

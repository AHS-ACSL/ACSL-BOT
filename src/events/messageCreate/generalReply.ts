import nlp from 'compromise';
import { Client, Message } from 'discord.js';

function getReply(message: string): string | null {
    const doc = nlp(message.toLowerCase());

    if (doc.has('hello')) {
        return "World!";
    }

    if (doc.has('help') || doc.has('assist') || doc.has('aid')) {
        return "I'm sorry, I can't help you.";
    }

    if (doc.has('java (good|great|awesome|fantastic|amazing)')) {
        return "I disagree.";
    }

    if (doc.has('java (bad|terrible|horrible|awful|worst)')) {
        return "I agree.";
    }

    if (doc.has('#QuestionWord') && (doc.has('#Verb') || doc.has("#Auxiliary") || doc.has("#Copula")) && (doc.has('meet') || doc.has("club"))) {
        let clubName = doc.match('[(#Noun|#Adjective)]+ club').out('text'); 
        if (clubName && !doc.has('acsl')) { 
            return `I do not know about the ${clubName}.`;

        } else {
            return "The ACSL Club meets every Wednesday at 12:50 pm in Room S101";
        }
    }

    return null; 
}

export default async function replyMessage(Client: Client, message: Message){
    if (!message.guild || message.author.bot) return;

    const reply = getReply(message.content);

    if (reply) {
        message.reply(reply);
    }
}

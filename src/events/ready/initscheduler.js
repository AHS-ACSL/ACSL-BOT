const fs = require('fs');
const path = require("path");
const cron = require('node-cron');
const getAllFiles = require("../../utils/getAllFiles");
const config = require('../../../config.json');

const generateQuestion = (client) => {
    const questionFiles = getAllFiles(path.join(__dirname, '..', '..', 'daily-programming', 'questions', 'simple'));

    const randomIndex = Math.floor(Math.random() * questionFiles.length);
    const randomQuestionFile = questionFiles[randomIndex];
    const questionData = require(randomQuestionFile);
    questionData.successfulSubmissions = [];
    const channel = client.channels.cache.get(config.questionsChannel);
    if (channel) {
        channel.send(
            `<@&${config.pingRoles}> \n` +
            `**Question:** ${questionData.name}\n` +
            `**Points:** ${questionData.points}\n` +
            `**Supported Languages:** ${questionData.lang.map(item => `${item.lang} (time: ${item.time})`).join(', ')}\n` +
            `**Difficulty:** ${questionData.difficulty}\n` +
            `**Instructions:** ${questionData.instruction}\n`
        );
    } else {
        console.error(`Could not find channel with ID: ${config.questionsChannel}`);
    }

    // Store the current question data for submission checking
    fs.writeFileSync(path.join(__dirname, '..',"..", '..', 'currentQuestion.json'), JSON.stringify(questionData));
}

module.exports = (client) => {
    //generateQuestion(client);
    cron.schedule('0 4 * * *', () => { //run at 4am everyday
        generateQuestion(client);
    });
};

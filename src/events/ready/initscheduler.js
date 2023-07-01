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
    const channel = client.channels.cache.get(config.questionsChannel);
    if (channel) {
        channel.send(
            `**Question: \n** ${questionData.questions}\n` +
            `**Points:** ${questionData.points}\n` +
            `**Supported Languages:** ${questionData.lang.join(', ')}\n` +
            '```javascript\n' +
            `${questionData.code}\n` +
            '```'
        );
    } else {
        console.error(`Could not find channel with ID: ${config.questionsChannel}`);
    }

    // Store the current question data for submission checking
    fs.writeFileSync(path.join(__dirname, '..', '..', 'currentQuestion.json'), JSON.stringify(questionData));
}

module.exports = (client) => {
    cron.schedule('*/100 * * * *', () => generateQuestion(client));
};

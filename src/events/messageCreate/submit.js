const { VM } = require('vm2');
const path = require('path');
const util = require('util');
const fs = require('fs');
const sequelize = require('../../index.js');
const Level = sequelize.Level;
const config = require('../../../config.json');

module.exports = async (client, message) => {
    if (message.author.bot) return;
    if (message.content.toLowerCase().startsWith('!submit') && message.channel.type === 1) { 
        //console.log('submitting');
        const codeBlock = message.content.split('```js');
        if (codeBlock.length < 2) {
            return message.reply(
                'Invalid format. Code must be surrounded by triple backticks and js.' +
                '\nExample:\n !submit \n \\```js\nconsole.log("Hello world!");\n\\```'
            );
        }
        
        let questionData;
        try {
            questionData = JSON.parse(fs.readFileSync(path.join(__dirname, '..',"..", '..', 'currentQuestion.json'), 'utf-8'));
        } catch (error) {
            console.error(error);
            return message.reply("No active question found to submit against!");
        }

        // Check if the user has already successfully submitted for this question
        if (questionData.successfulSubmissions.includes(message.author.id)) {
            return message.reply("You have already successfully submitted a solution to this question.");
        }
        
        const code = codeBlock[1].split('```')[0];
        const wrappedCode = `
            function ${questionData.functionName}(${questionData.params.join(', ')}) {
                ${code}
            }
            ${questionData.testCases.map((tc, index) => `console.log(${questionData.functionName}(${tc.input}))`).join('\n')}
        `;
        
        let output = '';
        const log = (...args) => {
            output += util.format(...args) + '\n';
            return output;
        };

        const vm = new VM({
            timeout: questionData.maxRunTime,
            sandbox: { console: { log } }
        });

        try {
            vm.run(wrappedCode);

            const results = output.split('\n').filter(x => x);
            for (let i = 0; i < questionData.testCases.length; i++) {
                if (results[i] !== String(questionData.testCases[i].expected)) {
                    return message.reply(`Test case failed: input(${questionData.testCases[i].input}) returned ${results[i]}, expected ${questionData.testCases[i].expected}`);
                }
            }
            
            // Give user 5 levels
            let level = await Level.findOne({ where: { userId: message.author.id, guildId: config.testServer } });
            //console.log(level);
            if (level) {
                level.level += 5;
                // Update database
                await level.save().catch((e) => {
                    console.log(`Error saving updated level ${e}`);
                    return;
                });
            } else {
                // If the user doesn't exist, create a new one with level 5
                level = await Level.create({
                    userId: message.author.id,
                    guildId: message.guild.id,
                    xp: 0,
                    level: 5
                });
            }
            message.reply('All test cases passed! Good job! You are now level ' + level.level + '!');

            questionData.successfulSubmissions.push(message.author.id);
            fs.writeFileSync(path.join(__dirname, '..',"..", '..', 'currentQuestion.json'), JSON.stringify(questionData));


        } catch (error) {
            message.reply('Error while running code: ' + error.message);
        }
    }
};

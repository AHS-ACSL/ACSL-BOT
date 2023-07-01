const { VM } = require('vm2');
const path = require('path');
const util = require('util');

module.exports = async (client, message) => {
    if (message.author.bot) return;
    // console.log(message.content);
    // console.log(message.channel.type);
    if (message.content.toLowerCase().startsWith('!submit') && message.channel.type === 1) { //1 is DM
        console.log('submitting');
        const codeBlock = message.content.split('```js');
        if (codeBlock.length < 2) {
            return message.reply(
                'Invalid format. Code must be surrounded by triple backticks and js.' +
                '\nExample:\n !submit \n \\```js\nconsole.log("Hello world!");\n\\```'
            );
        }
        
        const code = codeBlock[1].split('```')[0];
        let questionData;
        try {
            questionData = require(path.join(__dirname, '..', '..', 'currentQuestion.json'));
        } catch (error) {
            console.error(error);
            console.log(path.join(__dirname, '..', '..', 'currentQuestion.json'))
            return message.reply("No active question found to submit against!");
        }
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

            // Split output by newline and compare with expected results
            const results = output.split('\n').filter(x => x);  // remove empty strings
            for (let i = 0; i < questionData.testCases.length; i++) {
                if (results[i] !== String(questionData.testCases[i].expected)) {
                    return message.reply(`Test case failed: input(${questionData.testCases[i].input}) returned ${results[i]}, expected ${questionData.testCases[i].expected}`);
                }
            }
            message.reply('All test cases passed! Good job!');
            // TODO: add points to user
        } catch (error) {
            message.reply('Error while running code: ' + error.message);
        }
    }
};

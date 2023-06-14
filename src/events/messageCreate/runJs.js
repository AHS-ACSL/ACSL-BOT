const { VM } = require('vm2');
const util = require('util');

module.exports = async (client, message) => {
    if (!message.guild || message.author.bot) return;
    if (message.content.startsWith('!runJS')) {
        const codeBlock = message.content.split('```js');
        if (codeBlock.length < 2) {
            return message.reply(
                'Invalid format. Code must be surrounded by triple backticks and js.' +
                '\n!runJS\n``(3 backticks)js\nconsole.log("Your code here");\n(3 backticks)'+
                '\nExample:\n!runJS\n```js\nconsole.log("Your code here");\n```'
            );
        }
        const code = codeBlock[1].split('```')[0];  // assuming code is surrounded by ```js and ```

        message.reply('Starting vm, please wait...');

        
        // Custom console.log to capture output
        let output = '';
        const log = (...args) => {
            output += util.format(...args) + '\n';
        };

        // Run code in the VM
        try {
            new VM({
                timeout: 3000,  // Set timeout to 3 seconds
                sandbox: { console: { log } }
            }).run(code);
        } catch (error) {
            output = 'Error while running code: ' + error.message;
        }

        // Send output back to Discord wrapped in a code block
        message.reply(`\`\`\`\n${output || 'No output'}\n\`\`\``);
    }
};

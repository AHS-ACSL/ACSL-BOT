const axios = require('axios');
const options = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions',
    headers: {
        'X-RapidAPI-Key': process.env.JudgeAPI,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
    },
    data: {
        source_code: '', // to be filled in
        language_id: 54,
        stdin: '' // any input for the program
    }
};

module.exports = async (client, message) => {
    if (!message.guild || message.author.bot) return;
    if (message.content.toLowerCase().startsWith('!runcpp')) {
        message.reply('Submitting code...');
        const codeBlock = message.content.split('```cpp');
        if (codeBlock.length < 2) {
            return message.reply('Invalid format. Code must be surrounded by triple backticks and cpp.' +
                '\nExample:\n!runcpp\n \\```cpp\n#include<iostream>\n\nint main() {\nstd::cout << "Your code here";\nreturn 0;\n}\n\\```'
            );
        }
        const code = codeBlock[1].split('```')[0];  // assuming code is surrounded by ```cpp and ```

        options.data.source_code = code;

        try {
            const response = await axios.request(options);
            // The submission_token can be used to get the submission result
            const submission_token = response.data.token;

            // Wait for 5 seconds, then fetch the result
            setTimeout(async () => {
                try {
                    const result = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${submission_token}`, {
                        headers: {
                            'X-RapidAPI-Key': process.env.JudgeAPI,
                            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                        }
                    });
                    const { stdout, stderr, message: resultMessage, time, compile_output } = result.data;
                    if (stdout) {
                        message.reply(`\nOutput:\n\`\`\`${stdout}\`\`\``);
                    } else if (stderr || resultMessage || compile_output) {
                        message.reply(`\nError:\n\`\`\`${stderr || resultMessage || compile_output}\`\`\``);
                    }
                    if (result.data.time_limit_exceeded) {
                        message.reply(`Execution exceeded the time limit.`);
                    }
                } catch (error) {
                    message.reply(`Error fetching result: ${error.message}`);
                }
            }, 5000);
        } catch (error) {
            message.reply('Error while submitting code: ' + error.message);
        }
    }
};

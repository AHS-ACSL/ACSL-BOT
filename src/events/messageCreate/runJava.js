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
        language_id: 62, // for Java
        stdin: '' // any input for the program
    }
};

module.exports = async (client, message) => {
    if (!message.guild || message.author.bot) return;
    if (message.content.startsWith('!runJava')) {
        message.reply('Submitting code...');
        const codeBlock = message.content.split('```Java');
        if (codeBlock.length < 2) {
            return message.reply('Invalid format. Code must be surrounded by triple backticks and Java.' +
                '\nExample:\n!runJava\n```Java\npublic class Main { public static void main(String[] args) { System.out.println("Your code here"); }}\n```'
            );
        }
        const code = codeBlock[1].split('```')[0];  // assuming code is surrounded by ```Java and ```

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
                    const { stdout, stderr, message: resultMessage, time } = result.data;
                    if (stdout) {
                        message.reply(`\nOutput:\n\`\`\`${stdout}\`\`\``);
                    } else if (stderr || resultMessage) {
                        message.reply(`\nError:\n\`\`\`${stderr || resultMessage}\`\`\``);
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

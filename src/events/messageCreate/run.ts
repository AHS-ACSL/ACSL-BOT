import { Client, Message } from "discord.js";
import axios from "axios";
import util from "util";
import { VM } from "vm2";

const languageIdMap: Record<string, number> = {
    cpp: 54,
    java: 62,
    js: 63,
    py: 71
};

interface RequestOptions {
    method: 'POST',
    url: string,
    headers: {
        'X-RapidAPI-Key': string,
        'X-RapidAPI-Host': string,
        'Content-Type': string
    },
    data: {
        source_code: string,
        stdin?: string,
        language_id?: number,
        cpu_time_limit?: number
    }
}

const options: RequestOptions = {
    method: 'POST',
    url: 'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true',
    headers: {
        'X-RapidAPI-Key': process.env.JudgeAPI as string,
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
        'Content-Type': 'application/json'
    },
    data: {
        source_code: '',
        stdin: ''
    }
};

async function runCode(client, message, language, code) {
    if (language === 'js') {
        message.reply('Starting VM, please wait...');
        
        // Custom console.log to capture output
        let output = '';
        const log = (...args) => {
            output += util.format(...args) + '\n';
        };
        try {
            new VM({
                eval: false,
                timeout: 5000,  // Set timeout to 5 seconds
                sandbox: { console: { log } }
            }).run(code);
        } catch (error) {
            output = 'Error while running code: ' + error.message;
        }

        message.reply(`\`\`\`\n${output || 'No output'}\n\`\`\``);
    } else {
        options.data.source_code = Buffer.from(code).toString('base64');
        options.data.language_id = languageIdMap[language];
        options.data.cpu_time_limit = 10;
        message.reply('Awaiting reponse from docker, this may take a while...');
        try {
            const response = await axios.request(options);
            const submission_token = response.data.token;

            setTimeout(async () => {
                try {
                    const result = await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${submission_token}?base64_encoded=true`, {
                        headers: {
                            'X-RapidAPI-Key': process.env.JudgeAPI,
                            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
                        }
                    });
                    let { stdout, stderr, message: resultMessage, time, compile_output } = result.data;
                    stdout = stdout ? Buffer.from(stdout, 'base64').toString() : null;
                    stderr = stderr ? Buffer.from(stderr, 'base64').toString() : null;
                    compile_output = compile_output ? Buffer.from(compile_output, 'base64').toString() : null;
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




export default async (client, message) => {
    if (!message.guild || message.author.bot) return;
    if (message.content.toLowerCase().startsWith('!run')) {
        const codeBlock = message.content.split('```');
        if (codeBlock.length < 3) {
            return message.reply('Invalid format. Code must be surrounded by triple backticks and the language specified.' +
                '\nExample:\n!run\n\\```cpp\n#include<iostream>\n\nint main() {\nstd::cout << "Your code here";\nreturn 0;\n}\n\\```'
            );
        }
        const languageAndCode = codeBlock[1].split('\n');
        const language = languageAndCode[0].trim();
        const code = languageAndCode.slice(1).join('\n');

        runCode(client, message, language, code);
    }
};


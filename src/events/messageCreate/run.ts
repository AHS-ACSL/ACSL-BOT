import { Client, Message } from "discord.js";
import axios from "axios";

const languageIdMap: Record<string, number> = {
  cpp: 54,
  java: 91,
  js: 93,
  py: 71,
  kt: 78,
  ts: 94,
  lua: 64,
  c: 50,
  "c#": 51,
  nasm: 45,
  bash: 46,
  lisp: 55,
  haskell: 61,
  go: 88,
  rust: 73,
  sql: 82,
  swift:83
};

interface RequestOptions {
  method: "POST";
  url: string;
  headers: {
    // 'X-RapidAPI-Key': string,
    // 'X-RapidAPI-Host': string,
    "Content-Type": string;
  };
  data: {
    source_code: string;
    stdin?: string;
    language_id?: number;
    cpu_time_limit?: number;
  };
}

const options: RequestOptions = {
  method: "POST",
  url: "http://localhost:2358/submissions?base64_encoded=true",
  headers: {
    // 'X-RapidAPI-Key': process.env.JudgeAPI as string,
    // 'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
    "Content-Type": "application/json",
  },
  data: {
    source_code: "",
    stdin: "",
  },
};

async function runCode(client, message, language, code) {
  options.data.source_code = Buffer.from(code).toString("base64");
  options.data.language_id = languageIdMap[language.toLowerCase()];
  //check if language is valid
  if (!options.data.language_id) {
    message.react("❌");
    return message.reply({
      content: `Invalid language. Supported languages: js, cpp, py, java, kt, ts, lua, c, c#, nasm, bash, lisp, haskell, go, rust, sql, swift`,
      ephemeral: true,
    });
  }
  options.data.cpu_time_limit = 10;

  message.react("✅");

  try {
    const response = await axios.request(options);
    const submission_token = response.data.token;
    console.log("response", response.data);

    setTimeout(async () => {
      try {
        const result = await axios.get(
          `http://localhost:2358/submissions/${submission_token}?base64_encoded=true`,
          {
            headers: {
              // 'X-RapidAPI-Key': process.env.JudgeAPI,
              // 'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
            },
          }
        );
        console.log("Result Response:", result.data);
        let {
          stdout,
          stderr,
          message: resultMessage,
          time,
          compile_output,
        } = result.data;
        stdout = stdout ? Buffer.from(stdout, "base64").toString() : null;
        stderr = stderr ? Buffer.from(stderr, "base64").toString() : null;
        compile_output = compile_output
          ? Buffer.from(compile_output, "base64").toString()
          : null;
        if (stdout) {
          message.reply(`\nOutput:\n\`\`\`${stdout}\`\`\``);
        } else if (stderr || resultMessage || compile_output) {
          //change checkmark to x
          message.reactions.removeAll();
          message.react("❌");
          message.reply({
            content: `\nError:\n\`\`\`${
              stderr || resultMessage || compile_output
            }\`\`\``,
            ephemeral: true,
          });
        }
        if (result.data.time_limit_exceeded) {
          message.reactions.removeAll();
          //react clock
          message.react("🕒");
          message.reply(`Execution exceeded the time limit.`);
        }
      } catch (error) {
        message.reactions.removeAll();
        message.react("❌");
        message.reply({
          content: `Error fetching result: ${error.message}`,
          ephemeral: true,
        });
      }
    }, 5000);
  } catch (error) {
    message.reply({
      content: `Error while running code: ${error.message}`,
      ephemeral: true,
    });
  }
}

export default async (client, message) => {
  if (!message.guild || message.author.bot) return;
  if (message.content.toLowerCase().startsWith("!run")) {
    const codeBlock = message.content.split("```");
    if (codeBlock.length < 3) {
      message.react("❌");
      return message.reply({
        content:
          'Invalid format. Code must be surrounded by triple backticks and the language specified(js, cpp, py, java, kt, ts, lua, c, c#, nasm, bash, lisp, haskell, go, rust, sql, swift). \nExample:\n!run\n\\```cpp\n#include<iostream>\n\nint main() {\n\tstd::cout << "Your code here";\n\treturn 0;\n}\n\\```',
          ephemeral: true,
      });
    }
    const languageAndCode = codeBlock[1].split("\n");
    const language = languageAndCode[0].trim();
    const code = languageAndCode.slice(1).join("\n");

    runCode(client, message, language, code);
  }
};

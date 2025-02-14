import axios from "axios";

const domain="judge0-ce.p.rapidapi.com"
const languageIdMap = {
  cpp: 54,
  java: 62,
  js: 63,
  py: 70,
  kt: 78,
  ts: 74,
  lua: 64,
  c: 75,
  csharp: 51,
  nasm: 45,
  bash: 46,
  lisp: 55,
  haskell: 61,
  go: 60,
  rust: 73,
  sql: 82,
  swift: 83
};


interface RequestOptions {
  method: "POST";
  url: string;
  headers: {
    'X-RapidAPI-Key': string,
    'X-RapidAPI-Host': string,
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
  url: `https://${domain}/submissions?base64_encoded=true`,
  headers: {
    'X-RapidAPI-Key': process.env.JudgeAPI as string,
    'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com',
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
  console.log("langid: ", options.data.language_id);
  if (!options.data.language_id) {
    message.react("❌");
    return message.reply({
      content: `Invalid language. Supported languages: js, cpp, py, java, kt, ts, lua, c, csharp, nasm, bash, lisp, haskell, go, rust, sql, swift`,
      ephemeral: true,
    });
  }
  options.data.cpu_time_limit = 15;

  message.react("✅");

  try {
    const response = await axios.request(options);
    console.log("response", response.data);
    const submission_token = response.data.token;
    console.log("response", response.data);

    getRequest(message, submission_token);
  } catch (error) {
    console.log("Error:", error.message);
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
          'Invalid format. Code must be surrounded by triple backticks and the language specified(js, cpp, py, java, kt, ts, lua, c, csharp, nasm, bash, lisp, haskell, go, rust, sql, swift). \nExample:\n!run\n\\```cpp\n#include<iostream>\n\nint main() {\n\tstd::cout << "Your code here";\n\treturn 0;\n}\n\\```',
          ephemeral: true,
      });
    }
    const languageAndCode = codeBlock[1].split("\n");
    const language = languageAndCode[0].trim();
    const code = languageAndCode.slice(1).join("\n");
    //check if code is empty
    if (!code) {
      message.react("❌");
      return message.reply({
        content: "No code provided.",
        ephemeral: true,
      });
    }
    runCode(client, message, language, code);
  }
};

function getRequest(message, submission_token){
  setTimeout(async () => {
    try {
      const result = await axios.get(
        `https://${domain}/submissions/${submission_token}?base64_encoded=true`,
        {
          headers: {
            'X-RapidAPI-Key': process.env.JudgeAPI,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          },
        }
      );

      console.log("Result Response:", result.data);
      const {
        stdout: encodedStdout,
        stderr: encodedStderr,
        message: resultMessage,
        time,
        compile_output: encodedCompileOutput,
        status
      } = result.data;
      //in queue and processing
      if (status.id === 2 || status.id === 1) {
        return getRequest(message, submission_token);
      }

      let stdout = encodedStdout ? Buffer.from(encodedStdout, "base64").toString() : null;
      let stderr = encodedStderr ? Buffer.from(encodedStderr, "base64").toString() : null;
      let compile_output = encodedCompileOutput ? Buffer.from(encodedCompileOutput, "base64").toString() : null;

      if (stdout) {
        message.reply(`\nOutput:\n\`\`\`${stdout}\`\`\``);
        return;
      } else if (stderr || resultMessage || compile_output) {
        message.reactions.removeAll();
        message.react("❌");
        message.reply({
          content: `\nError:\n\`\`\`${stderr || resultMessage || compile_output}\`\`\``,
          ephemeral: true,
        });
        return;
      }

      if (result.data.time_limit_exceeded || status.id === 5) {
        message.reactions.removeAll();
        message.react("🕒");
        message.reply(`Execution exceeded the time limit.`);
        return;
      } else {
        switch(status.id) {
          case 3:
            message.reply("Code executed successfully!");
            break;
          case 4:
            message.reply("Wrong answer. Please check your code and try again.");
            break;
          case 6:
          case 10:
            message.reply("Compilation error. Please check your syntax and try again.");
            break;
          case 7:
          case 11:
            message.reply("Runtime error. Please check your code for issues like division by zero, array out of bounds, etc., and try again.");
            break;
          case 8:
            message.reply("Internal error. Please try again later.");
            break;
          case 13:
            message.reply("Presentation error. Your code's output formatting might be incorrect.");
            break;
          case 15:
            message.reply("Your code uses restricted functions or system calls. Please modify your code and try again.");
            break;
          default:
            message.reply("An unexpected error occurred. Please try again later.");
        }
      }
    } catch (error) {
      message.reactions.removeAll();
      message.react("❌");
      message.reply({
        content: `Error fetching result: ${error.message}`,
        ephemeral: true,
      });
    }
  }, 100);
}
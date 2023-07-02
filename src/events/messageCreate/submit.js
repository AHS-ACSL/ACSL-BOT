const {VM} = require("vm2");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const util = require("util");
const JSZip = require("jszip");
const sequelize = require("../../index.js");
const Level = sequelize.Level;
const config = require("../../../config.json");

const languageIdMap = {
  js: 63,
  java: 62,
  cpp: 54,
  py: 71,
};

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (
    !(
      message.content.toLowerCase().startsWith("!submit") &&
      message.channel.type === 1
    )
  )
    return;

    let questionData = JSON.parse(fs.readFileSync(path.join(__dirname, '..',"..", '..', 'currentQuestion.json'), 'utf-8'));
    if(!questionData) return message.reply("No question is currently active. Please wait for a question to be generated.");

  const codeBlock = message.content.match(/```(\w+)\n([\s\S]*?)```/);
  if (!codeBlock) {
    return message.reply(
      "Invalid format. Code must be surrounded by triple backticks and the language name."
    );
  }

  const language = codeBlock[1];
  const code = codeBlock[2];

  if (Object.keys(languageIdMap).includes(language)) {
    return message.reply(
      `Unsupported language. Supported languages are ${Object.keys(
        languageIdMap
      ).join(", ")}`
    );
  }

  const header = {
    headers: {
      "X-Auth-Token": process.env.JudgeAPI,
    },
  };

  const zip = new JSZip();

  //mutiple files
  const submissionData = {
    language_id: 89, //mutiple files
    additional_files: "",
    cpu_time_limit: 10,
    cpu_extra_time: 2,
  };

  switch (language) {
    case "js":
      break; //todo: etiher use vm or api
    case "java":
        zip.file("compile", `/usr/local/openjdk13/bin/javac Main.java ${questionData.lang[2].filename}.java`)
        zip.file("run", `java -cp . ${questionData.lang[2].filename}`)
        zip.file(`${questionData.lang[2].filename}.java`, code)
        zip.file("Main.java", questionData.lang[2].main)
        //to base64
        const content = await zip.generateAsync({type:"base64"})
        submissionData.additional_files = content
        submissionData = questionData.lang[2].runtime


      break; //todo: use api
    case "cpp":
      break; //todo: use api
    case "py":
      break; //todo: use api
  }
};

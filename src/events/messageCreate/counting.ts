import { Client, Message, TextChannel } from "discord.js";
import config from "../../../config.json";

import fs from "fs";
import path from "path";

const dataPath = path.join(__dirname, "../../../runtime/countingData.json");

let lastCount: number = 0;
let lastMsgAuthor: string | null = null;

try {
  if (fs.existsSync(dataPath)) {
    const rawData = fs.readFileSync(dataPath, "utf8");
    const parsed = JSON.parse(rawData);
    lastCount = parsed.lastCount ?? 0;
    lastMsgAuthor = parsed.lastMsgAuthor ?? null;
  } else {
    fs.mkdirSync(path.dirname(dataPath), { recursive: true });
    fs.writeFileSync(
      dataPath,
      JSON.stringify({ lastCount, lastMsgAuthor }, null, 2),
      "utf8"
    );
  }
} catch (err) {
  console.error("Error reading counting data:", err);
}

function saveCountData() {
  try {
    const data = {
      lastCount,
      lastMsgAuthor,
    };
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing counting data:", err);
  }
}

const countingHandler = async (
  client: Client,
  message: Message
): Promise<void> => {
  if (!message.guild || message.author.bot) return;

  const countingChannel = client.channels.cache.get(config.countingChannel) as
    | TextChannel
    | undefined;
  if (!countingChannel) return;

  if (message.channel.id === countingChannel.id) {
    const currentCount = parseInt(message.content);

    if (isNaN(currentCount)) {
      await message.react("❌");
      await countingChannel.send(
        `Unable to parse as a number, next number is ${lastCount + 1}.`
      );
      return;
    }

    if (
      currentCount === lastCount + 1 &&
      (!lastMsgAuthor || message.author.id !== lastMsgAuthor)
    ) {
      await message.react("👍");
      lastCount = currentCount;
      lastMsgAuthor = message.author.id;
      saveCountData();
    } else {
      await message.react("❌");
      await countingChannel.send(
        `${message.author.username} messed up at number ${
          lastCount + 1
        }. Restarting at 1.`
      );
      lastCount = 0;
      lastMsgAuthor = null;
      saveCountData();
    }
  }
};

export default countingHandler;

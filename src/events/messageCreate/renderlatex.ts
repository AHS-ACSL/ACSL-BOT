import { Client, Message, AttachmentBuilder } from "discord.js"; // Note: You mentioned "AttachmentBuilder" but the common usage is MessageAttachment
import puppeteer from "puppeteer";
import MarkdownIt from "markdown-it";
import mdKatex from "markdown-it-katex";

const latexHandler = async (
    client: Client,
    message: Message
  ): Promise<void> => {
    if (!message.guild || message.author.bot) return;


    if(!message.content.startsWith("!render") && !message.content.match(/\$\$.*?\$\$|\$.*?\$/g)){
      return;
    }
    if(message.content.startsWith("!render")){
      message.content = message.content.replace("!render", "");
    }
    //react checkmark
    message.react("✅");

  
    const md = new MarkdownIt();
    md.use(mdKatex, {"throwOnError" : false, "errorColor" : " #cc0000"});
  
    const content = md.render(message.content);
  
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
  
    await page.setContent(`<!DOCTYPE html>
  <html>
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/github-markdown-css/2.2.1/github-markdown.css"/>
  </head>
  <body>
      ${content}
  </body>
  </html>`, { waitUntil: 'networkidle0' });

    await page.setViewport({ width: 800, height: 2000 });
  
    const bodyHandle = await page.$("body");
    let { width, height } = await bodyHandle.boundingBox();
    await bodyHandle.dispose();
    height+=100;
    const screenshot = await page.screenshot({clip:{ x: 0, y: 0, width, height }});
  
    const attachment = new AttachmentBuilder(screenshot);
    await browser.close();
    const sentMessage = await message.channel.send({ files: [attachment] });
    //await sentMessage.react("🗑️");

  };
  

export default latexHandler;

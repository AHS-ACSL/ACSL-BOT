import { Client, Message, AttachmentBuilder } from "discord.js";
import puppeteer from "puppeteer";
import MarkdownIt from "markdown-it";
import mdKatex from "markdown-it-katex";

//prevents more than 3 concurrent renders, last time aws server crashed
class Semaphore {
  private tasks: (() => Promise<void>)[] = [];
  private count: number;

  constructor(count: number) {
      this.count = count;
  }

  async acquire() {
      if (this.count > 0) {
          this.count--;
          return Promise.resolve();
      } else {
          return new Promise<void>((resolve) => {
              this.tasks.push(() => {
                  resolve();
                  return Promise.resolve();
              });
          });
      }
  }

  release() {
      if (this.tasks.length > 0) {
          const next = this.tasks.pop();
          if (next) {
              next();
          }
      } else {
          this.count++;
      }
  }
}


const concurrencySemaphore = new Semaphore(3);

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
    console.log("attempting to render latex");
    //react checkmark
    message.react("✅");

    try {
        await concurrencySemaphore.acquire();

        await Promise.race([
            (async () => {
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
                width+=50;
                const screenshot = await page.screenshot({clip:{ x: 0, y: 0, width, height }});
                
                const attachment = new AttachmentBuilder(screenshot);
                await browser.close();
                await message.channel.send({ files: [attachment] });
            })(),
            new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 10000))
        ]);
    } catch (error) {
        if (error.message === 'Timeout') {
            console.log('Rendering operation timed out.');
            // Handle timeout: Send a message, cleanup resources, etc.
        } else {
            console.error('Error during rendering:', error);
            // Handle other errors.
        }
    } finally {
        concurrencySemaphore.release();
    }
};

export default latexHandler;

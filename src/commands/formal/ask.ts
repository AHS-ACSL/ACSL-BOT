import {EmbedBuilder} from "discord.js";
import {OpenAIApi, Configuration} from "openai"; 
import config from "../../../config.json";
export default {
  name: "ask",
  description: "Most advance nested if statements powered ask command",
  //devOnly: bool,
  //testOnly: bool,
  options: [
    {
      name: "prompt",
      description: "your legit question",
      type: 3,
      required: true,
    },
  ],
  //deleted : bool,
  callback: async (client, interaction) => {
    interaction.channel.sendTyping();
    const prompt = interaction.options.getString("prompt");
    const userId = interaction.user.id;

    // const hasAdminRole = interaction.member.roles.cache.some(role => config.adminsRole.includes(role.id));
    // if (!hasAdminRole && (cooldowns[userId] && cooldowns[userId] > Date.now())) {
    //     await interaction.reply({content: "You're doing that too frequently. Please wait a few minutes and try again.", ephemeral: true});
    //     return;
    // }

    let conversationlog = [
      {
        role: "system",
        content: `As a Discord Bot for the Arcadia High School ACSL Club, your aim is to provide concise and appropriate responses, while also incorporating a touch of sarcasm for non-serious questions, such as "What is 1 + 1?"`,
      },
    ];

    let prevMsg = await interaction.channel.messages.fetch({limit: 5});
    //check if prevMsg exists
    if (prevMsg) {
      //reverse prevMsg
      let lasttimestamp = 0;
      prevMsg = prevMsg.reverse();
      prevMsg.forEach((msg) => {
        try {
          //the author of the message is the bot
          if (msg.author.id === client.user.id) {
            //check if message is embed
            if (msg.embeds) {
              msg.embeds.forEach((embed) => {
                if(embed.footer.text === userId) {
                  //check if title or description is empty 
                  if (embed.title || embed.description || embed.timestamp) {
                    lasttimestamp = msg.createdTimestamp;
                    conversationlog.push({
                      role: "user",
                      content: embed.title
                    });
                    conversationlog.push({
                      role: "assistant",
                      content: embed.description
                    });
                  }
                }
              });
            }
          }
        } catch (error) {
          //ignored
          //console.log(error);
        }
      });
      //check if this time - last time is less than 10 seconds
      if (Date.now() - lasttimestamp < 10000) {
        await interaction.reply({
          content:
            "You're doing that too frequently. Please wait a few seconds and try again.",
          ephemeral: true,
        });
        return;
      }
    }

    interaction.deferReply();
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const openai = new OpenAIApi(configuration);

    conversationlog.push({
      role: "user",
      content: prompt,
    });

    //console.log(conversationlog);

    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: conversationlog as any,
    });

    //console.log(response.data.choices[0].message);

    //console.log(response.data.choices[0].message.content);

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setDescription(response.data.choices[0].message.content)
      .setTitle(prompt)
      .setFooter({"text": userId})
      .setTimestamp();
    await interaction.editReply({embeds: [embed]});
  },
};

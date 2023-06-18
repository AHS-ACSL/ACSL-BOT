const {ApplicationCommandOptionType, EmbedBuilder} = require("discord.js");
const {Configuration, OpenAIApi} = require("openai");

const config = require("../../../config.json");

const cooldowns = {};
const cooldownDuration = 5 * 60 * 1000;

module.exports = {
  name: "ask",
  description: "Most advance nested if statements powered ask command",
  //devOnly: bool,
  //testOnly: bool,
  options: [
    {
      name: "prompt",
      description: "your legit question",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
        name: "useadvancemodel",
        description: "advance model will have less token",
        type: ApplicationCommandOptionType.Boolean,
        required: true,
    }
  ],
  //deleted : bool,
  callback: async (client, interaction) => {
    const prompt = interaction.options.getString("prompt");
    const useAdvanceModel = interaction.options.getBoolean("useadvancemodel");

    const userId = interaction.user.id;

    const hasAdminRole = interaction.member.roles.cache.some(role => config.adminsRole.includes(role.id));
    if (!hasAdminRole && (cooldowns[userId] && cooldowns[userId] > Date.now())) {
        await interaction.reply({content: "You're doing that too frequently. Please wait a few minutes and try again.", ephemeral: true});
        return;
    }

    //check the length of the prompt
    if (prompt.length > 256 || (!useAdvanceModel && prompt.length > 1024)) {
        await interaction.reply({content: "Sorry your prompt is too long, we cap at 256 character for advance model and 1024 character for the other model", ephemeral: true});
        return;
    }

    await interaction.deferReply();
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
        model: useAdvanceModel ? "text-davinci-003" : "text-curie-001",
        prompt: prompt,
        temperature: 0.5,
        max_tokens: useAdvanceModel ? 64 : 256,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

    if (!response) {
      await interaction.editReply({content: "Sorry, generation failed", ephemeral: true});
      return;
    }

    //console.log(response.data);

    cooldowns[userId] = Date.now() + cooldownDuration;

    const embed = new EmbedBuilder()
      .setColor("#0099ff")
      .setDescription(response.data.choices[0].text.trim())
      .setTitle("Request Success: " + prompt);
    await interaction.editReply({embeds: [embed]});
  },
};

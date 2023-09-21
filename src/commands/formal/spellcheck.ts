import spellchecker from 'simple-spellchecker';
const dictionary = spellchecker.getDictionarySync("en-US");

module.exports = {
    name: 'spellcheck',
    description: 'grammarly premium',
    options: [
        {
            name: "phrase",
            description: "your word or sentences",
            type: 3,
            required: true
        }
    ],
    callback: async (client, interaction) => {
        const phrase = interaction.options.getString('phrase');
        const words = phrase.split(' ');

        let errorWords = [];

        words.forEach(word => {
            if (!dictionary.spellCheck(word)) {
                errorWords.push(word);
            }
        });

        let response = '**Input:** ' + phrase + '\n';
        errorWords.forEach(word => {
            const suggestions = dictionary.getSuggestions(word);
            response += `* **${word}**: ${suggestions.join(', ')}\n`;
        });

        await interaction.reply(response);
    }
}

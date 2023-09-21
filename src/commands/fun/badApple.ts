export default {
    name: 'badapple',
    description: 'Stop with the Bad Apple meme',
    callback: async (client, interaction) => {
        interaction.reply("running how to waste precious time and server resources.js (totally legal naming)")
      try {
        const images = [
            'https://media.discordapp.net/attachments/858094390663839754/858094441637740564/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094449404674058/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094456485969981/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094463267373116/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094471802650654/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094482653053008/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094488044044338/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094491169062932/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094498323890196/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094508151668756/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094514681413642/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094519731617802/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094523958951946/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094530992537632/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094541919879168/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094547631603743/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094554607648828/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094560709836820/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094570302341170/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094577236049980/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094585150832640/image0.gif',
            'https://media.discordapp.net/attachments/858094390663839754/858094594280128512/image0.gif'
          ];
    
          let previousMessage = null;
    
          for (const image of images) {
            const message = await interaction.channel.send(image);
            if (previousMessage) {
              await previousMessage.delete();
            }
            previousMessage = message;
            await sleep(9900);
          }
    
          if (previousMessage) {
            await previousMessage.delete();
          }
    
          await interaction.channel.send('Finished.');
          await sleep(5000);
      } catch (error) {
        console.log(`Error executing Bad Apple command: ${error}`);
      }
    },
  };
  
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
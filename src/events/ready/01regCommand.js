const {testServer} = require('../../../config.json');
const getApplicationCommands = require('../../utils/getApplicationCommands');
const getLocalCommands = require('../../utils/getLocalCommands');
const isCommandsDifferent = require('../../utils/isCommandsDifferent');
module.exports = async (client) =>{
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(client,testServer);

    for(const localCommand of localCommands){
        const {name, description, options} = localCommand;

        const existingCommand = await applicationCommands.cache.find(cmd => cmd.name === name);

        if(existingCommand){
            if(localCommand.deleted){
                await applicationCommands.delete(existingCommand.id);
                console.log(`Deleted command ${name}`);
                continue;
            }

            if(isCommandsDifferent(existingCommand, localCommand)){
                await applicationCommands.edit(existingCommand.id, {description, options});
                console.log(`Edited command ${name}`);
            }
        } else{
            if(localCommand.deleted){
                console.log(`Skipping Command ${name} as it is set to be deleted`);
                continue;
            }

            await applicationCommands.create({name, description, options});
            console.log(`Created command ${name}`);
        }

    }

    try {
        
    } catch (error) {
        console.log(`Error registering commands: ${error}`);
    }
}
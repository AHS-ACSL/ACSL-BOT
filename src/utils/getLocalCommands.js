const path = require('path');
const getAllFiles = require('./getAllFiles');

module.exports = (exceptions = []) =>{
    let localCommands = [];

    const commandsCategories = getAllFiles(path.join(__dirname,'..','commands'), true);

    for(const commandCategory of commandsCategories){
        const commandFiles = getAllFiles(commandCategory);
        
        for(const commandFile of commandFiles){
            const commandObject = require(commandFile);
            if(exceptions.includes(commandObject.name)) continue;
            localCommands.push(commandObject);
        }

    }

    return localCommands;
}
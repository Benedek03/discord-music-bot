const { token, testGuild, applicationID} = require('../config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { getFilesFromDir } = require('./utils.js')

// let commandFilesNames = fs.readdirSync(commandDir).filter(f => f.endsWith('.js'));
let commandFilesNames = getFilesFromDir('./commands', ['.js']);
let commands = [];

for (const file of commandFilesNames) {
    const command = require('.'+file);
    commands.push(command.data);
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log('reloading slash commands');
		await rest.put(
			Routes.applicationGuildCommands(applicationID, testGuild),
			{ body: commands },
		);
		console.log('reloaded slash commands');
	} catch (error) {
		console.error(error);
	}
})();

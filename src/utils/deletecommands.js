const { token, applicationID } = require('../../config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { getFilesFromDir } = require('./utils.js')


let commandFilesNames = getFilesFromDir('./src/commands', ['.js']);
let commands = [];

for (const file of commandFilesNames) {
	const command = require('../commands' + file);
	commands.push(command.data);
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log('deleting slash commands');
		await rest.put(
			Routes.applicationCommands(applicationID),
			{ body: [] },
		);
		console.log('deleted slash commands');
	} catch (error) {
		console.error(error);
	}
})();

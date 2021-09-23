const { token, applicationID } = require('../../config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { getFilesFromDir } = require('./utils.js')

let testGuild = process.argv[2];
let commandFilesNames = getFilesFromDir('./src/commands', ['.js']);
let commands = [];

for (const file of commandFilesNames) {
	const command = require('../commands' + file);
	commands.push(command.data);
}

const rest = new REST().setToken(token);

(async () => {
	try {
		console.log('uploading slash commands in test guild');
		await rest.put(
			Routes.applicationGuildCommands(applicationID, testGuild),
			{ body: commands },
		);
		console.log('uploaded slash commands in test guild');
	} catch (error) {
		console.error(error);
	}
})();

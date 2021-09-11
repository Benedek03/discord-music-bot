const { token, testGuild, commandDir, applicationID} = require('./config.json');
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

let commandFilesNames = fs.readdirSync(commandDir).filter(f => f.endsWith('.js'));
let commands = [];

for (const file of commandFilesNames) {
    const command = require(commandDir + file);
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

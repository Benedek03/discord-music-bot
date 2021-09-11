const {Client, Intents, Collection} = require('discord.js');
const { token, commandDir } = require('./config.json');
const fs = require('fs');

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

client.commands = new Collection();

let commandFilesNames = fs.readdirSync(commandDir).filter(f => f.endsWith('.js'));
for (const file of commandFilesNames) {
    const command = require(commandDir + file);
    client.commands.set(command.data.name, command)
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply('oops there is an error');
	}
});

client.on('ready', () => {
    console.log('the bot is ready');
});

client.login(token);
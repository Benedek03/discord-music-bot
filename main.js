const config = require('./config.json');
const DiscordJS = require('discord.js');
const WOKCommands = require('wokcommands');
const path = require('path');

const client = new DiscordJS.Client({
    intents: [
        DiscordJS.Intents.FLAGS.GUILDS,
        DiscordJS.Intents.FLAGS.GUILD_MESSAGES,
        DiscordJS.Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
});

client.on('ready', () => {
    new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        testServers: config.testGuilds,
        showWarns: false
    });
});

client.login(config.token);
import { commandDataArray, commandMap } from "./commad";
import { deployInGuild, deleteInGuild } from "./deploy";
import { Client, Intents, Interaction } from 'discord.js';
import { config as dotenv } from 'dotenv'; dotenv();
if (!process.env.DISCORD_TOKEN) {
    console.error('no process.env.DISCORD_TOKEN in .env');
    process.exit();
}
if (!process.env.TESTGUILDID) {
    console.error('no process.env.DISCORD_TOKEN in .env');
    process.exit();
}
const testGuildId = process.env.TESTGUILDID;

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;
    if (!interaction.guildId) {
        interaction.reply('this bot works only in servers');
        return;
    }
    try {
        if (commandMap.has(interaction.commandName)) {
            await commandMap.get(interaction.commandName)?.execute(interaction);
        } else {
            interaction.reply('this command is not working at the moment');
        }
    } catch (e) {
        console.error(e);
        interaction.reply('oops there was an error');
    }
})

client.on('ready', async () => {
    await deployInGuild(testGuildId, commandDataArray);
    console.log('ready');
});
client.login(process.env.DISCORD_TOKEN);

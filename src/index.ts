import { commandDataArray, commandMap } from "./commad.js";
import { RESTPostAPIApplicationCommandsJSONBody as DataType, Routes } from 'discord-api-types/v9';
import { REST } from "@discordjs/rest";
import { Client, Intents, Interaction } from 'discord.js';
import mongo from "mongoose";
import { config as dotenv } from 'dotenv'; dotenv();

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string);
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});
const appid = client.application?.id as string

if (process.env.DELETE_COMMANDS = "TRUE") {
    console.log('Started deleteing global application (/) commands.');
    await rest.put(
        Routes.applicationCommands(appid),
        { body: [] },
    );
    if (process.env.TESTGUILDID) {
        await rest.put(
            Routes.applicationGuildCommands(appid, process.env.TESTGUILDID),
            { body: [] },
        );
    }
    console.log('Successfully deleted global application (/) commands.')
    process.exit();
}

if (!process.env.DISCORD_TOKEN) {
    console.error('no DISCORD_TOKEN variable in the enviroment');
    process.exit();
} if (!process.env.MONGO_URI) {
    console.error("no MONGO_URI variable in the enviroment");
    process.exit();
}

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;
    if (!interaction.guildId) {
        interaction.reply('this bot works only in servers');
        return;
    }
    try {
        if (commandMap.has(interaction.commandName)) {
            await commandMap.get(interaction.commandName)?.execute(interaction, interaction.guildId);
        } else {
            interaction.reply('this command is not working at the moment');
        }
    } catch (e) {
        console.error(e);
        interaction.reply('oops there was an error');
    }
})

client.on('ready', async () => {
    console.log('Started refreshing global application (/) commands.');
    if (!process.env.TESTGUILDID) {
        await rest.put(
            Routes.applicationCommands(appid),
            { body: commandDataArray },
        );
    } else {
        await rest.put(
            Routes.applicationGuildCommands(appid, process.env.TESTGUILDID),
            { body: commandDataArray },
        );
    }
    console.log('Successfully reloaded global application (/) commands.');

    console.log('connecting to the database.');
    await mongo.connect(process.env.MONGO_URI as string);
    console.log('connected to the database.');

    console.log('ready');
});
client.login(process.env.DISCORD_TOKEN);

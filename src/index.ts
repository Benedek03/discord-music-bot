import { Client, Intents, Interaction } from 'discord.js';
import { REST } from "@discordjs/rest";
import { Routes } from 'discord-api-types/v10';
import { commandDataArray, commandMap } from "./command.js";
import { Queue } from "./queue.js";
import mongo from "mongoose";
import { config as dotenv } from 'dotenv'; dotenv();
if (!process.env.DISCORD_TOKEN) {
    console.error('no DISCORD_TOKEN variable in the enviroment');
    process.exit();
}

export let guildMap = new Map<string, Queue>();
export const client = new Client({
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
        interaction.reply('> this bot works only in servers');
        return;
    }
    try {
        if (commandMap.has(interaction.commandName)) {
            await commandMap.get(interaction.commandName)?.execute(interaction, interaction.guildId);
        } else {
            interaction.reply('> this command is not working at the moment');
        }
    } catch (e) {
        console.error(e);
        interaction.reply('> oops there was an error');
    }
})

client.on('ready', async () => {
    const appid = client.application?.id as string
    const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string);

    //#region deleting / commands both globally and in testguild if DELETE_COMMANDS env variable is "TRUE"
    if (process.env.DELETE_COMMANDS == "TRUE") {
        try {
            await rest.put(
                Routes.applicationCommands(appid),
                { body: [] },
            );
            console.info('successfully deleted global / commands')
            if (process.env.TESTGUILDID) {
                await rest.put(
                    Routes.applicationGuildCommands(appid, process.env.TESTGUILDID),
                    { body: [] },
                );
                console.info(`successfully deleted / commands in guild: ${process.env.TESTGUILDID}`)
            }
            process.exit();
        } catch (error) {
            console.error(error);
            console.error("clouldn't delete / commands");
            process.exit();
        }
    }
    //#endregion

    //#region checking if necessary env vars exist
    if (!process.env.MONGO_URI) {
        console.error("no MONGO_URI variable in the enviroment");
        process.exit();
    }
    //#endregion

    //#region refreshing global / commands or in a testguild if TESTGUILDID env var exist
    try {
        if (!process.env.TESTGUILDID) {
            await rest.put(
                Routes.applicationCommands(appid),
                { body: commandDataArray },
            );
            console.info('global / commands reloaded');
        } else {
            await rest.put(
                Routes.applicationGuildCommands(appid, process.env.TESTGUILDID),
                { body: commandDataArray },
            );
            console.info(`/ commands in guild: ${process.env.TESTGUILDID} reloaded`);
        }
    } catch (error) {
        console.error(error);
        console.error("clouldn't reload / commands");
        process.exit();
    }
    //#endregion

    //#region connecting to database
    try {
        await mongo.connect(process.env.MONGO_URI as string);
        console.log('database connected');
    } catch (error) {
        console.error(error);
        console.error("clouldn't connect to database");
        process.exit();
    }
    //#endregion

    client.user?.setActivity({
        type: 'WATCHING',
        name: '/help'
    });
    console.info('ready 🥳');
});

client.login(process.env.DISCORD_TOKEN);

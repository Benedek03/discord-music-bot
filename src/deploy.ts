import { RESTPostAPIApplicationCommandsJSONBody as DataType } from 'discord-api-types';
import { REST } from "@discordjs/rest";
import { commandDataArray } from "./commad";
import { config as dotenv } from "dotenv"; dotenv();

const rest = new REST({ version: '9' }).setToken(process.env.DISCORD_TOKEN as string);
const applicationId = process.env.APPLICATIONID as string;

export async function deployInGuild(guildId: string, commads: DataType[]) {
    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
            // Routes.applicationGuildCommands(applicationId, guildId),
            `/applications/${applicationId}/guilds/${guildId}/commands`,
            { body: commads },
        );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

export async function deleteInGuild(guildId: string) {
    try {
        console.log('Started deleting application (/) commands.');
        await rest.put(
            // Routes.applicationGuildCommands(applicationId, guildId),
            `/applications/${applicationId}/guilds/${guildId}/commands`,
            { body: [] },
        );
        console.log('Successfully deleted application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

export async function deployGlobal(commads: DataType[]) {
    try {
        console.log('Started refreshing global application (/) commands.');
        await rest.put(
            // Routes.applicationCommands(applicationId),
            `/applications/${applicationId}/commands`,
            { body: commads },
        );
        console.log('Successfully reloaded global application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

export async function deleteGlobal() {
    try {
        console.log('Started deleting global application (/) commands.');
        await rest.put(
            // Routes.applicationCommands(applicationId),
            `/applications/${applicationId}/commands`,
            { body: [] },
        );
        console.log('Successfully deleted global application (/) commands.');
    } catch (error) {
        console.error(error);
    }
}

if (require.main === module) {
    const myArgs = process.argv.slice(2);
    console.log('args: (global/guilds) (deploy/deletes) (if guild guildid)');
    if (myArgs.length == 2 && myArgs[0].toLowerCase() == 'global') {
        if (myArgs[1].toLowerCase() == 'delete')
            deleteGlobal();
        else if (myArgs[1].toLowerCase() == 'deploy')
            deployGlobal(commandDataArray);
    } else if (myArgs.length == 2 && myArgs[0].toLowerCase() == 'guild') {
        if (myArgs[1].toLowerCase() == 'delete')
            deleteInGuild(myArgs[2]);
        else if (myArgs[1].toLowerCase() == 'deploy')
            deployInGuild(myArgs[2], commandDataArray);
    }
}

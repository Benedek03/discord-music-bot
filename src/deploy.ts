import { RESTPostAPIApplicationCommandsJSONBody as DataType } from 'discord-api-types';
import { REST } from "@discordjs/rest";
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

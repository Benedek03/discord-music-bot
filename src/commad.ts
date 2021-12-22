import { RESTPostAPIApplicationCommandsJSONBody as DataType } from 'discord-api-types';
import { CommandInteraction } from 'discord.js';

export type Command = {
    data: DataType,
    execute: (interaction: CommandInteraction) => Promise<void>;
}
export const commandMap: Map<string, Command> = new Map<string, Command>();
export const commandDataArray: DataType[] = [];

import ping from './cmds/ping';
commandMap.set(ping.data.name, ping);
commandDataArray.push(ping.data);

import say from './cmds/say';
commandMap.set(say.data.name, say);
commandDataArray.push(say.data);
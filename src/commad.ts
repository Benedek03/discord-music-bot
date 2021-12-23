import { RESTPostAPIApplicationCommandsJSONBody as DataType } from 'discord-api-types';
import { CommandInteraction } from 'discord.js';

export type Command = {
    data: DataType;
    execute: (interaction: CommandInteraction) => Promise<void>;
}
export const commandMap: Map<string, Command> = new Map<string, Command>();
export const commandDataArray: DataType[] = [];

import play from './cmds/play';
commandMap.set(play.data.name, play);
commandDataArray.push(play.data);

import queue from './cmds/queue';
commandMap.set(queue.data.name, queue);
commandDataArray.push(queue.data);

import loopsong from './cmds/loopsong';
commandMap.set(loopsong.data.name, loopsong);
commandDataArray.push(loopsong.data);

import loopqueue from './cmds/loopqueue';
commandMap.set(loopqueue.data.name, loopqueue);
commandDataArray.push(loopqueue.data);
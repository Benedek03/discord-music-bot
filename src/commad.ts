import { RESTPostAPIApplicationCommandsJSONBody as DataType } from 'discord-api-types';
import { CommandInteraction } from 'discord.js';

export type Command = {
    data: DataType;
    execute: (interaction: CommandInteraction, guildId: string) => Promise<void>;
}
export const commandMap: Map<string, Command> = new Map<string, Command>();
export const commandDataArray: DataType[] = [];

for (const f of [
    './cmds/disconnect.js',
    './cmds/loopQueue.js',
    './cmds/loopSong.js',
    './cmds/play.js',
    './cmds/queue.js',
    './cmds/remove.js',
    './cmds/skip.js',
    './cmds/search.js',
    './cmds/playSearch.js',

    './cmds/playlist/add.js',
    './cmds/playlist/create.js',
    './cmds/playlist/playlists.js',
    './cmds/playlist/getId.js',
    './cmds/playlist/getSongs.js',
    './cmds/playlist/link.js',
    './cmds/playlist/remove.js',
    './cmds/playlist/removeSong.js',
    './cmds/playlist/play.js',
    './cmds/playlist/replaceQueue.js',
]) {
    const c = (await import(f)).default;
    commandMap.set(c.data.name, c);
    commandDataArray.push(c.data);
}

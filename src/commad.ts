import { RESTPostAPIApplicationCommandsJSONBody as DataType } from 'discord-api-types';
import { CommandInteraction } from 'discord.js';

export type Command = {
    data: DataType;
    execute: (interaction: CommandInteraction) => Promise<void>;
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

    './cmds/playlist/plAdd.js',
    './cmds/playlist/plCreate.js',
    './cmds/playlist/plGet.js',
    './cmds/playlist/plGetId.js',
    './cmds/playlist/plGetSongs.js',
    './cmds/playlist/plLink.js',
    './cmds/playlist/plRemove.js',
    './cmds/playlist/plRemoveSong.js',
    './cmds/playlist/plPlay.js',
    './cmds/playlist/plReplaceQueue.js',

    './cmds/search.js',
    './cmds/playSearch.js',
]) {
    const c = (await import(f)).default;
    // console.log(c);
    commandMap.set(c.data.name, c);
    commandDataArray.push(c.data);
}

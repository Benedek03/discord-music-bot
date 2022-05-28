import { RESTPostAPIApplicationCommandsJSONBody as DataType } from 'discord-api-types/v10';
import { CommandInteraction } from 'discord.js';

export type Command = {
    data: DataType;
    execute: (interaction: CommandInteraction, guildId: string) => Promise<void>;
}
export const commandMap: Map<string, Command> = new Map<string, Command>();
export const commandDataArray: DataType[] = [];

for (const f of [
    './cmds/play.js',
    './cmds/queue.js',
    './cmds/search.js',
    './cmds/disconnect.js',
    './cmds/loopQueue.js',
    './cmds/loopSong.js',
    './cmds/skip.js',
    './cmds/remove.js',

    './cmds/playlist/create.js',
    './cmds/playlist/add.js',
    './cmds/playlist/playlists.js',
    './cmds/playlist/getId.js',
    './cmds/playlist/getSongs.js',
    './cmds/playlist/link.js',
    './cmds/playlist/remove.js',
    './cmds/playlist/removeSong.js',
    './cmds/playlist/play.js',
    './cmds/playlist/replaceQueue.js',
]) {
    import(f).then(c => {
        commandMap.set(c.default.data.name, c.default);
        commandDataArray.push(c.default.data);
    })
}

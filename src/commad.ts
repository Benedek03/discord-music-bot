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
    './cmds/loopqueue.js',
    './cmds/loopsong.js',
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
]) {
    const c = require(f).default;
    // console.log(c);
    commandMap.set(c.data.name, c);
    commandDataArray.push(c.data);
}

// import play from './cmds/play';
// commandMap.set(play.data.name, play);
// commandDataArray.push(play.data);

// import queue from './cmds/queue';
// commandMap.set(queue.data.name, queue);
// commandDataArray.push(queue.data);

// import loopsong from './cmds/loopsong';
// commandMap.set(loopsong.data.name, loopsong);
// commandDataArray.push(loopsong.data);

// import loopqueue from './cmds/loopqueue';
// commandMap.set(loopqueue.data.name, loopqueue);
// commandDataArray.push(loopqueue.data);

// import disconnect from './cmds/disconnect';
// commandMap.set(disconnect.data.name, disconnect);
// commandDataArray.push(disconnect.data);

// import skip from './cmds/skip';
// commandMap.set(skip.data.name, skip);
// commandDataArray.push(skip.data);

// import remove from './cmds/remove';
// commandMap.set(remove.data.name, remove);
// commandDataArray.push(remove.data);

// import getplaylists from './cmds/playlist/getplaylists';
// commandMap.set(getplaylists.data.name, getplaylists);
// commandDataArray.push(getplaylists.data);

// import getplaylistid from './cmds/playlist/getplaylistid';
// commandMap.set(getplaylistid.data.name, getplaylistid);
// commandDataArray.push(getplaylistid.data);

// import getsongs from './cmds/playlist/plGetSongs';
// commandMap.set(getsongs.data.name, getsongs);
// commandDataArray.push(getsongs.data);

// import createplaylist from './cmds/playlist/createplaylist';
// commandMap.set(createplaylist.data.name, createplaylist);
// commandDataArray.push(createplaylist.data);

// import linkplaylist from './cmds/playlist/linkplaylist';
// commandMap.set(linkplaylist.data.name, linkplaylist);
// commandDataArray.push(linkplaylist.data);

// import addtoplaylist from './cmds/playlist/addtoplaylist';
// commandMap.set(addtoplaylist.data.name, addtoplaylist);
// commandDataArray.push(addtoplaylist.data);
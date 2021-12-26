import { createGuild, createPlaylist, getPlaylistId, getPlaylists, getSongs, linkPlaylist, pushSong, removePlaylist, removeSong } from "./database";
import { createSong } from "./song";

export let arr = [
    "https://www.youtube.com/watch?v=_lK4cX5xGiQ",
    "https://www.youtube.com/watch?v=ObOqq1knVxs",
    "https://www.youtube.com/watch?v=zw79RVnlCb0",
    "https://www.youtube.com/watch?v=k1BneeJTDcU",
    "https://www.youtube.com/watch?v=e8X3ACToii0",
    "https://www.youtube.com/watch?v=8DyziWtkfBw",
    "https://www.youtube.com/watch?v=SBjQ9tuuTJQ",
    "https://www.youtube.com/watch?v=xat1GVnl8-k",
];

export let guildId = "851018777739132938";

// (async () => {
//     await createGuild(guildId);
//     let playlistId = await createPlaylist();
//     for (let i = 0; i < arr.length; i++) {
//         const element = arr[i];
//         const song = await createSong(element);
//         if (!song)
//             continue;
//         await pushSong(playlistId, song);
//     }

//     console.log(await linkPlaylist(guildId, playlistId.toString(), 'muzsika'));
//     console.log(await linkPlaylist(guildId, playlistId.toString(), 'asdf'));

//     console.log(await getPlaylists(guildId));

//     // console.log(await getPlaylistId(guildId, 'muzsika'));
//     // console.log(await getPlaylistId(guildId, 'sadf'));

//     console.log("--==DONE==--");
// })();

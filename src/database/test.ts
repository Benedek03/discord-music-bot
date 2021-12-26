// import { createGuild, createPlaylist, getPlaylistId, getPlaylists, getSongs, linkPlaylist, pushSong, removePlaylist, removeSong } from "./database";
import { createSong } from "../song";
import { gNameExists, gGetPlId, gGetPlaylists, gLinkPl, gRemovePl } from "./guild";
import { createPlaylist, exists, getSongs, pushSong, removeSong } from "./playlist";

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

(async () => {
    // await createGuild(guildId);
    let playlistId = await createPlaylist();

    console.log(await exists(playlistId));
    console.log(await exists("61c8032ad7d9436ca790b4b6"));

    console.log(await getSongs(playlistId));
    for (let i = 0; i < arr.length; i++) {
        const element = arr[i];
        const song = await createSong(element);
        if (!song)
            continue;
        await pushSong(playlistId, song);
    }
    console.log(await getSongs(playlistId));
    console.log(await removeSong(playlistId, -1));
    console.log(await removeSong(playlistId, 8));
    console.log(await removeSong(playlistId, 7));
    console.log(await getSongs(playlistId));

    console.log(await gLinkPl(guildId, playlistId, 'muzsika'))
    console.log(await gLinkPl(guildId, playlistId, 'muzsika'))
    console.log(await gNameExists(guildId, 'muzsika'))
    console.log(await gNameExists(guildId, 'asdf'))
    console.log(await gGetPlId(guildId, 'muzsika'));
    console.log(await gGetPlId(guildId, 'asdf'));
    console.log(await gGetPlaylists(guildId));
    console.log(await gRemovePl(guildId, 'muzsika'));
    console.log(await gRemovePl(guildId, 'asdf'));
    //existsname
    //linkpl
    //getid
    //rm
    //getpls
    console.log("--==DONE==--");
})();

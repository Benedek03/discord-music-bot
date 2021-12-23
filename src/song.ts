import { createAudioResource } from '@discordjs/voice';
import ytdl from "ytdl-core";

export type Song = {
    title: string;
    url: string;
}

export async function getTitle(url: string) {
    return (await ytdl.getInfo(url)).videoDetails.title;
}

export async function createSong(url: string) {
    return {
        title: await getTitle(url),
        url: url
    } as Song;
}
export async function createResource(url: string) {
    let asdf = await ytdl(url, { highWaterMark: 1 << 25 });
    return createAudioResource(asdf);
}

// import ytdl from "ytdl-core";

// client.on('messageCreate', msg => {
    //     if (!msg.guild || !msg.guildId) return;
    //     if (msg.content != 'ping') return;

//     msg.reply('pong');
//     try {
//         let player = createAudioPlayer();
//         let connection = joinVoiceChannel({
//             selfDeaf: false,
//             selfMute: false,
//             guildId: msg.guildId,
//             channelId: msg.member?.voice.channelId as string,
//             adapterCreator: msg.guild.voiceAdapterCreator
//         });
//         (async () => {
//             // let r = await ytdl('https://www.youtube.com/watch?v=-qWxHEUukEc&ab_channel=MusicLibrary-1Hour',{highWaterMark:1<<25});
//             let r = await ytdl('https://www.youtube.com/watch?v=-qWxHEUukEc&ab_channel=MusicLibrary-1Hour',{highWaterMark:1<<25});
//             let res = createAudioResource(r);
//             connection.subscribe(player);
//             player.play(res);
//         })();

//     } catch (err) {
//         console.error(err);
//     }
// });
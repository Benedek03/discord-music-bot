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
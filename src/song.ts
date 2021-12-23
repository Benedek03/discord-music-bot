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
    try {
        if (!ytdl.validateURL(url))
            return null;
        let data = await ytdl.getInfo(url)
        if (data.videoDetails.isPrivate || data.videoDetails.age_restricted)
            return null;
        return {
            title: data.videoDetails.title,
            url: 'https://www.youtube.com/watch?v=' + ytdl.getURLVideoID(url)
        } as Song;
    } catch (error) {
        return null;
    }
}
export async function createResource(url: string) {
    let asdf = await ytdl(url, { highWaterMark: 1 << 25 });
    return createAudioResource(asdf);
}

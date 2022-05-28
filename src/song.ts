import ytdl from "ytdl-core";

export type Song = {
    title: string;
    url: string;
}

export async function constructSong(url: string) {
    try {
        if (!ytdl.validateURL(url))
            return null;

        let data = await ytdl.getInfo(url)
        if (data.videoDetails.isPrivate || data.videoDetails.age_restricted || data.videoDetails.isUnlisted)
            return null;
        else
            return {
                title: data.videoDetails.title,
                url: 'https://www.youtube.com/watch?v=' + ytdl.getURLVideoID(url)
            } as Song;

    } catch (error) {
        console.error(error);
        return null;
    }
}

import ytdl from "ytdl-core";
import ytsr, { Video } from 'ytsr';

export async function ytGetTitle(url: string) {
    return (await ytdl.getInfo(url)).videoDetails.title;
}

export async function ytSearch(searchTerm:string, limit: number) {
    const query = (await ytsr.getFilters(searchTerm)).get('Type')?.get('Video')?.url as string;
    return (await ytsr(query, { limit: limit })).items as Video[];
}

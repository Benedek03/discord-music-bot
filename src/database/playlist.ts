import mongo from "mongoose";
import { Song } from "../song";

interface pl extends mongo.Document {
    songs: [{
        title: string,
        url: string
    }];
}

const playlistSchema = new mongo.Schema<pl>({
    songs: {
        required: true, type: [{
            title: { required: true, type: String },
            url: { required: true, type: String }
        }]
    }
});
const playlistModel = mongo.model<pl>('playlist', playlistSchema);

export async function plCreate(): Promise<string> {
    return (await playlistModel.create({ songs: [] }))._id.toString();
}

export async function plExists(playlistId: string) {
    if (!mongo.isValidObjectId(playlistId))
        return false;
    return await playlistModel.exists({ _id: playlistId });
}

export async function plGetSongs(playlistId: string): Promise<Song[] | null> {
    let asd = await playlistModel.findById(playlistId);
    if (asd)
        return asd.songs as Song[];
    return null;
}

export async function plAddSong(playlistId: string, song: Song) {
    await playlistModel.findByIdAndUpdate(
        playlistId,
        { $push: { songs: song, } }
    );
}

export async function plRemoveSong(playlistId: string, index: number) {
    let s = await plGetSongs(playlistId);
    if (!s || index < 0 || index > s.length - 1)
        return false;
    s.splice(index, 1);
    await playlistModel.findByIdAndUpdate(
        playlistId,
        { $set: { songs: s, } }
    );
    return true;
}

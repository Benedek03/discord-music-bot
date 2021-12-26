import mongo from "mongoose";
import { Song } from "../song";
import { config as dotenv } from 'dotenv'; dotenv();
if (!process.env.MONGO_URL) {
    console.error("no process.env.MONGO_URL in .env");
    process.exit();
} mongo.connect(process.env.MONGO_URL);

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

export async function createPlaylist(): Promise<string> {
    return (await playlistModel.create({ songs: [] }))._id.toString();
}

export async function exists(playlistId: string) {
    if (!mongo.isValidObjectId(playlistId))
        return false;
    return await playlistModel.exists({ _id: playlistId });
}

export async function getSongs(playlistId: string): Promise<Song[] | null> {
    let asd = await playlistModel.findById(playlistId);
    if (asd)
        return asd.songs as Song[];
    return null;
}

export async function pushSong(playlistId: string, song: Song) {
    await playlistModel.findByIdAndUpdate(
        playlistId,
        { $push: { songs: song, } }
    );
}

export async function removeSong(playlistId: string, index: number) {
    let s = await getSongs(playlistId);
    if (!s || index < 0 || index > s.length - 1)
        return false;
    s.splice(index, 1);
    await playlistModel.findByIdAndUpdate(
        playlistId,
        { $set: { songs: s, } }
    );
    return true;
}

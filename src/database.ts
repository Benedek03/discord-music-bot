import mongo from "mongoose";
import { config as dotenv } from 'dotenv'; dotenv();
if (!process.env.MONGO_URL) {
    console.error("no process.env.MONGO_URL in .env");
    process.exit();
}

mongo.connect(process.env.MONGO_URL);


const playlistSchema = new mongo.Schema({
    songs: [String]
});
const playlistModel = mongo.model('playlist', playlistSchema);

const guildSchema = new mongo.Schema({
    _id: String,
    playlists: [{
        name: String
    }]
});
const guildModel = mongo.model('guild', guildSchema);

// playlist functions

export async function createPlaylist(): Promise<mongo.Types.ObjectId> {
    return (await playlistModel.create({ songs: [] }))._id;
}

export async function getSongs(playlistId: mongo.Types.ObjectId): Promise<string[]> {
    return (await playlistModel.findById(playlistId)).songs;
}

export async function pushSong(playlistId: mongo.Types.ObjectId, url: string) {
    await playlistModel.findByIdAndUpdate(
        playlistId,
        { $push: { songs: url, } }
    );
}

export async function removeSong(playlistId: mongo.Types.ObjectId, index: number) {
    let s = await getSongs(playlistId);
    s.splice(index, 1);
    await playlistModel.findByIdAndUpdate(
        playlistId,
        { $set: { songs: s, } }
    );
}

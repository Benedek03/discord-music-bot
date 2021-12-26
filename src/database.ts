import mongo from "mongoose";
import { Song } from "./song";
import { config as dotenv } from 'dotenv'; dotenv();
if (!process.env.MONGO_URL) {
    console.error("no process.env.MONGO_URL in .env");
    process.exit();
}

mongo.connect(process.env.MONGO_URL);


const playlistSchema = new mongo.Schema({
    songs: [{
        title: String,
        url: String,
    }]
});
const playlistModel = mongo.model('playlist', playlistSchema);

const guildSchema = new mongo.Schema({
    _id: String,
    playlists: [{
        name: String,
        playlistId: mongo.Schema.Types.ObjectId
    }]
});
const guildModel = mongo.model('guild', guildSchema);

//#region playlist functions

export async function createPlaylist(): Promise<string> {
    return (await playlistModel.create({ songs: [] }))._id.toString();
}

export async function getSongs(playlistId: string): Promise<Song[] | null> {
    try {
        let asd = await playlistModel.findById(playlistId);
        if (asd)
            return asd.songs as Song[];
    } catch (error) {

    } return null;
}

export async function pushSong(playlistId: string, song: Song) {
    await playlistModel.findByIdAndUpdate(
        playlistId,
        { $push: { songs: song, } }
    );
}

export async function removeSong(playlistId: string, index: number) {
    let s = await getSongs(playlistId) as Song[];
    s.splice(index, 1);
    await playlistModel.findByIdAndUpdate(
        playlistId,
        { $set: { songs: s, } }
    );
}
//#endregion

// guild functions

export async function createGuild(guildId: string) {
    if (await guildModel.exists({ _id: guildId }))
        return;
    await guildModel.create({
        _id: guildId,
        playlists: []
    });
}

export async function linkPlaylist(guildId: string, playlistId: string, name: string) {
    let guild = await guildModel.findById(guildId);
    if (guild.playlists.some((x: any) => x.name == name))
        return false;

    await guildModel.findByIdAndUpdate(
        guildId,
        { $push: { playlists: { name, playlistId }, } }
    );
    return true;
}

export async function getPlaylistId(guildId: string, name: string): Promise<string | null> {
    let guild = await guildModel.findById(guildId);
    if (!guild.playlists.some((x: any) => x.name == name))
        return null;
    return guild.playlists.filter((x: any) => x.name == name)[0].playlistId.toString();
}

export async function removePlaylist(guildId: string, name: string) {
    await guildModel.findByIdAndUpdate(
        guildId,
        { $pull: { playlists: { name } } }
    );
}

export async function getPlaylists(guildId: string) {
    return (await guildModel.findById(guildId)).playlists;
}
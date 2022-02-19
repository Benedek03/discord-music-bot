import mongo from "mongoose";
import { Song } from "./song";

interface guild extends mongo.Document {
    _id: string,
    playlists: [{
        name: string;
        playlistId: mongo.ObjectId
    }]
}

const guildSchema = new mongo.Schema<guild>({
    _id: { required: true, type: String },
    playlists: {
        required: true, type: [{
            name: { required: true, type: String },
            playlistId: { required: true, type: mongo.Schema.Types.ObjectId }
        }]
    }
});
const guildModel = mongo.model<guild>('guild', guildSchema);

export async function createGuild(guildId: string) {
    if (await guildModel.exists({ _id: guildId }))
        return;
    await guildModel.create({
        _id: guildId,
        playlists: []
    });
}

export async function nameExists(guildId: string, name: string): Promise<boolean> {
    return (await guildModel.findById(guildId) as (guild & { _id: string; })).playlists.some((x: any) => x.name == name)
    // return await guildModel.exists({
    //     _id: guildId,
    //     playlists: { name }
    // });
}

export async function linkPlaylist(guildId: string, playlistId: string, name: string) {
    if (await nameExists(guildId, name))
        return false;
    await guildModel.findByIdAndUpdate(
        guildId,
        { $push: { playlists: { name, playlistId }, } }
    );
    return true;
}

export async function getPlayistId(guildId: string, name: string): Promise<string | null> {
    if (!await nameExists(guildId, name))
        return null;
    let guild = await guildModel.findById(guildId);
    if (!guild)
        return null;
    return guild.playlists.filter((x: any) => x.name == name)[0].playlistId.toString();
}

export async function removePlaylist(guildId: string, name: string) {
    if (!await nameExists(guildId, name))
        return false;
    await guildModel.findByIdAndUpdate(
        guildId,
        { $pull: { playlists: { name } } }
    );
    return true;
}

export async function getPlaylists(guildId: string) {
    return (await guildModel.findById(guildId) as (guild & { _id: string; })).playlists;
}

//-===-

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

export async function playlistExists(playlistId: string) {
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

export async function addSong(playlistId: string, song: Song) {
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

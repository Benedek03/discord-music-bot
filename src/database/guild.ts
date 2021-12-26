import mongo from "mongoose";
import { config as dotenv } from 'dotenv'; dotenv();
if (!process.env.MONGO_URL) {
    console.error("no process.env.MONGO_URL in .env");
    process.exit();
} mongo.connect(process.env.MONGO_URL);

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

export async function gCreate(guildId: string) {
    if (await guildModel.exists({ _id: guildId }))
        return;
    await guildModel.create({
        _id: guildId,
        playlists: []
    });
}

export async function gNameExists(guildId: string, name: string): Promise<boolean> {
    await gCreate(guildId);
    return (await guildModel.findById(guildId) as (guild & { _id: string; })).playlists.some((x: any) => x.name == name)
    // return await guildModel.exists({
    //     _id: guildId,
    //     playlists: { name }
    // });
}

export async function gLinkPl(guildId: string, playlistId: string, name: string) {
    await gCreate(guildId);
    if (await gNameExists(guildId, name))
        return false;
    await guildModel.findByIdAndUpdate(
        guildId,
        { $push: { playlists: { name, playlistId }, } }
    );
    return true;
}

export async function gGetPlId(guildId: string, name: string): Promise<string | null> {
    await gCreate(guildId);
    if (!await gNameExists(guildId, name))
        return null;
    let guild = await guildModel.findById(guildId);
    if (!guild)
        return null;
    return guild.playlists.filter((x: any) => x.name == name)[0].playlistId.toString();
}

export async function gRemovePl(guildId: string, name: string) {
    await gCreate(guildId);
    if (!await gNameExists(guildId, name))
        return false;
    await guildModel.findByIdAndUpdate(
        guildId,
        { $pull: { playlists: { name } } }
    );
    return true;
}

export async function gGetPlaylists(guildId: string) {
    await gCreate(guildId);
    return (await guildModel.findById(guildId) as (guild & { _id: string; })).playlists;
}

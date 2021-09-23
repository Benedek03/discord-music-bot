const { mongoLink } = require('../config.json');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, demuxProbe } = require('@discordjs/voice');
const youtubedl = require('youtube-dl-exec');
const mongo = require('mongoose');
const getYoutubeTitle = require('get-youtube-title');

//#region helper functions
function ytdl(link) {
    return new Promise((resolve, reject) => {
        const process = youtubedl.raw(
            link,
            {
                o: '-',
                q: '',
                f: 'bestaudio[ext=webm+acodec=opus+asr=48000]/bestaudio',
                r: '100K',
            },
            { stdio: ['ignore', 'pipe', 'ignore'] },
        );
        if (!process.stdout) {
            reject(new Error('No stdout'));
            return;
        }
        const stream = process.stdout;
        const onError = (error) => {
            if (!process.killed) process.kill();
            stream.resume();
            reject(error);
        };
        process.once('spawn', () => {
            demuxProbe(stream)
                .then((probe) => resolve(createAudioResource(probe.stream, { metadata: this, inputType: probe.type })))
                .catch(onError);
        })
            .catch(onError);
    });
}
function validate(interaction) {
    if (!queues[interaction.guildId]) {
        interaction.reply('i am not in a voice channel');
        return false;
    }
    if (!interaction.member.voice.channel) {
        interaction.reply('you are not in a voice channel');
        return false;
    }
    if (interaction.member.voice.channel.id != queues[interaction.guildId].channelID) {
        interaction.reply('you are in a different voice channel');
        return false;
    }
    return true;
}
async function dbGetGuild(guildID) {
    let guild = await guildModel.findById(guildID);
    if (!guild) {
        guild = await guildModel.create({
            _id: guildID,
            playlists: []
        })
    }
    return guild;
}
//#endregion

let queues = Object();
class Queue {
    constructor(channel, link) {
        this.guildID = channel.guild.id;
        this.channelID = channel.id;

        this.loopQueue = false;
        this.loopSong = false;

        this.songs = [];
        this.addSong(this.songs, link);
        this.nowPlaying;

        this.connection = joinVoiceChannel({
            selfDeaf: false,
            selfMute: false,
            guildId: channel.guild.id,
            channelId: channel.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });
        this.player = createAudioPlayer();
        this.player.on('error', error => {
            console.error(error);
        });

        this.connection.subscribe(this.player);
        this.playNextSong();
        this.player.on(AudioPlayerStatus.Idle, () => { this.playNextSong() })
    }

    playNextSong() {
        if (this.loopSong) {
            this.play();
            return;
        }
        if (this.songs.length == 0) {
            this.leave();
            return;
        }
        if (this.loopQueue) {
            this.songs.push(this.nowPlaying);
        }
        this.nowPlaying = this.songs.shift();
        this.play();
    }

    async play() {
        let stream = await ytdl(this.nowPlaying.link);
        this.player.play(stream);
    }

    addSong(arr, link) {
        arr.push({ link: link });
        let s = arr[arr.length - 1];
        getYoutubeTitle(link.replace('https://www.youtube.com/watch?v=', ''), function (err, title) {
            s.title = title;
        });
    }

    leave() {
        this.connection.destroy();
        delete queues[this.guildID];
    }
}

//#region playlist
//#region mongo
mongo.connect(
    mongoLink,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
);

const playlistSchema = new mongo.Schema({
    songs: [String]
});
const playlistModel = new mongo.model('playlist', playlistSchema);

const guildSchema = new mongo.Schema({
    _id: String,
    playlists: [{
        name: String
    }]
});
const guildModel = new mongo.model('guild', guildSchema);
//#endregion

async function createPlaylist(interaction) {
    //get the database of the guild;
    let guild = await dbGetGuild(interaction.guildId);

    //if there isn't any playlist with this name create one 
    if (!guild.playlists.some(x => x.name == interaction.options.getString('name'))) {
        let newplaylist = await playlistModel.create({
            songs: []
        });
        await guildModel.findByIdAndUpdate(
            interaction.guildId,
            {
                $push: {
                    playlists: {
                        name: interaction.options.getString('name'),
                        _id: newplaylist._id
                    }
                }
            });
        interaction.reply(`created playlist with name: ${interaction.options.getString('name')}`);
    } else {
        interaction.reply('a playlist with this name already exists');
    }
}

async function removePlaylist(interaction) {
    //get the database of the guild;
    let guild = await dbGetGuild(interaction.guildId);

    //if there is a playlist with this name remove it
    if (guild.playlists.some(x => x.name == interaction.options.getString('name'))) {
        let guild = await guildModel.findByIdAndUpdate(
            interaction.guildId,
            { $pull: { playlists: { name: interaction.options.getString('name') } } }
        );
        interaction.reply(`removed playlist named: ${interaction.options.getString('name')}`)
    } else {
        interaction.reply('there is no playlist with this name');
    }
}

async function getPlaylistID(interaction) {
    //get the database of the guild;
    let guild = await dbGetGuild(interaction.guildId);

    //if there is a playlist with this name write it's id
    if (guild.playlists.some(x => x.name == interaction.options.getString('name'))) {
        interaction.reply(guild.playlists.filter(x => x.name == interaction.options.getString('name'))[0]._id.toString())
    } else {
        interaction.reply('there is no playlist with this name');
    }
}

async function addToPlaylist(interaction) {
    //cut unnecessary things from link
    let link = interaction.options.getString('link');
    if (link.includes('&')) {
        link = link.split('&')[0];
    }

    //get the database of the guild;
    let guild = await dbGetGuild(interaction.guildId);

    //if there is a playlist with this name add the link to it
    if (guild.playlists.some(x => x.name == interaction.options.getString('name'))) {
        let playlist = await playlistModel.findByIdAndUpdate(
            guild.playlists.filter(x => x.name == interaction.options.getString('name'))[0]._id,
            { $push: { songs: link, } }
        )
        interaction.reply(`added ${link} to playlist: ${interaction.options.getString('name')}`);
    } else {
        interaction.reply('there is no playlist with this name');
    }
}

async function songsInPlaylist(interaction) {
    //get the database of the guild;
    let guild = await dbGetGuild(interaction.guildId);

    //if there is a playlist with this name create an embed that lists the songs in it
    if (guild.playlists.some(x => x.name == interaction.options.getString('name'))) {
        let playlist = await playlistModel.findById(guild.playlists.filter(x => x.name == interaction.options.getString('name'))[0]._id)
        let q = playlist.songs;

        let embed = {
            color: 0xff0000,
            title: `playlist: ${interaction.options.getString('name')}`,
            fields: []
        }

        for (let i = 0; i < q.length; i++) {
            const link = q[i];
            getYoutubeTitle(link.replace('https://www.youtube.com/watch?v=', ''), function (err, title) {
                if (err) { console.error(err) }

                let n = `${i}. song in the playlist`;

                let v = `[${title}](${link})`

                embed.fields[i] = {
                    name: n,
                    value: v
                };
            });
        }
        setTimeout(() => { interaction.reply({ embeds: [embed] }); }, 200)
    } else {
        interaction.reply('there is no playlist with this name');
    }
}

async function playPlaylist(interaction) {
    //if the author is in the right place
    if (!interaction.member.voice.channel) {
        interaction.reply('you are not in a voice channel');
        return;
    }
    if (queues[interaction.guildId] && interaction.member.voice.channel.id != queues[interaction.guildId].channelID) {
        interaction.reply('you are in a different voice channel');
        return;
    }

    //get the database of the guild;
    let guild = await dbGetGuild(interaction.guildId);

    //if there is a playlist with this name add every song in it to the queue
    if (guild.playlists.some(x => x.name == interaction.options.getString('name'))) {
        let playlist = await playlistModel.findByIdAndUpdate(guild.playlists.filter(x => x.name == interaction.options.getString('name'))[0]._id)
        let q = playlist.songs;

        if (!queues[interaction.guildId]) {
            queues[interaction.guildId] = new Queue(interaction.member.voice.channel, q.shift());
        }
        for (let i = 0; i < q.length; i++) {
            queues[interaction.guildId].addSong(queues[interaction.guildId].songs, q[i]);
        }
        interaction.reply('added songs to the queue')
    } else {
        interaction.reply('there is no playlist with this name');
    }
}

async function removeFormPlaylist(interaction) {
    //get the database of the guild;
    let guild = await dbGetGuild(interaction.guildId);

    //if there is a playlist with this name delete the song at the index
    if (guild.playlists.some(x => x.name == interaction.options.getString('name'))) {
        let playlist = await playlistModel.findById(guild.playlists.filter(x => x.name == interaction.options.getString('name'))[0]._id)
        let i = interaction.options.getInteger('index');
        if (i + 1 > playlist.songs.length || i < 0) {
            interaction.reply('the index you gave is not in the range');
            return;
        }
        let link = playlist.songs.splice(i, 1)[0];
        await playlistModel.findByIdAndUpdate(
            guild.playlists.filter(x => x.name == interaction.options.getString('name'))[0]._id,
            { $set: { songs: playlist.songs } }
        )
        interaction.reply(`removed ${link} from playlist: ${interaction.options.getString('name')}`);
    } else {
        interaction.reply('there is no playlist with this name');
    }

}

async function importPlaylist(interaction) {
    //get the database of the guild;
    let guild = await dbGetGuild(interaction.guildId);

    //if there isn't a playlist with this name delete the song at the index
    if (!guild.playlists.some(x => x.name == interaction.options.getString('name'))) {
        await guildModel.findByIdAndUpdate(
            interaction.guildId,
            {
                $push: {
                    playlists: {
                        name: interaction.options.getString('name'),
                        _id: interaction.options.getString('id')
                    }
                }
            });
        interaction.reply(`created playlist with name: ${interaction.options.getString('name')}`);
    } else {
        interaction.reply('a playlist with this name already exists');
    }
}

async function listPlaylists(interaction) {
    //get the database of the guild;
    let guild = await dbGetGuild(interaction.guildId);

    let playlists = guild.playlists;

    if (playlists.length == 0) {
        interaction.reply('there are no playlists in this guild');
        return;
    }

    let embed = {
        color: 0xff0000,
        title: 'playlists:',
        fields: []
    }

    for (let i = 0; i < playlists.length; i++) {
        embed.fields[i] = {
            name: playlists[i].name,
            value: playlists[i]._id.toString()
        };
    }
    interaction.reply({ embeds: [embed] });
}

async function replaceQueueWithPlaylist(interaction) {
    //if the author is in the right place
    if (!interaction.member.voice.channel) {
        interaction.reply('you are not in a voice channel');
        return;
    }
    if (queues[interaction.guildId] && interaction.member.voice.channel.id != queues[interaction.guildId].channelID) {
        interaction.reply('you are in a different voice channel');
        return;
    }

    //get the database of the guild;
    let guild = await dbGetGuild(interaction.guildId);

    //if there is a playlist with this name replace the queue with it
    if (guild.playlists.some(x => x.name == interaction.options.getString('name'))) {
        let playlist = await playlistModel.findByIdAndUpdate(guild.playlists.filter(x => x.name == interaction.options.getString('name'))[0]._id)
        let q = playlist.songs;

        if (!queues[interaction.guildId]) {
            queues[interaction.guildId] = new Queue(interaction.member.voice.channel, q.shift());
        } else {
            queues[interaction.guildId].songs = [];
            queues[interaction.guildId].loopSong = false;
            queues[interaction.guildId].loopQueue = false;
            queues[interaction.guildId].addSong(queues[interaction.guildId].songs, q.shift());
            queues[interaction.guildId].playNextSong();
        }
        for (let i = 0; i < q.length; i++) {
            queues[interaction.guildId].addSong(queues[interaction.guildId].songs, q[i]);
        }
        interaction.reply('replaced the queue with the playlist')
    } else {
        interaction.reply('there is no playlist with this name');
    }
}
//#endregion

//#region basic commands
function leave(interaction) {
    if (validate(interaction)) {
        queues[interaction.guildId].leave()
        interaction.reply('disconnected from voice channel');
    }
}

function toggleLoopQueue(interaction) {
    if (validate(interaction)) {
        queues[interaction.guildId].loopQueue = !queues[interaction.guildId].loopQueue;
        interaction.reply('loopqueue toggled');
    }
}

function toggleLoopSong(interaction) {
    if (validate(interaction)) {
        queues[interaction.guildId].loopSong = !queues[interaction.guildId].loopSong;
        interaction.reply('loopsong toggled');
    }
}

function remove(interaction, index) {
    if (validate(interaction)) {
        interaction.reply(`removed ${queues[interaction.guildId].songs.splice(index, 1)} frome the queue`);
    }
}

function skip(interaction) {
    if (validate(interaction)) {
        queues[interaction.guildId].playNextSong()
        interaction.reply('skiped one song');
    }
}

function add(interaction) {
    let link = interaction.options.getString('link');
    if (link.includes('&')) {
        link = link.split('&')[0];
    }

    if (!interaction.member.voice.channel) {
        interaction.reply('you are not in a voice channel');
        return;
    }
    if (queues[interaction.guildId] && interaction.member.voice.channel.id != queues[interaction.guildId].channelID) {
        interaction.reply('you are in a different voice channel');
        return;
    }
    if (!queues[interaction.guildId]) {
        queues[interaction.guildId] = new Queue(interaction.member.voice.channel, link);
    } else {
        queues[interaction.guildId].addSong(queues[interaction.guildId].songs, link);
    }
    interaction.reply(`added ${link} to queue`);
}

function queue(interaction) {
    if (queues[interaction.guildId]) {
        s = queues[interaction.guildId].songs;
        n = queues[interaction.guildId].nowPlaying;

        let embed = {
            color: 0xff0000,
            title: 'queue',
            fields: [{
                name: 'now playing',
                value: `[${n.title}](${n.link})`
            }],
            footer: {
                text: `loopqueue: ${queues[interaction.guildId].loopQueue} loopsong: ${queues[interaction.guildId].loopSong}`
            }
        }


        for (let i = 0; i < s.length; i++) {
            let name = `${i}. song in queue`;
            let value = `[${s[i].title}](${s[i].link})`

            embed.fields.push({
                name,
                value
            });
        }

        interaction.reply({ embeds: [embed] });
    } else {
        interaction.reply('there is no queue')
    }
}
//#endregion

module.exports = {
    add,
    remove,
    skip,
    leave,
    queue,
    toggleLoopQueue,
    toggleLoopSong,

    createPlaylist,
    removePlaylist,
    listPlaylists,

    addToPlaylist,
    removeFormPlaylist,

    songsInPlaylist,
    playPlaylist,
    replaceQueueWithPlaylist,

    getPlaylistID,
    importPlaylist,
}

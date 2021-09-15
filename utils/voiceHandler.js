const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');

let queues = Object();

class Queue {
    constructor(channel, link) {
        this.guildID = channel.guild.id;
        this.songs = [link];
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
        this.sub = this.connection.subscribe(this.player);
        this.playNextSong();
        this.player.on(AudioPlayerStatus.Idle, () => { this.playNextSong() })
    }

    addSong(link) {
        this.songs.push(link);
    }

    playNextSong() {
        if (this.songs.length == 0) {
            this.leave();
        } else {
            this.player.play(createAudioResource(ytdl(this.songs.shift(), { filter: 'audioonly'})));
        }
    }

    leave() {
        this.connection.destroy();
        delete queues[this.guildID];
    }
}


function leaveChannel(channel) {
    let guildID = channel.guild.id;
    if (queues[guildID]) {
        queues[guildID].leave()
    }
}

function addToQueue(link, channel) {
    let guildID = channel.guild.id;
    if (!queues[guildID]) {
        queues[guildID] = new Queue(channel, link);
    } else {
        queues[guildID].addSong(link);
    }
}

module.exports = {
    leaveChannel,
    addToQueue,
}
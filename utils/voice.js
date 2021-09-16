const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const mongo = require('mongoose');

let queues = Object();

class Queue {
    constructor(channel, link) {
        this.guildID = channel.guild.id;
        this.loopQueue = false;
        this.nextSongIndex = 0;
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
        if (this.nextSongIndex == this.songs.length) {
            if (!this.loopQueue) {
                this.leave();
            } else { 
                this.nextSongIndex = 0;
                this.playNextSong();
            }
        } else {
            this.player.play(createAudioResource(ytdl(this.songs[this.nextSongIndex], { filter: 'audioonly'})));
            this.nextSongIndex += 1;
        }
    }

    leave() {
        this.connection.destroy();
        delete queues[this.guildID];
    }
}


function leave(channel) {
    let guildID = channel.guild.id;
    if (queues[guildID]) {
        queues[guildID].leave()
    }
}

function add(channel, link) {
    let guildID = channel.guild.id;
    if (!queues[guildID]) {
        queues[guildID] = new Queue(channel, link);
    } else {
        queues[guildID].addSong(link);
    }
}

function skip(channel) {
    let guildID = channel.guild.id;
    if (queues[guildID]) {
        queues[guildID].playNextSong()
    }
}

function queue(channel) {
    let guildID = channel.guild.id;
    if (queues[guildID]) {
        result = queues[guildID].songs;
        result.push(queues[guildID].loopQueue);
        result.push(queues[guildID].nextSongIndex - 1);
        return result;
    }
}

function toggleLoopQueue(channel) {
    let guildID = channel.guild.id;
    if (queues[guildID]) {
        queues[guildID].loopQueue = !queues[guildID].loopQueue 
    }
}

function remove(channel, index) {
    let guildID = channel.guild.id;
    if (queues[guildID]) {
        return queues[guildID].songs.splice(index, 1);
    }
}

module.exports = {
    add,
    remove,
    skip,
    leave,
    queue,
    toggleLoopQueue,
}
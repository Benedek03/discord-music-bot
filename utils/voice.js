const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, demuxProbe } = require('@discordjs/voice');
const youtubedl = require('youtube-dl-exec');
const mongo = require('mongoose');
var getYoutubeTitle = require('get-youtube-title');


let queues = Object();

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

class Queue {
    constructor(channel, link) {
        this.guildID = channel.guild.id;
        this.channelID = channel.id;
        this.loopQueue = false;
        this.nextSongIndex = 0;
        this.songs = [link];
        this.songTitles = []
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
        this.addTitle(this.songTitles, link);
    }

    addSong(link) {
        this.songs.push(link);
        this.addTitle(this.songTitles, link);
    }

    addTitle(arr, link){
        getYoutubeTitle(link.replace('https://www.youtube.com/watch?v=', ''), function (err, title) {
            arr.push(title);
        });
    }

    async playNextSong() {
        if (this.nextSongIndex == this.songs.length) {
            if (!this.loopQueue) {
                this.leave();
            } else { 
                this.nextSongIndex = 0;
                this.playNextSong();
            }
        } else {
            let stream = await ytdl(this.songs[this.nextSongIndex]);
            this.player.play(stream);
            this.nextSongIndex += 1;
        }
    }

    leave() {
        this.connection.destroy();
        delete queues[this.guildID];
    }
}

function validate(interaction){
    if(!queues[interaction.guildId]){
        interaction.reply('i am not in a voice channel');
        return false;
    }
    if(!interaction.member.voice.channel){
        interaction.reply('you are not in a voice channel');
        return false;
    }
    if(interaction.member.voice.channel.id != queues[interaction.guildId].channelID){
        interaction.reply('you are in a different voice channel');
        return false;
    }
    return true;
}

function leave(interaction) {
    if (validate(interaction)) {
        queues[interaction.guildId].leave()
        interaction.reply('disconnected from voice channel');
    }
}

function toggleLoopQueue(interaction) {
    if (validate(interaction)) {
        queues[interaction.guildId].loopQueue = !queues[interaction.guildId].loopQueue
        interaction.reply('loopqueue toggled');
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

function add(interaction, link) {
    if(!interaction.member.voice.channel){
        interaction.reply('you are not in a voice channel');
        return;
    }
    if(queues[interaction.guildId] && interaction.member.voice.channel.id != queues[interaction.guildId].connection.channelId){
        interaction.reply('you are in a different voice channel');
        return;
    }
    if(!queues[interaction.guildId]){
        queues[interaction.guildId] = new Queue(interaction.member.voice.channel, link);
    } else {
        queues[interaction.guildId].addSong(link);
    }
    interaction.reply(`added ${link} to queue`);
}

function queue(interaction) {
    if (queues[interaction.guildId]) {
        sl = queues[interaction.guildId].songs;
        st = queues[interaction.guildId].songTitles;

        let embed = {
            color: 0xff0000,
            title: 'queue',
            fields: [],
            footer: {
                text: `loopqueue: ${queues[interaction.guildId].loopQueue}`
            }
        }

        for (let i = 0; i < sl.length; i++) {
            let name = `${i}. song`;
            if (i == queues[interaction.guildId].nextSongIndex - 1 ) { name += ' now playing'; }
            let value = `[${st[i]}](${sl[i]})`

            embed.fields.push({
                name,
                value
            });
        }
        interaction.reply({embeds: [embed]});
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

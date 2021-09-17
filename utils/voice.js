const { joinVoiceChannel, createAudioPlayer, createAudioResource, AudioPlayerStatus, demuxProbe } = require('@discordjs/voice');
const youtubedl = require('youtube-dl-exec');
const mongo = require('mongoose');
const getYoutubeTitle = require('get-youtube-title');
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
        if (this.loopSong){
            this.play();
            return;
        }
        if (this.songs.length == 0) {
            this.leave();
            return;
        }
        if (this.loopQueue){
            this.songs.push(this.nowPlaying);
            this.nowPlaying = this.songs.shift();
            this.play();
            return;
        }
        this.nowPlaying = this.songs.shift();
        this.play();
    }

    async play(){
        let stream = await ytdl(this.nowPlaying.link);
        this.player.play(stream);
    }

    addSong(arr, link){
        arr.push({link: link});
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

//#endregion

//#region commands

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

function add(interaction, link) {
    if(!interaction.member.voice.channel){
        interaction.reply('you are not in a voice channel');
        return;
    }
    if(queues[interaction.guildId] && interaction.member.voice.channel.id != queues[interaction.guildId].channelID) {
        interaction.reply('you are in a different voice channel');
        return;
    }
    if(!queues[interaction.guildId]){
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

        interaction.reply({embeds: [embed]});
    } else {
        interaction.reply('there is no queue')
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
//#endregion

module.exports = {
    add,
    remove,
    skip,
    leave,
    queue,
    toggleLoopQueue,
    toggleLoopSong,
}

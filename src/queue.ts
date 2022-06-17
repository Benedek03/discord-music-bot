import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, joinVoiceChannel, VoiceConnection, createAudioResource } from '@discordjs/voice';
import { StageChannel, VoiceChannel } from 'discord.js';
import { client, guildMap } from './index.js';
import { Song } from './song.js'
import ytdl from "ytdl-core";

export class Queue {
    public guildId: string;
    public channelId: string;
    public loopQueue = true;
    public loopSong = false;
    public songs: Song[] = [];
    public connection: VoiceConnection;
    public player: AudioPlayer;

    constructor(channel: VoiceChannel | StageChannel) {
        this.guildId = channel.guildId;
        this.channelId = channel.id;

        this.connection = joinVoiceChannel({
            selfDeaf: false,
            selfMute: false,
            guildId: channel.guild.id,
            channelId: channel.id,
            //@ts-ignore
            adapterCreator: channel.guild.voiceAdapterCreator
        });
        this.player = createAudioPlayer();
        this.player.on('error', error => {
            console.error(error);
        });
        this.connection.subscribe(this.player);
    }

    shift() {
        if (this.songs.length == 0) {
            this.leave();
            return;
        }
        let last = this.songs.shift() as Song;
        if (this.loopSong) {
            this.songs.unshift(last);
            return;
        }
        if (this.loopQueue) {
            this.songs.push(last);
            return;
        }
        if (this.songs.length == 0) {
            this.leave();
            return;
        }
    }

    async play() {
        this.player.play(createAudioResource(
            await ytdl(this.songs[0].url, {
                filter: 'audioonly',
                highWaterMark: 1 << 25,
                dlChunkSize: 0,
            })
        ));
    }

    async addSong(s: Song) {
        this.songs.push(s);
    }

    leave() {
        this.connection.destroy();
        guildMap.delete(this.guildId);
    }
}

export async function newQueue(channel: VoiceChannel | StageChannel, song: Song) {
    let q = new Queue(channel);
    guildMap.set(channel.guildId, q);
    await q.addSong(song);
    q.play();
    q.player.on(AudioPlayerStatus.Idle, () => {
        q.shift();
        if (guildMap.has(channel.guildId))
            q.play();
    })
    //disconnect if the voicechannel is empty 
    //checks once a minute
    let interval = setInterval(() => {
        if (!guildMap.has(q.guildId)){
            clearInterval(interval);
            return;
        }
        let vc = client.channels.cache.get(q.channelId) as VoiceChannel;
        if (vc.members.size < 2) {
            q.leave();
            clearInterval(interval);
        }
    }, 60000);
}

export function shuffle(array: Song[]) {
    let currentIndex = array.length, randomIndex;
    while (currentIndex != 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    return array;
}

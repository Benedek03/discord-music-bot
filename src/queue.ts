import { AudioPlayer, AudioPlayerStatus, createAudioPlayer, joinVoiceChannel, VoiceConnection } from '@discordjs/voice';
import { StageChannel, VoiceChannel } from 'discord.js';
import { createResource, createSong, Song } from './song'

export let queueMap = new Map<string, Queue>();

export async function createQueue(channel: VoiceChannel | StageChannel, song: Song) {
    let q = new Queue(channel);
    queueMap.set(channel.guildId, q);
    await q.addSong(song);
    q.play();
    q.player.on(AudioPlayerStatus.Idle, () => {
        q.shift();
        if (queueMap.has(channel.guildId))
            q.play();
    })
}

export class Queue {
    public guildId: string;
    public channelId: string;
    public loopQueue = false;
    public loopSong = false;
    public songs: Song[] = [];
    public connection: VoiceConnection;
    public player: AudioPlayer;

    constructor(channel: VoiceChannel | StageChannel) {
        this.guildId = channel.guildId;
        this.channelId = channel.id;
        this.loopQueue = false;
        this.loopSong = false;
        this.songs = [];

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
        this.player.play(await createResource(this.songs[0].url));
    }

    async addSong(s: Song) {
        this.songs.push(s);
    }

    leave() {
        this.connection.destroy();
        queueMap.delete(this.guildId);
    }
}
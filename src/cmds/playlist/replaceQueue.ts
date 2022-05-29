import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, } from 'discord.js';
import { Command } from '../../commad.js';
import { newQueue, Queue } from '../../queue.js';
import { guildMap } from '../../index.js';
import { Song } from '../../song.js';
import { getPlayistId, getSongs } from '../../db.js';

export default {
    data: new SlashCommandBuilder()
        .setName('replacequeue')
        .setDescription('replaces the queue with the playlist.')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('name of the playlist')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        if (!(interaction.member instanceof GuildMember)) return;
        if (!interaction.member.voice.channel) {
            interaction.reply('> you have to be in a voice channel to use this command!')
            return;
        }
        if (guildMap.has(guildId) && interaction.member.voice.channelId != guildMap.get(guildId)?.channelId) {
            interaction.reply('> you have to be in the same voice channel with me to use this command!')
            return;
        }
        const name = interaction.options.getString('name') as string;
        const playlistId = await getPlayistId(guildId, name);
        if (!playlistId) {
            interaction.reply('> no playlist with this name ');
            return;
        }
        let songs = await getSongs(playlistId) as Song[];

        if (!guildMap.has(guildId)) {
            newQueue(interaction.member.voice.channel, songs.shift() as Song)
        }
        const q = guildMap.get(guildId) as Queue;
        q.songs.splice(1)
        for (const song of songs) {
            q.addSong(song);
        }
        q.songs.shift();
        q.play();
        interaction.reply('> done');
    }
} as Command;

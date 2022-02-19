import { Command } from '../../commad.js';
import { CommandInteraction, GuildMember, } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { createQueue, queueMap } from '../../queue.js';
import { Song } from '../../song.js';
import { createGuild, getPlayistId, getSongs } from '../../db.js';

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Plays the playlist.')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('name of the playlist')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        await createGuild(guildId)
        if (!(interaction.member instanceof GuildMember)) return;
        if (!interaction.member.voice.channel) {
            interaction.reply('you have to be in a voice channel to use this command!')
            return;
        }
        if (queueMap.has(guildId) && interaction.member.voice.channelId != queueMap.get(guildId)?.channelId) {
            interaction.reply('you have to be in the same voice channel with me to use this command!')
            return;
        }
        const name = interaction.options.getString('name') as string;
        const playlistId = await getPlayistId(guildId, name);
        if (!playlistId) {
            interaction.reply('no playlist with this name ');
            return;
        }
        let songs = await getSongs(playlistId) as Song[];

        if (!queueMap.has(guildId)) {
            createQueue(interaction.member.voice.channel, songs.shift() as Song)
        }
        for (const song of songs) {
            queueMap.get(guildId)?.addSong(song);
        }
        interaction.reply('done');
    }
} as Command;
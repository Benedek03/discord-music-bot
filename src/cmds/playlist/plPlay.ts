import { Command } from '../../commad.js';
import { CommandInteraction, GuildMember, } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { plCreate, plGetSongs } from "../../database/playlist.js";
import { gGetPlId, gLinkPl, gNameExists } from '../../database/guild.js';
import { createQueue, queueMap } from '../../queue.js';
import { Song } from '../../song.js';

export default {
    data: new SlashCommandBuilder()
        .setName('plplay')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        if (!(interaction.member instanceof GuildMember)) return;
        if (!interaction.member.voice.channel) {
            interaction.reply('you have to be in a voice channel to use this command!')
            return;
        }
        if (queueMap.has(interaction.guildId) && interaction.member.voice.channelId != queueMap.get(interaction.guildId)?.channelId) {
            interaction.reply('you have to be in the same voice channel with me to use this command!')
            return;
        }
        const name = interaction.options.getString('name') as string;
        const playlistId = await gGetPlId(interaction.guildId, name);
        if (!playlistId) {
            interaction.reply('no playlist with this name ');
            return;
        }
        let songs = await plGetSongs(playlistId) as Song[];

        if (!queueMap.has(interaction.guildId)) {
            createQueue(interaction.member.voice.channel, songs.shift() as Song)
        }
        for (const song of songs) {
            queueMap.get(interaction.guildId)?.addSong(song);
        }
        interaction.reply('done');
    }
} as Command;
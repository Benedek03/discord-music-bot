import { Command } from '../commad.js';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import ytsr, { Video } from 'ytsr';
import { createQueue, queueMap } from '../queue.js';
import { createSong } from '../song.js';

export default {
    data: new SlashCommandBuilder()
        .setName('playsearch')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('str')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        await interaction.reply('working on it');
        if (!(interaction.member instanceof GuildMember)) return;
        if (!interaction.member.voice.channel) {
            interaction.editReply('you have to be in a voice channel to use this command!')
            return;
        }
        if (queueMap.has(interaction.guildId) && interaction.member.voice.channelId != queueMap.get(interaction.guildId)?.channelId) {
            interaction.editReply('you have to be in the same voice channel with me to use this command!')
            return;
        }

        const str = interaction.options.getString('str') as string;
        const query = (await ytsr.getFilters(str)).get('Type')?.get('Video')?.url as string;
        const searchResult = (await ytsr(query, { limit: 1 })).items[0] as Video;
        const url = searchResult.url;

        let song = await createSong(url)
        if (!song) {
            interaction.editReply('cant play this');
            return;
        }
        if (queueMap.has(interaction.guildId)) {
            queueMap.get(interaction.guildId)?.addSong(song);
        } else {
            createQueue(interaction.member.voice.channel, song)
        }
        interaction.editReply(`added ${song.url} to queue`)
    }
} as Command;
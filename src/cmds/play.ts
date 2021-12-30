import { Command } from '../commad.js';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { createQueue, queueMap } from '../queue.js';
import { createSong } from '../song.js';

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('str')
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

        let url = interaction.options.getString('str') as string;
        let song = await createSong(url)
        if (!song) {
            interaction.reply('cant play this');
            return;
        }
        if (queueMap.has(interaction.guildId)) {
            queueMap.get(interaction.guildId)?.addSong(song);
        } else {
            createQueue(interaction.member.voice.channel, song)
        }
        interaction.reply(`added ${song.url} to queue`)
    }
} as Command;
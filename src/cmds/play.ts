import { Command } from '../commad.js';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { createQueue, queueMap } from '../queue.js';
import { createSong } from '../song.js';

export default {
    data: new SlashCommandBuilder()
        .setName('p')
        .setDescription('Plays the audio of of the YouTube video. This command only works with YouTube URLs.')
        .addStringOption(o =>
            o.setName('url')
                .setDescription('url of the Youtube video')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        if (!(interaction.member instanceof GuildMember)) return;
        if (!interaction.member.voice.channel) {
            interaction.reply('you have to be in a voice channel to use this command!')
            return;
        }
        if (queueMap.has(guildId) && interaction.member.voice.channelId != queueMap.get(guildId)?.channelId) {
            interaction.reply('you have to be in the same voice channel with me to use this command!')
            return;
        }

        let url = interaction.options.getString('url') as string;
        let song = await createSong(url)
        if (!song) {
            interaction.reply('cant play this');
            return;
        }
        if (queueMap.has(guildId)) {
            queueMap.get(guildId)?.addSong(song);
        } else {
            createQueue(interaction.member.voice.channel, song)
        }
        interaction.reply(`added ${song.url} to queue`)
    }
} as Command;
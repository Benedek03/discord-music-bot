import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import ytdl from 'ytdl-core';
import { Command } from '../command.js';
import { newQueue } from '../queue.js';
import { guildMap } from '../index.js';
import { constructSong } from '../song.js';
import { ytSearch } from '../yt.js';

export default {
    data: new SlashCommandBuilder()
        .setName('p')
        .setDescription('plays the audio of a YouTube video.')
        .addStringOption(o =>
            o.setName('video')
                .setDescription('search something or give the url or id of the Youtube video.')
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
        interaction.reply('> working on it')

        let url;
        let str = interaction.options.getString('video') as string;
        if (ytdl.validateURL(str)) {
            url = str;
        } else if (ytdl.validateID(str)) {
            url = 'https://www.youtube.com/watch?v=' + str;
        } else {
            url = (await ytSearch(str, 1))[0].url;
        }

        let song = await constructSong(url)
        if (!song) {
            interaction.editReply('> cant play this');
            return;
        }
        if (guildMap.has(guildId)) {
            guildMap.get(guildId)?.addSong(song);
        } else {
            newQueue(interaction.member.voice.channel, song)
        }
        interaction.editReply(`> added ${song.url} to queue`)
    }
} as Command;

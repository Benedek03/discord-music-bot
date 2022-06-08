import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from '../../command.js';
import { constructSong } from '../../song.js';
import { addSong, createGuild, getPlayistId } from '../../db.js';
import { ytSearch } from '../../yt.js';
import ytdl from 'ytdl-core';

export default {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('adds the song to the playlist.')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('name of the playlist')
                .setRequired(true)
        ).addStringOption(o =>
            o.setName('video')
                .setDescription('search something or give the url or id of the Youtube video.')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        interaction.reply('> working on it')
        await createGuild(guildId);
        let name = interaction.options.getString('name') as string;
        let url;
        let str = interaction.options.getString('video') as string;
        if (ytdl.validateURL(str)) {
            url = str;
        } else if (ytdl.validateID(str)) {
            url = 'https://www.youtube.com/watch?v=' + str;
        } else {
            url = (await ytSearch(str, 1))[0].url;
        }

        let id = await getPlayistId(guildId, name);
        if (!id) {
            interaction.editReply('no playlist with this name')
            return;
        }
        let song = await constructSong(url)
        if (!song) {
            interaction.editReply('cant play this');
            return;
        }
        await addSong(id, song);
        interaction.editReply(`added ${song.url} to ${name}`)
    }
} as Command;

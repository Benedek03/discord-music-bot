import { Command } from '../../commad.js';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { createSong } from '../../song.js';
import { addSong, createGuild, getPlayistId } from '../../db.js';

export default {
    data: new SlashCommandBuilder()
        .setName('add')
        .setDescription('Adds the song to the playlist. Only works with YouTube URLs.')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('name of the playlist')
                .setRequired(true)
        ).addStringOption(o =>
            o.setName('url')
                .setDescription('url of the Youtube video')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        await createGuild(guildId);
        let name = interaction.options.getString('name') as string;
        let url = interaction.options.getString('url') as string;
        let id = await getPlayistId(guildId, name);
        if (!id) {
            interaction.reply('no playlist with this name')
            return;
        }
        let song = await createSong(url)
        if (!song) {
            interaction.reply('cant play this');
            return;
        }
        await addSong(id, song);
        interaction.reply(`added ${song.url} to ${name}`)
    }
} as Command;
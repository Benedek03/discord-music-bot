import { Command } from '../../commad.js';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { createSong } from '../../song.js';
import { gGetPlId } from '../../database/guild.js';
import { plAddSong } from '../../database/playlist.js';

export default {
    data: new SlashCommandBuilder()
        .setName('pladd')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('asdfg')
                .setRequired(true)
        ).addStringOption(o =>
            o.setName('url')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        let name = interaction.options.getString('name') as string;
        let url = interaction.options.getString('url') as string;
        let id = await gGetPlId(interaction.guildId, name);
        if (!id) {
            interaction.reply('no playlist with this name')
            return;
        }
        let song = await createSong(url)
        if (!song) {
            interaction.reply('cant play this');
            return;
        }
        await plAddSong(id, song);
        interaction.reply(`added ${song.url} to ${name}`)
    }
} as Command;
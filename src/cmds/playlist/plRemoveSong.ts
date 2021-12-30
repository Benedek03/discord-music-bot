import { Command } from '../../commad.js';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { createSong } from '../../song.js';
import { gGetPlId } from '../../database/guild.js';
import { plAddSong, plRemoveSong } from '../../database/playlist.js';

export default {
    data: new SlashCommandBuilder()
        .setName('plremovesong')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('asdfg')
                .setRequired(true)
        ).addIntegerOption(o =>
            o.setName('index')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        let name = interaction.options.getString('name') as string;
        let index = interaction.options.getInteger('index') as number;
        let id = await gGetPlId(interaction.guildId, name);
        if (!id) {
            interaction.reply('no playlist with this name')
            return;
        }
        if (await plRemoveSong(id, index))
            interaction.reply('yuppie');
        else
            interaction.reply('index out of bounds');
    }
} as Command;
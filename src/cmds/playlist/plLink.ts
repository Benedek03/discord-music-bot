import { Command } from '../../commad';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { plExists } from '../../database/playlist';
import { gLinkPl } from '../../database/guild';

export default {
    data: new SlashCommandBuilder()
        .setName('pllink')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('id')
                .setDescription('asdfg')
                .setRequired(true)
        ).addStringOption(o =>
            o.setName('name')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        let playlistId = interaction.options.getString('id') as string;
        let name = interaction.options.getString('name') as string;
        if (!await plExists(playlistId)) {
            interaction.reply('this id doesnt exists');
            return;
        }
        if (await gLinkPl(interaction.guildId, playlistId, name))
            interaction.reply(`new playlist created (name: ${name}, id: ${playlistId})`);
        else
            interaction.reply('a playlist with this name already exists');
    }
} as Command;
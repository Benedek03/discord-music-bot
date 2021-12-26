import { Command } from '../../commad';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { createPlaylist, getPlaylistId, getSongs, linkPlaylist } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('createplaylist')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('str')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        let str = interaction.options.getString('str') as string;
        let id = await createPlaylist();
        if (await linkPlaylist(interaction.guildId, id, str))
            interaction.reply(`new playlist created (name: ${str}, id: ${id})`)
        else
            interaction.reply('a playlist with this name already exists');
    }
} as Command;
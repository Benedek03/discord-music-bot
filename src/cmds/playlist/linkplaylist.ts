import { Command } from '../../commad';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { createPlaylist, getPlaylistId, getSongs, linkPlaylist } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('linkplaylist')
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
        let id = interaction.options.getString('id') as string;
        let name = interaction.options.getString('name') as string;
        let songs = await getSongs(id);
        if (songs)
            if (await linkPlaylist(interaction.guildId, id, name))
                interaction.reply(`new playlist created (name: ${name}, id: ${id})`);
            else
                interaction.reply('a playlist with this name already exists');
        else
            interaction.reply('this id doesnt exists');
    }
} as Command;
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { Command } from '../../commad.js';
import { createGuild, linkPlaylist, playlistExists } from '../../db.js';

export default {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Links a playlist with the given name.')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('name of the playlist')
                .setRequired(true)
        ).addStringOption(o =>
            o.setName('id')
                .setDescription('id of the playlist')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        await createGuild(guildId);
        let playlistId = interaction.options.getString('id') as string;
        let name = interaction.options.getString('name') as string;
        if (!await playlistExists(playlistId)) {
            interaction.reply('this id doesnt exists');
            return;
        }
        if (await linkPlaylist(guildId, playlistId, name))
            interaction.reply(`new playlist created (name: ${name}, id: ${playlistId})`);
        else
            interaction.reply('a playlist with this name already exists');
    }
} as Command;
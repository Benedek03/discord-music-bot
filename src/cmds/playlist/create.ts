import { Command } from '../../commad';
import { CommandInteraction, } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { createGuild, createPlaylist, linkPlaylist, nameExists } from '../../db.js';

export default {
    data: new SlashCommandBuilder()
        .setName('create')
        .setDescription('Creates a playlist with the given name.')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('name of the playlist')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        await createGuild(guildId);
        const name = interaction.options.getString('name') as string;
        if (await nameExists(guildId, name)) {
            interaction.reply('a playlist with this name already exists');
            return;
        }
        const playlistId = await createPlaylist();
        await linkPlaylist(guildId, playlistId, name);
        interaction.reply(`new playlist created (name: ${name}, id: ${playlistId})`);
    }
} as Command;
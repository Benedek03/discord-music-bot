import { Command } from '../../commad.js';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { createGuild, getPlaylists } from '../../db.js';

export default {
    data: new SlashCommandBuilder()
        .setName('playlists')
        .setDescription('Lists all of the playlists in this server.')
        .toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        await createGuild(guildId)
        let playlists = await getPlaylists(guildId);
        let embed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Playlists:')
        for (let i = 0; i < playlists.length; i++) {
            embed.addField(playlists[i].name, playlists[i].playlistId.toString());
        }
        interaction.reply({ embeds: [embed] });
    }
} as Command;
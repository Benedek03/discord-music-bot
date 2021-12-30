import { Command } from '../../commad.js';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { gGetPlaylists } from '../../database/guild.js';

export default {
    data: new SlashCommandBuilder()
        .setName('plget')
        .setDescription('asdgfgfdashgdsfhsdf')
        .toJSON(),
    async execute(interaction: CommandInteraction) {
        let playlists = await gGetPlaylists(interaction.guildId);
        let embed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Playlists:')
        for (let i = 0; i < playlists.length; i++) {
            embed.addField(playlists[i].name, playlists[i].playlistId.toString());
        }
        interaction.reply({ embeds: [embed] });
    }
} as Command;
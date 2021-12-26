import { Command } from '../../commad';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Queue, queueMap } from '../../queue';
import { getPlaylists } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('getplaylists')
        .setDescription('asdgfgfdashgdsfhsdf')
        .toJSON(),
    async execute(interaction: CommandInteraction) {
        let asd = await getPlaylists(interaction.guildId);
        let embed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Playlist:')
        for (let i = 0; i < asd.length; i++) {
            embed.addField(asd[i].name, asd[i].playlistId.toString());
        }
        interaction.reply({ embeds: [embed] });
    }
} as Command;
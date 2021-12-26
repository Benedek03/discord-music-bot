import { Command } from '../../commad';
import { Song } from '../../song';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { gGetPlId } from '../../database/guild';
import { plGetSongs } from '../../database/playlist';

export default {
    data: new SlashCommandBuilder()
        .setName('plgetsongs')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('str')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        let str = interaction.options.getString('str') as string;
        let id = await gGetPlId(interaction.guildId, str);
        if (!id) {
            interaction.reply('no playlist with this name');
            return;
        }

        let songs = await plGetSongs(id) as Song[];
        let embed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle(`${str}:`);
        for (let i = 0; i < songs.length; i++) {
            embed.addField(`${i}. in playlist:`, `[${songs[i].title}](${songs[i].url})`);
        }
        interaction.reply({ embeds: [embed] });
    }
} as Command;
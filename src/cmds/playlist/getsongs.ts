import { Command } from '../../commad';
import { Song } from '../../song';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getPlaylistId, getSongs } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('getsongs')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('str')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        let str = interaction.options.getString('str') as string;
        let id = await getPlaylistId(interaction.guildId, str);
        if (id) {
            let songs = await getSongs(id) as Song[];
            let embed = new MessageEmbed()
                .setColor(0xff0000)
                .setTitle(`${str}:`)
            for (let i = 0; i < songs.length; i++) {
                embed.addField(`${i}. in playlist:`, `[${songs[i].title}](${songs[i].url})`);
            }

            interaction.reply({ embeds: [embed] });
        }
        else
            interaction.reply('no playlist with this name');
    }
} as Command;
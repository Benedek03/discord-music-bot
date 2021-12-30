import { Command } from '../../commad.js';
import { Song } from '../../song.js';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { gGetPlId } from '../../database/guild.js';
import { plGetSongs } from '../../database/playlist.js';

export default {
    data: new SlashCommandBuilder()
        .setName('plgetsongs')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        let name = interaction.options.getString('name') as string;
        let id = await gGetPlId(interaction.guildId, name);
        if (!id) {
            interaction.reply('no playlist with this name');
            return;
        }

        let songs = await plGetSongs(id) as Song[];
        let embed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle(`${name}:`);
        for (let i = 0; i < songs.length; i++) {
            embed.addField(`${i}. in playlist:`, `[${songs[i].title}](${songs[i].url})`);
        }
        interaction.reply({ embeds: [embed] });
    }
} as Command;
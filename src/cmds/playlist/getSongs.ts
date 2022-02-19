import { Command } from '../../commad.js';
import { Song } from '../../song.js';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { createGuild, getPlayistId, getSongs } from '../../db.js';

export default {
    data: new SlashCommandBuilder()
        .setName('songs')
        .setDescription('Lists all of the songs in the playlist.')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('name of the playlist')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        await createGuild(guildId);
        let name = interaction.options.getString('name') as string;
        let id = await getPlayistId(guildId, name);
        if (!id) {
            interaction.reply('no playlist with this name');
            return;
        }

        let songs = await getSongs(id) as Song[];
        let embed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle(`${name}:`);
        for (let i = 0; i < songs.length; i++) {
            embed.addField(`${i}. in playlist:`, `[${songs[i].title}](${songs[i].url})`);
        }
        interaction.reply({ embeds: [embed] });
    }
} as Command;
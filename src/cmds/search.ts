import { Command } from '../commad';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import ytsr, { Video } from 'ytsr';

export default {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('str')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        await interaction.reply('working on it');
        const str = interaction.options.getString('str') as string;
        const query = (await ytsr.getFilters(str)).get('Type')?.get('Video')?.url as string;
        const searchResults = (await ytsr(query, { limit: 5 })).items;
        let reply = "top 5 results:\n";
        for (let i = 0; i < searchResults.length; i++) {
            const e = searchResults[i] as Video;
            reply += `${i + 1}: ${e.url}\n`;
        }
        interaction.editReply(reply)
    }
} as Command;
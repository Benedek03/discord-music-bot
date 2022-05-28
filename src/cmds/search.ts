import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from '../commad.js';
import { ytSearch } from '../yt.js';

export default {
    data: new SlashCommandBuilder()
        .setName('sr')
        .setDescription('Lists top 5 videos found on YouTube.')
        .addStringOption(o =>
            o.setName('searchterm')
                .setDescription('Search something')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        await interaction.reply('working on it');
        const searchResults = await ytSearch(interaction.options.getString('searchterm') as string, 5)
        let reply = "top 5 results:\n";
        for (let i = 0; i < searchResults.length; i++) {
            reply += `${i + 1}: ${searchResults[i].url}\n`;
        }
        interaction.editReply(reply)
    }
} as Command;
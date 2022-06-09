import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from '../command.js';
import { ytSearch } from '../yt.js';

export default {
    data: new SlashCommandBuilder()
        .setName('sr')
        .setDescription('lists top 5 search results on YouTube.')
        .addStringOption(o =>
            o.setName('searchterm')
                .setDescription('search something!')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        await interaction.reply('> working on it');
        const searchResults = await ytSearch(interaction.options.getString('searchterm') as string, 5)
        let reply = "> top 5 results:\n";
        for (let i = 0; i < searchResults.length; i++) {
            reply += `> ${i + 1}: ${searchResults[i].url}\n`;
        }
        interaction.editReply(reply)
    }
} as Command;

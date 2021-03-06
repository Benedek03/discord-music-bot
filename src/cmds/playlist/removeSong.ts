import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from '../../command.js';
import { getPlayistId, removeSong } from '../../db.js';

export default {
    data: new SlashCommandBuilder()
        .setName('removesong')
        .setDescription('removes the nth song from the playlist.')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('name of the playlist')
                .setRequired(true)
        ).addIntegerOption(o =>
            o.setName('n')
                .setDescription('which song do you want to remove?')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        let name = interaction.options.getString('name') as string;
        let index = interaction.options.getInteger('index') as number;
        let id = await getPlayistId(guildId, name);
        if (!id) {
            interaction.reply('> no playlist with this name')
            return;
        }
        if (await removeSong(id, index))
            interaction.reply('> done');
        else
            interaction.reply('> n out of bounds');
    }
} as Command;

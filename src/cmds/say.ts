import { Command } from '../commad';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('sadf')
        .addStringOption(o =>
            o.setName('str')
                .setDescription('asdfg')
                .setRequired(true)
        )
        .toJSON(),
    async execute(interaction: CommandInteraction) {
        interaction.reply(interaction.options.getString('str') as string);
    }
} as Command;
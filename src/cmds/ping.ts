import { Command } from '../commad';
import { CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

export default {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('asdgfgfdashgdsfhsdf')
        .toJSON(),
    async execute(interaction: CommandInteraction) {
        interaction.reply('pong');
    }
} as Command;
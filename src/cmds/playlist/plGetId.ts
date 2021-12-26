import { Command } from '../../commad';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { gGetPlId } from '../../database/guild';

export default {
    data: new SlashCommandBuilder()
        .setName('plgetid')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        let name = interaction.options.getString('name') as string;
        let id = await gGetPlId(interaction.guildId, name);
        if (id)
            interaction.reply(id);
        else
            interaction.reply('no playlist with this name');
    }
} as Command;
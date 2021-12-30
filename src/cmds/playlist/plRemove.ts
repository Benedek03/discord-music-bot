import { Command } from '../../commad.js';
import { CommandInteraction, Intents } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { gGetPlId, gNameExists, gRemovePl } from '../../database/guild.js';

export default {
    data: new SlashCommandBuilder()
        .setName('plremove')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        let name = interaction.options.getString('name') as string;
        if (!await gNameExists(interaction.guildId, name)) {
            interaction.reply('no playllist with this name');
            return;
        }
        if(await gRemovePl(interaction.guildId, name))
        interaction.reply(`playlist "${name}" was removed`);
    }
} as Command;
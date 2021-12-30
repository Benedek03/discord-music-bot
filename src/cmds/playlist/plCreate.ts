import { Command } from '../../commad';
import { CommandInteraction, } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { plCreate } from "../../database/playlist.js";
import { gLinkPl, gNameExists } from '../../database/guild.js';

export default {
    data: new SlashCommandBuilder()
        .setName('plcreate')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        const name = interaction.options.getString('name') as string;
        if (await gNameExists(interaction.guildId, name)) {
            interaction.reply('a playlist with this name already exists');
            return;
        }
        const playlistId = await plCreate();
        await gLinkPl(interaction.guildId, playlistId, name);
        interaction.reply(`new playlist created (name: ${name}, id: ${playlistId})`);
    }
} as Command;
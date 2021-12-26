import { Command } from '../../commad';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { getPlaylistId } from '../../database';

export default {
    data: new SlashCommandBuilder()
        .setName('getplaylistid')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('str')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        let str = interaction.options.getString('str') as string;
        let id = await getPlaylistId(interaction.guildId, str);
        if (id)
            interaction.reply(id);
        else
            interaction.reply('no playlist with this name');
    }
} as Command;
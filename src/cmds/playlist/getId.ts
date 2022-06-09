import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { Command } from '../../command.js';
import { createGuild, getPlayistId } from '../../db.js';

export default {
    data: new SlashCommandBuilder()
        .setName('getid')
        .setDescription('gives the id of a playlist.')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('name of the playlist')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        await createGuild(guildId);
        let name = interaction.options.getString('name') as string;
        let id = await getPlayistId(guildId, name);
        if (id)
            interaction.reply(id);
        else
            interaction.reply('no playlist with this name');
    }
} as Command;

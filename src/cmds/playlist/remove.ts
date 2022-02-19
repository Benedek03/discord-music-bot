import { Command } from '../../commad.js';
import { CommandInteraction, Intents } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { nameExists, removePlaylist } from '../../db.js';

export default {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Removes the playlist from the server.')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('name of the playlist')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        let name = interaction.options.getString('name') as string;
        if (!await nameExists(guildId, name)) {
            interaction.reply('no playllist with this name');
            return;
        }
        if(await removePlaylist(guildId, name))
        interaction.reply(`playlist "${name}" was removed`);
    }
} as Command;
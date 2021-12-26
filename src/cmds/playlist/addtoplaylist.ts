import { Command } from '../../commad';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { createQueue, queueMap } from '../../queue';
import { createSong } from '../../song';
import { getPlaylistId, pushSong } from '../../database';
import { guildId } from '../../test';

export default {
    data: new SlashCommandBuilder()
        .setName('addtoplaylist')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('name')
                .setDescription('asdfg')
                .setRequired(true)
        ).addStringOption(o =>
            o.setName('url')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        let url = interaction.options.getString('url') as string;
        let name = interaction.options.getString('name') as string;
        let song = await createSong(url)
        if (!song) {
            interaction.reply('cant play this');
            return;
        }
        let id = await getPlaylistId(interaction.guildId, name);
        if (id) {
            await pushSong(id, song);
            interaction.reply(`added ${song.url} to ${name}`)
        }
        else {
            interaction.reply('no playlist with this name')
        }
    }
} as Command;
import { Command } from '../commad';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { createQueue, queueMap } from '../queue';

export default {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('str')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        //TODO
        if (!(interaction.member instanceof GuildMember && interaction.member.voice.channel)) return;

        let url = interaction.options.getString('str') as string;
        if (queueMap.has(interaction.guildId)) {
            queueMap.get(interaction.guildId)?.addSong(url);
        } else {
            createQueue(interaction.member.voice.channel, url)
        }
    }
} as Command;
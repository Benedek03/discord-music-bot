import { Command } from '../commad';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Queue, queueMap } from '../queue';

export default {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addIntegerOption(o =>
            o.setName('int')
                .setDescription('asdfg')
                .setRequired(false)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        if (!(interaction.member instanceof GuildMember)) return;
        if (!interaction.member.voice.channel) {
            interaction.reply('you have to be in a voice channel to use this command!')
            return;
        }
        if (queueMap.has(interaction.guildId) && interaction.member.voice.channelId != queueMap.get(interaction.guildId)?.channelId) {
            interaction.reply('you have to be in the same voice channel with me to use this command!')
            return;
        }
        if (!queueMap.has(interaction.guildId)) {
            interaction.reply('there is no queue in this guild');
            return;
        }
        let q = queueMap.get(interaction.guildId) as Queue;

        let int = interaction.options.getInteger('int');
        if (!int)
            int = 1;
        if (int < 1) {
            interaction.reply('arg have to be at least 1');
            return;
        }
        for (let i = 0; i < int; i++) {
            q.shift();
        }
        q.play();
        interaction.reply(`skipped ${int} songs`);
    }
} as Command;
import { Command } from '../commad';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Queue, queueMap } from '../queue';

export default {
    data: new SlashCommandBuilder()
        .setName('loopqueue')
        .setDescription('asdgfgfdashgdsfhsdf')
        .toJSON(),
    async execute(interaction: CommandInteraction) {
        if (!(interaction.member instanceof GuildMember)) return;
        if (!interaction.member.voice.channel) {
            interaction.reply('you have to be in a voice channel to use this command!')
            return;
        }
        if (queueMap.has(interaction.guildId) && interaction.member.voice.channelId !=queueMap.get(interaction.guildId)?.channelId) {
            interaction.reply('you have to be in the same voice channel with me to use this command!')
            return;
        }
        if (!queueMap.has(interaction.guildId)) {
            interaction.reply('there is no queue in this guild');
            return;
        }
        let q = queueMap.get(interaction.guildId) as Queue;
        
        q.loopQueue = !q.loopQueue;
        interaction.reply(`loopqueue is set to ${q.loopQueue}`)
    }
} as Command;
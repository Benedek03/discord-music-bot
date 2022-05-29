import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { Command } from '../commad.js';
import { Queue } from '../queue.js';
import { guildMap } from '../index.js';

export default {
    data: new SlashCommandBuilder()
        .setName('lq')
        .setDescription('toggles loopqueue.')
        .toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        if (!(interaction.member instanceof GuildMember)) return;
        if (!interaction.member.voice.channel) {
            interaction.reply('> you have to be in a voice channel to use this command!')
            return;
        }
        if (guildMap.has(guildId) && interaction.member.voice.channelId !=guildMap.get(guildId)?.channelId) {
            interaction.reply('> you have to be in the same voice channel with me to use this command!')
            return;
        }
        if (!guildMap.has(guildId)) {
            interaction.reply('> there is no queue in this guild');
            return;
        }

        let q = guildMap.get(guildId) as Queue;
        q.loopQueue = !q.loopQueue;
        interaction.reply(`> loopqueue is set to ${q.loopQueue}`)
    }
} as Command;

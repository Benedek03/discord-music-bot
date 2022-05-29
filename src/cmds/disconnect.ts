import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { Command } from '../commad.js';
import { guildMap } from '../index.js';

export default {
    data: new SlashCommandBuilder()
        .setName('d')
        .setDescription('deletes the queue and disconnects.')
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

        guildMap.get(guildId)?.leave();
        interaction.reply('> disconnected')
    }
} as Command;

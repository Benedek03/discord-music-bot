import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { Command } from '../command.js';
import { Queue, shuffle } from '../queue.js';
import { guildMap } from '../index.js';
import { Song } from '../song.js'

export default {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('shuffles the queue')
        .toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        if (!(interaction.member instanceof GuildMember)) return;
        if (!interaction.member.voice.channel) {
            interaction.reply('> you have to be in a voice channel to use this command!')
            return;
        }
        if (guildMap.has(guildId) && interaction.member.voice.channelId != guildMap.get(guildId)?.channelId) {
            interaction.reply('> you have to be in the same voice channel with me to use this command!')
            return;
        }
        if (!guildMap.has(guildId)) {
            interaction.reply('> there is no queue in this guild');
            return;
        }
        
        let q = guildMap.get(guildId) as Queue;
        let temp = q.songs.shift() as Song;
        shuffle(q.songs)
        q.songs.unshift(temp);
        interaction.reply('the queue got shuffled')
    }
} as Command;

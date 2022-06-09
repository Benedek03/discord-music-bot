import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember } from 'discord.js';
import { Command } from '../command.js';
import { Queue } from '../queue.js';
import { guildMap } from '../index.js';

export default {
    data: new SlashCommandBuilder()
        .setName('s')
        .setDescription('skips to the nth song in the queue. default: 1.')
        .addIntegerOption(o =>
            o.setName('n')
                .setDescription('which song do you want to skip to?')
                .setRequired(false)
        ).toJSON(),
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
        let temp = q.loopSong;
        q.loopSong = false;
        let n = interaction.options.getInteger('n');
        if (!n)
            n = 1;
        if (n < 1) {
            interaction.reply('> n has to be at least 1');
            return;
        }
        if (n > q.songs.length - 1) {
            interaction.reply("> n can't be bigger than the length of the queue");
            return;
        }
        for (let i = 0; i < n; i++) {
            q.shift();
        }
        if (guildMap.has(guildId))
            q.play();
        q.loopSong = temp;
        interaction.reply(`> skipped ${n}. songs`);

    }
} as Command;

import { Command } from '../commad.js';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Queue, queueMap } from '../queue.js';

export default {
    data: new SlashCommandBuilder()
        .setName('rm')
        .setDescription('Removes nth song in the queue.')
        .addIntegerOption(o =>
            o.setName('n')
                .setDescription('n seems kinda sussy not gonna lie')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        if (!(interaction.member instanceof GuildMember)) return;
        if (!interaction.member.voice.channel) {
            interaction.reply('you have to be in a voice channel to use this command!')
            return;
        }
        if (queueMap.has(guildId) && interaction.member.voice.channelId != queueMap.get(guildId)?.channelId) {
            interaction.reply('you have to be in the same voice channel with me to use this command!')
            return;
        }
        if (!queueMap.has(guildId)) {
            interaction.reply('there is no queue in this guild');
            return;
        }
        let q = queueMap.get(guildId) as Queue;

        let n = interaction.options.getInteger('n') as number;
        if (n < 1) {
            interaction.reply('arg have to be at least 1');
            return;
        }
        if (n > q.songs.length-1) {
            interaction.reply("arg can't be bigger than the length of the queue");
            return;
        }
        let url = q.songs[n].url;
        q.songs.splice(n, 1);
        interaction.reply(`removed ${url} from queue`)
    }
} as Command;
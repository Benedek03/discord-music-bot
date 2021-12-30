import { Command } from '../commad.js';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Queue, queueMap } from '../queue.js';

export default {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addIntegerOption(o =>
            o.setName('index')
                .setDescription('asdfg')
                .setRequired(true)
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

        let index = interaction.options.getInteger('index') as number;
        if (index < 1) {
            interaction.reply('arg have to be at least 1');
            return;
        }
        if (index > q.songs.length-1) {
            interaction.reply("arg can't be bigger than the length of the queue");
            return;
        }
        let url = q.songs[index].url;
        q.songs.splice(index, 1);
        interaction.reply(`removed ${url} from queue`)
    }
} as Command;
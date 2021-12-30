import { Command } from '../commad.js';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import { Queue, queueMap } from '../queue.js';

export default {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('asdgfgfdashgdsfhsdf')
        .toJSON(),
    async execute(interaction: CommandInteraction) {
        if (!queueMap.has(interaction.guildId)) {
            interaction.reply('there is no queue in this guild');
            return;
        }
        let q = queueMap.get(interaction.guildId) as Queue;
        
        let embed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Current queue:')
            .setFooter(`loopsong: ${q.loopSong}     loopqueue: ${q.loopQueue}`)
            .addField('Now playing:', `[${q.songs[0].title}](${q.songs[0].url})`);
        for (let i = 1; i < q.songs.length; i++) {
            embed.addField(`${i}. in queue:`, `[${q.songs[i].title}](${q.songs[i].url})`);
        }

        interaction.reply({ embeds: [embed] });
    }
} as Command;
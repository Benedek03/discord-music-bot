import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, MessageEmbed } from 'discord.js';
import { Command } from '../commad.js';
import { Queue } from '../queue.js';
import { guildMap } from '../index.js';

export default {
    data: new SlashCommandBuilder()
        .setName('q')
        .setDescription('Lists the songs in the queue.')
        .toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        if (!guildMap.has(guildId)) {
            interaction.reply('there is no queue in this guild');
            return;
        }
        let q = guildMap.get(guildId) as Queue;
        
        let embed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('Current queue:')
            .setFooter({text: `loopsong: ${q.loopSong}     loopqueue: ${q.loopQueue}`})
            .addField('Now playing:', `[${q.songs[0].title}](${q.songs[0].url})`);
        for (let i = 1; i < q.songs.length; i++) {
            embed.addField(`${i}. in queue:`, `[${q.songs[i].title}](${q.songs[i].url})`);
        }

        interaction.reply({ embeds: [embed] });
    }
} as Command;
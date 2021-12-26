import { Command } from '../commad';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import ytsr from 'ytsr';

export default {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('dasfadfgsdfhagashgfdsb')
        .addStringOption(o =>
            o.setName('str')
                .setDescription('asdfg')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction: CommandInteraction) {
        interaction.deferReply();
        let str = interaction.options.getString('str') as string;
        let asd = (await ytsr(str, { limit: 10 })).items;
        let reply = "top results:\n";

        let j = 1;
        for (const i of asd) {
            if (i.type == 'video') {
                reply += `${j}: ${i.url}\n`;
                j++;
                if (j > 5)
                    break;
            }
        }

        interaction.editReply(reply)
    }
} as Command;
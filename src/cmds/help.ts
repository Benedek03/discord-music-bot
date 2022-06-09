import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction, GuildMember, MessageEmbed } from 'discord.js';
import { Command } from '../command.js';

export default {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('provides help')
        .toJSON(),
    async execute(interaction: CommandInteraction, guildId: string) {
        if (!(interaction.member instanceof GuildMember)) return;

        let embed = new MessageEmbed()
            .setColor(0xff0000)
            .setTitle('help?!')
            .addField('list of commands', 'there is autocomplete you just have to start with a /\nthe full list is [here](https://github.com/Benedek03/discord-music-bot/blob/main/commands.md)')
            .addField('having an issue?', 'please write an issue on [github](https://github.com/Benedek03/discord-music-bot/issues)');
        interaction.reply({ embeds: [embed] });
    }
} as Command;

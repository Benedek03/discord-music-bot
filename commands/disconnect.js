const { SlashCommandBuilder } = require('@discordjs/builders');
const { leave } = require('../utils/voice.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('disconnet')
        .setDescription('bubuka will leave your voice channel')
        .toJSON(),
    async execute(interaction) {
        leave(interaction.member.voice.channel);
        interaction.reply('disconnected');
    }
}
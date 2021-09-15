const { SlashCommandBuilder } = require('@discordjs/builders');
const { leaveChannel } = require('../utils/voiceHandler.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('disconnet')
        .setDescription('bubuka will leave your voice channel')
        .toJSON(),
    async execute(interaction) {
        leaveChannel(interaction.member.voice.channel);
        interaction.reply('disconnected');
    }
}
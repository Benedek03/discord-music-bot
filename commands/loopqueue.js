const { SlashCommandBuilder } = require('@discordjs/builders');
const { toggleLoopQueue } = require('../utils/voice.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('loopqueue')
        .setDescription('bubuka will toggle if the queue loops')
        .toJSON(),
    async execute(interaction) {
        toggleLoopQueue(interaction.member.voice.channel);
        interaction.reply('loopqueue toggled');
    }
}
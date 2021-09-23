const { SlashCommandBuilder } = require('@discordjs/builders');
const { toggleLoopQueue } = require('../../voice.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loopqueue')
        .setDescription('bubuka will toggle if the queue loops')
        .toJSON(),
    async execute(interaction) {
        toggleLoopQueue(interaction);
    }
}
const { SlashCommandBuilder } = require('@discordjs/builders');
const { toggleLoopSong } = require('../utils/voice.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('loopsong')
        .setDescription('bubuka will toggle if the current song loops')
        .toJSON(),
    async execute(interaction) {
        toggleLoopSong(interaction);
    }
}
const { SlashCommandBuilder } = require('@discordjs/builders');
const { skip } = require('../utils/voice.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('skip')
        .setDescription('bubuka will skip to the next song')
        .toJSON(),
    async execute(interaction) {
        skip(interaction);
    }
}
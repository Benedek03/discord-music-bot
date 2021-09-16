const { SlashCommandBuilder } = require('@discordjs/builders');
const { remove } = require('../utils/voice.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('remove')
        .setDescription('bubuka will remove a song from the queue')
        .addIntegerOption(option => 
            option.setName('index')
            .setDescription('index of the song in the queue')
            .setRequired(true)
        ).toJSON(),
    async execute(interaction) {
        remove(interaction, interaction.options.getInteger('index'));
    }
}
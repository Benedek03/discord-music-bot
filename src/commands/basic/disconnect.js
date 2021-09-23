const { SlashCommandBuilder } = require('@discordjs/builders');
const { leave } = require('../../voice.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disconnect')
        .setDescription('bubuka will leave your voice channel')
        .toJSON(),
    async execute(interaction) {
        leave(interaction);
    }
}
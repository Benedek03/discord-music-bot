const { SlashCommandBuilder } = require('@discordjs/builders');
const { createPlaylist } = require('../../voice.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createplaylist')
        .setDescription('bubuka will create a playlist')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name of the playlist that bubuka will create')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction) {
        createPlaylist(interaction);
    }
}
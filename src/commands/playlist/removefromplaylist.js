const { SlashCommandBuilder } = require('@discordjs/builders');
const { removeFormPlaylist } = require('../../voice.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removefromplaylist')
        .setDescription('bubuka will remove a song from a playlist')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name of the playlist that bubuka will create')
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option.setName('index')
                .setDescription('index of the song in the playlist')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction) {
        removeFormPlaylist(interaction);
    }
}
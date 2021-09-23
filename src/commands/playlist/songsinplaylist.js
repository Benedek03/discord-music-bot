const { SlashCommandBuilder } = require('@discordjs/builders');
const { songsInPlaylist } = require('../../voice.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('songsinplaylist')
        .setDescription('bubuka will show you the songs in a playlist')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name of the playlist')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction) {
        songsInPlaylist(interaction);
    }
}
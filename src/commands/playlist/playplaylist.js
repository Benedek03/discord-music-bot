const { SlashCommandBuilder } = require('@discordjs/builders');
const { playPlaylist } = require('../../voice.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('playplaylist')
        .setDescription('bubuka will add all the songs in the playlist to the queue')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name of the playlist')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction) {
        playPlaylist(interaction);
    }
}
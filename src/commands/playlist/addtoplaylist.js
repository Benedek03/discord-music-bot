const { SlashCommandBuilder } = require('@discordjs/builders');
const { addToPlaylist } = require('../../voice.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addtoplaylist')
        .setDescription('bubuka will add a song to a playlist')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name of the playlist that bubuka will create')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('link')
                .setDescription('link of the song')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction) {
        addToPlaylist(interaction);
    }
}
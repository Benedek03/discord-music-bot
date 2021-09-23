const { SlashCommandBuilder } = require('@discordjs/builders');
const { removePlaylist } = require('../../voice.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeplaylist')
        .setDescription('bubuka will remove a playlist')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name of the playlist that bubuka will create')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction) {
        removePlaylist(interaction);
    }
}
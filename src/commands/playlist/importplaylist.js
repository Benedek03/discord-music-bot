const { SlashCommandBuilder } = require('@discordjs/builders');
const { importPlaylist } = require('../../voice.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('importplaylist')
        .setDescription('bubuka import a playlist')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name of the playlist')
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('id')
                .setDescription('id of the the playlist')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction) {
        importPlaylist(interaction);
    }
}
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getPlaylistID } = require('../../voice.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getplaylistid')
        .setDescription('bubuka will give you the id of the playlist')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name of the playlist')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction) {
        getPlaylistID(interaction);
    }
}
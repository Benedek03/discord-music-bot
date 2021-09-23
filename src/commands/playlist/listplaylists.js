const { SlashCommandBuilder } = require('@discordjs/builders');
const { listPlaylists } = require('../../voice.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listplaylists')
        .setDescription('bubuka will list all of the playlists in this guild')
        .toJSON(),
    async execute(interaction) {
        listPlaylists(interaction);
    }
}
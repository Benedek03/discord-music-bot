const { SlashCommandBuilder } = require('@discordjs/builders');
const { replaceQueueWithPlaylist } = require('../../voice.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('replacequeue')
        .setDescription('bubuka will replace the queue with a playlist')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('name of the playlist')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction) {
        replaceQueueWithPlaylist(interaction);
    }
}
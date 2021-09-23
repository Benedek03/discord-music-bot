const { SlashCommandBuilder } = require('@discordjs/builders');
const { queue } = require('../../voice.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('queue')
        .setDescription('bubuka will tell you the songs in the queue')
        .toJSON(),
    async execute(interaction) {
        queue(interaction);
    }
}
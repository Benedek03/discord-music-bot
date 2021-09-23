const { SlashCommandBuilder } = require('@discordjs/builders');
const { add } = require('../../voice.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('bubuka will play a song for you')
        .addStringOption(option =>
            option.setName('link')
                .setDescription('link to youtube video that bubuka will play')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction) {
        add(interaction);
    }
}
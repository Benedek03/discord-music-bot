const { SlashCommandBuilder } = require('@discordjs/builders');
const { remove } = require('../utils/voice.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('remove')
        .setDescription('bubuka will remove a song from the queue')
        .addIntegerOption(option => 
            option.setName('index')
            .setDescription('index of the song in the queue')
            .setRequired(true)
        ).toJSON(),
    async execute(interaction) {
        let removed = remove(interaction.member.voice.channel, interaction.options.getInteger('index'));
        interaction.reply(`removed ${removed}`);
    }
}
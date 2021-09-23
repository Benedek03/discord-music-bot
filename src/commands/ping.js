const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('bubuka will replies with pong')
        .toJSON(),
    async execute(interaction) {
        interaction.reply('pong');
    }
}
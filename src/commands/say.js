const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('bubuka will say what you want')
        .addStringOption(option =>
            option.setName('str')
                .setDescription('string that bubuka will say')
                .setRequired(true)
        ).toJSON(),
    async execute(interaction) {
        interaction.reply(interaction.options.getString('str'));
    }
}
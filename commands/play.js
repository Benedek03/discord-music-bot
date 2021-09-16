const { SlashCommandBuilder } = require('@discordjs/builders');
const { add } = require('../utils/voice.js');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('play')
        .setDescription('bubuka will play a song for you')
        .addStringOption(option => 
            option.setName('link')
            .setDescription('link to youtube video that bubuka will play')
            .setRequired(true)
        ).toJSON(),
    async execute(interaction) {

        let link = interaction.options.getString('link');
        if(link.includes('&')){
            link = link.split('&')[0];
        }

        interaction.reply(`added ${link} to queue`);
        add(interaction.member.voice.channel, link);
    }
}
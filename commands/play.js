const { SlashCommandBuilder } = require('@discordjs/builders');
const { addToQueue } = require('../utils/voiceHandler.js');
//https://www.youtube.com/watch?v= code


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
        interaction.reply(link);
        addToQueue(link, interaction.member.voice.channel);
    }
}
const { SlashCommandBuilder } = require('@discordjs/builders');
const { queue } = require('../utils/voice.js');
var getYoutubeTitle = require('get-youtube-title');

module.exports = {
    data : new SlashCommandBuilder()
        .setName('queue')
        .setDescription('bubuka will tell you the songs in the queue')
        .toJSON(),
    async execute(interaction) {
        let q = queue(interaction.member.voice.channel);
        let index = q.pop();
        let loopQueue = q.pop();

        let embed = {
            color: 0xff0000,
            title: 'queue',
            fields: [],
            footer: {
                text: `loopqueue: ${loopQueue}`
            }
        }

        for (let i = 0; i < q.length; i++) {
            const link = q[i];
            getYoutubeTitle(link.replace('https://www.youtube.com/watch?v=', ''), function (err, title) {
                if(err) {console.error(err)}

                let n = `${i}. song`;
                if (i == index ) { n += ' now playing'; }

                let v = `[${title}](${link})`

                embed.fields[i] = {
                    name: n,
                    value: v
                };
            });
        }
        setTimeout(() => {interaction.reply({embeds: [embed]});}, 1000)
    }
}
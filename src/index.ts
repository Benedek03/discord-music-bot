import { commandDataArray, commandMap } from "./commad";
import { deployInGuild, deleteInGuild } from "./deploy";
import { Client, Intents, Interaction } from 'discord.js';
import { config as dotenv } from 'dotenv'; dotenv();
if (!process.env.DISCORD_TOKEN) {
    console.error('no process.env.DISCORD_TOKEN in .env');
    process.exit();
}

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_VOICE_STATES,
    ]
});

client.on('interactionCreate', async (interaction: Interaction) => {
    if (!interaction.isCommand()) return;
    if (!interaction.guildId) {
        interaction.reply('this bot works only in servers');
        return;
    }
    try {
        if (commandMap.has(interaction.commandName)) {
            await commandMap.get(interaction.commandName)?.execute(interaction);
        } else {
            interaction.reply('this command is not working at the moment');
        }
    } catch (e) {
        console.error(e);
        interaction.reply('oops there was an error');
    }
})

client.on('ready', () => {
    console.log('ready');
});
client.login(process.env.DISCORD_TOKEN);



// import { createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnection } from '@discordjs/voice';
// import ytdl from "ytdl-core";

// client.on('messageCreate', msg => {
    //     if (!msg.guild || !msg.guildId) return;
    //     if (msg.content != 'ping') return;

//     msg.reply('pong');
//     try {
//         let player = createAudioPlayer();
//         let connection = joinVoiceChannel({
//             selfDeaf: false,
//             selfMute: false,
//             guildId: msg.guildId,
//             channelId: msg.member?.voice.channelId as string,
//             adapterCreator: msg.guild.voiceAdapterCreator
//         });
//         (async () => {
//             // let r = await ytdl('https://www.youtube.com/watch?v=-qWxHEUukEc&ab_channel=MusicLibrary-1Hour',{highWaterMark:1<<25});
//             let r = await ytdl('https://www.youtube.com/watch?v=-qWxHEUukEc&ab_channel=MusicLibrary-1Hour',{highWaterMark:1<<25});
//             let res = createAudioResource(r);
//             connection.subscribe(player);
//             player.play(res);
//         })();

//     } catch (err) {
//         console.error(err);
//     }
// });

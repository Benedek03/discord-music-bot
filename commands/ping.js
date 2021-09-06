module.exports = {
    //name: 'ping',
    description: 'Replies with "Pong!"',
    testOnly: true,
    slash: true,

    callback: ({ interaction }) => {
        interaction.reply({
            content: 'pong'
        })
    }
}
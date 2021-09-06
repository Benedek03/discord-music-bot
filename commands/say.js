module.exports = {
    //name: 'say',
    description: 'make bubuka say something!',
    testOnly: true,
    slash: true,

    minArgs: 1,
    maxArgs: 1,
    expectedArgs: '<str>',

    callback: ({ interaction, args }) => {
        interaction.reply({
            content: args[0]
        })
    }
}
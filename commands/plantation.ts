import DiscordJS, { TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'

export default {
    category: 'Logging',
    description: 'Log platation time remaining.',
    slash: 'both',
    testOnly: true,
    minArgs: 2,
    expectedArgs: '<server> <time_remaining>',
    options: [
        {
            name: 'server',
            description: 'Which server is this for?',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'time_remaining',
            description: 'How much time is remaining on the plantation?',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    callback: async ({ message, interaction: msgInt, args}) => {
        const serverID = args[0]
        if (serverID === '1') {
            var adminChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908046740291223562')) as TextChannel
            var mainChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908046658988822578')) as TextChannel
        } else {
            var adminChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908041393417621545')) as TextChannel
            var mainChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908041261947166750')) as TextChannel
        }
        const timeRemaining = args[1]
        const embed = new DiscordJS.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`<@${msgInt.user.id}> has nourished the plantation!\n\nThere is ${timeRemaining} left on the plantation!`)
            .setThumbnail('https://i.imgur.com/1RQb1eQ.jpeg')
        await mainChannel.send({embeds: [embed]})
        await adminChannel.send({embeds: [embed]})
        if (msgInt) {
            msgInt.reply({
                content: 'Submitted your log!',
                ephemeral: true
            })
        }
    }
} as ICommand
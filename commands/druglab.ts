import DiscordJS, { TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'

export default {
    category: 'Logging',
    description: 'Log all druglab actions.',
    slash: 'both', 
    testOnly: true,
    minArgs: 2,
    expectedArgs: '<server> <time> <products>',
    options: [
        {
            name: 'server',
            description: 'Which server is this for?',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'time',
            description: 'The time you created the actions.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'products',
            description: 'All the products you removed. Ex: 10 coke, 5 weed, 20 money.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    callback: async ({ message, interaction: msgInt, args }) => {
        const serverID = args[0]
        if (serverID === '1') {
            var adminChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908046740291223562')) as TextChannel
            var mainChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908046658988822578')) as TextChannel
        } else {
            var adminChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908041393417621545')) as TextChannel
            var mainChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908041261947166750')) as TextChannel
        }
        const time = args[1]
        const products = args[2]
        const embed = new DiscordJS.MessageEmbed()
            .setDescription(`<@${msgInt.user.id}> has logged the druglab!`)
            .addField('Time:', time, true)
            .addField('Products:', products, false)
            .setColor('BLURPLE')
            .setThumbnail('https://i.imgur.com/mEZlZhO.jpeg')
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
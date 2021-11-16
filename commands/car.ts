import DiscordJS, { TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'

export default {
    category: 'Logging',
    description: 'Log cars that have been gassed or taken in and out of the garage.',
    slash: 'both',
    testOnly: true,
    minArgs: 4,
    expectedArgs: '<server> <car_name> <in_out_gassed> <time> <cost>',
    options: [
        {
            name: 'server',
            description: 'Please specify either 1 or 2 for the city you are logging for.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: 'car_name',
            description: 'The name of the car.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'in_out_gassed',
            description: 'Did you fill the car with gas or put it in or out of the garage? Examples: in, out, gassed.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'time',
            description: 'Server time from when you initialy used or filled the car.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'cost',
            description: 'Only fill this out of you filled the car with gas.',
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    callback: async ({ message, interaction: msgInt, args }) => {
        const serverID = args[0]
        if (serverID === '1') {
            var adminChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908023660663685120')) as TextChannel
            var mainChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908046658988822578')) as TextChannel
        } else {
            var adminChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908023602098622464')) as TextChannel
            var mainChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908041261947166750')) as TextChannel
        }
        const carName = args[1]
        const IOG = args[2]
        const time = args[3]
        const cost = args[4]
        if (IOG === 'gassed') {
            if (!cost) {
                msgInt.reply({
                    content: 'Please specify how much you payed for gas!',
                    ephemeral: true
                })
            }
            return;
        }
        const embed = new DiscordJS.MessageEmbed()
            .addField('Time:', time, true)
            .addField('Car Name:', carName, true)
        if (IOG === 'gassed') {
            embed.setColor('PURPLE')
            embed.setDescription(`<@${msgInt.user.id}> filled up a car!`)
            embed.addField('Cost:', `$${cost}`, true)
        }
        if (IOG === 'in') {
            embed.setColor('GREEN')
            embed.setDescription(`<@${msgInt.user.id}> put a car in the garage!`)
        }
        if (IOG === 'out') {
            embed.setColor('RED')
            embed.setDescription(`<@${msgInt.user.id}> has taken a car out of the garage!`)
        }
        embed.setThumbnail('https://cdn-icons-png.flaticon.com/128/3774/3774278.png')
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

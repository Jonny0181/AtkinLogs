import DiscordJS, { MessageEmbed, TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'

export default {
    category: 'Logging',
    description: 'Log cars that have been gassed or taken in and out of the garage.',
    slash: 'both',
    testOnly: true,
    minArgs: 3,
    expectedArgs: '<car_name> <in_out_gassed> <time> <cost>',
    options: [
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
        try {
            var adminChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908023484842643567')) as TextChannel
            var mainChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908041261947166750')) as TextChannel
            const carName = args[0]
            const IOG = args[1]
            const time = args[2]
            const cost = args[3]
            if (IOG === 'gassed') {
                if (!cost) {
                    return msgInt.reply({
                        content: 'Please specify how much you payed for gas!',
                        ephemeral: true
                    })
                }
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
        } catch(error) {
            const embed = new MessageEmbed()
                .setColor('RED')
                .addField('Error:', `\`\`\`\n${error}\`\`\``, false)
            return msgInt.reply({
               content: `<@827940585201205258> What the there was an error!?`,
               embeds: [embed]
            })
        }
    }
} as ICommand

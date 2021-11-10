import DiscordJS, { TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'
import { logChannel } from '..'

export default {
    category: 'Logging',
    description: 'Log nourished seeds.',
    slash: 'both', 
    testOnly: true,
    minArgs: 3,
    expectedArgs: '<server> <house_number> <time_remaining>',
    options: [
        {
            name: 'server',
            description: 'Please specify either 1 or 2 for the city you are logging for.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: 'house_number',
            description: 'The number of the house for the seeds.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: 'time_remaining',
            description: 'How much time is remaining on the seeds?',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    callback: async ({ message, interaction: msgInt, args}) => {
        const channel = (message ? message.guild : msgInt.guild?.channels.cache.get(`${logChannel}`)) as TextChannel
        const serverID = args[0]
        const houseNumber = args[1]
        const timeRemaining = args[2]
        const embed = new DiscordJS.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`<@${msgInt.user.id}> has nourished seeds!`)
            .addField('House number:', houseNumber, true)
            .addField('Time Remaining:', timeRemaining, true)
            .setThumbnail('https://cdn.shopify.com/s/files/1/1061/1924/products/26_large.png?v=1571606116')
            .setFooter(`This action was logged for server ${serverID}.`)
        await channel.send({embeds: [embed]})
        if (msgInt) {
            msgInt.reply({
                content: 'Submitted your log!',
                ephemeral: true
            })
        }
    }
} as ICommand
import DiscordJS, { TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'
import { logChannel } from '..'

export default {
    category: 'Logging',
    description: 'Log your afk time.',
    slash: 'both',
    testOnly: true,
    minArgs: 3,
    expectedArgs: '<server> <time_start> <duration>',
    options: [
        {
            name: 'server',
            description: 'Please specify either 1 or 2 for the city you are logging for.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: 'time_start',
            description: 'Server time from when you initialy when AFK.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'duration',
            description: 'How long will you be AFK for?',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    callback: async ({ message, interaction: msgInt, args}) => {
        const serverID = args[0]
        const timeStart = args[1]
        const duration = args[2]
        const channel = (message ? message.guild : msgInt.guild?.channels.cache.get(`${logChannel}`)) as TextChannel
        const embed = new DiscordJS.MessageEmbed()
            .setColor('YELLOW')
            .setDescription(`<@${msgInt.user.id}> has gone AFK!`)
            .addField('Time Start:', timeStart, true)
            .addField('Duration:', duration, true)
            .setThumbnail('http://cdn.shopify.com/s/files/1/1061/1924/products/Sleeping_Emoji_2_grande.png?v=1571606093')
            .setFooter(`This action was logged for server ${serverID}.`)
        await channel.send({embeds: [embed]})
        if (msgInt) {
            msgInt.reply({
                content: 'Submited your log!',
                ephemeral: true
            })
        }
    }
} as ICommand
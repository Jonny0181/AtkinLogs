import DiscordJS, { TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'
import { logChannel } from '..'

export default {
    category: 'Logging',
    description: 'Log platation time remaining.',
    slash: 'both',
    testOnly: true,
    minArgs: 1,
    expectedArgs: '<time_remaining>',
    options: [
        {
            name: 'time_remaining',
            description: 'How much time is remaining on the plantation?',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    callback: async ({ message, interaction: msgInt, args}) => {
        const channel = (message ? message.guild : msgInt.guild?.channels.cache.get(`${logChannel}`)) as TextChannel
        const timeRemaining = args[0]
        const embed = new DiscordJS.MessageEmbed()
            .setColor('GREEN')
            .setTitle(`${msgInt.user.username} has nourished the plantation!`)
            .setDescription(`There is ${timeRemaining} left on the plantation!`)
            .setThumbnail('https://i.imgur.com/1RQb1eQ.jpeg')
        await channel.send({embeds: [embed]})
        if (msgInt) {
            msgInt.reply({
                content: 'Submitted your log!',
                ephemeral: true
            })
        }
    }
} as ICommand
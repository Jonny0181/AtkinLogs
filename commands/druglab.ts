import DiscordJS, { TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'
import { logChannel } from '..'

export default {
    category: 'Logging',
    description: 'Log all druglab actions.',
    slash: 'both', 
    testOnly: true,
    minArgs: 2,
    expectedArgs: '<time> <products>',
    options: [
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
        const channel = (message ? message.guild : msgInt.guild?.channels.cache.get(`${logChannel}`)) as TextChannel
        const time = args[0]
        const products = args[1]
        const embed = new DiscordJS.MessageEmbed()
            .setDescription(`<@${msgInt.user.id}> has logged the druglab!`)
            .addField('Time:', time, true)
            .addField('Products:', products, false)
            .setColor('BLURPLE')
            .setThumbnail('https://i.imgur.com/mEZlZhO.jpeg')
        await channel.send({embeds: [embed]})
        if (msgInt) {
            msgInt.reply({
                content: 'Submitted your log!',
                ephemeral: true
            })
        }
    }
} as ICommand
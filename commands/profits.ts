import DiscordJS, { TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'

export default {
    category: 'Logging',
    description: 'Log collected profits.',
    slash: 'both', 
    testOnly: true,
    minArgs: 3,
    expectedArgs: '<server> <biz_name> <amount>',
    options: [
        {
            name: 'server',
            description: 'Please specify either 1 or 2 for the city you are logging for.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: 'biz_name',
            description: 'The name of the buisness.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'amount',
            description: 'How much money did you collect?',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    callback: async ({message, interaction: msgInt, args}) => {
        const serverID = args[0]
        const bizName = args[1]
        const amount = args[2]
        if (serverID === '1') {
            var channel = (message ? message.guild : msgInt.guild?.channels.cache.get('908023660663685120')) as TextChannel
        } else {
            
            var channel = (message ? message.guild : msgInt.guild?.channels.cache.get('908023602098622464')) as TextChannel
        }
        const embed = new DiscordJS.MessageEmbed()
            .setColor('GREEN')
            .setDescription(`<@${msgInt.user.id}> has collected profits!`)
            .addField('Buisness:', bizName, true)
            .addField('Amount:', `$${amount}`, true)
            .setThumbnail('http://cdn.shopify.com/s/files/1/1061/1924/products/Money_with_Wings_Emoji_grande.png?v=1571606064')
        await channel.send({embeds: [embed]})
        if (msgInt) {
            msgInt.reply({
                content: 'Submited your log!',
                ephemeral: true
            })
        }
    }
} as ICommand
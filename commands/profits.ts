import DiscordJS, { MessageEmbed, TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'

export default {
    category: 'Logging',
    description: 'Log collected profits from buisness.',
    slash: 'both', 
    testOnly: true,
    minArgs: 2,
    expectedArgs: '<biz_name> <amount>',
    options: [
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
        try {
            const bizName = args[0]
            const amount = args[1]
            var adminChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908023484842643567')) as TextChannel
            var mainChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908041261947166750')) as TextChannel
            const embed = new DiscordJS.MessageEmbed()
                .setColor('GREEN')
                .setDescription(`<@${msgInt.user.id}> has collected profits!`)
                .addField('Buisness:', bizName, true)
                .addField('Amount:', `$${amount}`, true)
                .setThumbnail('http://cdn.shopify.com/s/files/1/1061/1924/products/Money_with_Wings_Emoji_grande.png?v=1571606064')
            await mainChannel.send({embeds: [embed]})
            await adminChannel.send({embeds: [embed]})
            if (msgInt) {
                msgInt.reply({
                    content: 'Submited your log!',
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
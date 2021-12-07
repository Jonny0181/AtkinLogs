import DiscordJS, { MessageEmbed, TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'

export default {
    category: 'Logging',
    description: 'Log nourished seeds at family house or family members houses.',
    slash: 'both', 
    testOnly: true,
    minArgs: 2,
    expectedArgs: '<house_number> <time_remaining>',
    options: [
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
        try {
            var adminChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908023484842643567')) as TextChannel
            var mainChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908041261947166750')) as TextChannel
            const houseNumber = args[0]
            const timeRemaining = args[1]
            const embed = new DiscordJS.MessageEmbed()
                .setColor('GREEN')
                .setDescription(`<@${msgInt.user.id}> has nourished seeds!`)
                .addField('House number:', houseNumber, true)
                .addField('Time Remaining:', timeRemaining, true)
                .setThumbnail('https://cdn.shopify.com/s/files/1/1061/1924/products/26_large.png?v=1571606116')
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
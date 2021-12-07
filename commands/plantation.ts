import DiscordJS, { MessageEmbed, TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'

export default {
    category: 'Logging',
    description: 'Log the remaining time at the plantation.',
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
        try{
            var adminChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908023484842643567')) as TextChannel
            var mainChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908041261947166750')) as TextChannel
            const timeRemaining = args[0]
            const embed = new DiscordJS.MessageEmbed()
                .setColor('GREEN')
                .setDescription(`<@${msgInt.user.id}> has nourished the plantation!\n\nThere is ${timeRemaining} left on the plantation!`)
                .setThumbnail('https://i.imgur.com/1RQb1eQ.jpeg')
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
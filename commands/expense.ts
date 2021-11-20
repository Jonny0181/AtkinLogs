import DiscordJS, { MessageEmbed, TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'

export default {
    category: 'Logging',
    description: 'Log nourished seeds.',
    slash: 'both', 
    testOnly: true,
    minArgs: 3,
    expectedArgs: '<server> <cost> <notes>',
    options: [
        {
            name: 'server',
            description: 'Please specify either 1 or 2 for the city you are logging for.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: 'cost',
            description: 'How much did this expense cost you?',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'notes',
            description: 'What where the expenses for?',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    callback: async ({message, interaction: msgInt, args}) => {
        try {
            const serverID = args[0]
            if (serverID === '1') {
                var adminChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908023660663685120')) as TextChannel
                var mainChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908046658988822578')) as TextChannel
            } else {
                var adminChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908023602098622464')) as TextChannel
                var mainChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908041261947166750')) as TextChannel
            }
            const cost = args[1]
            const notes = args[2]
            const embed = new DiscordJS.MessageEmbed()
                .setColor('RED')
                .setDescription(`<@${msgInt.user.id}> has logged an expense!`)
                .addField('Cost:', `\$${cost}`, true)
                .addField('Notes:', notes, false)
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/118/bank_1f3e6.png')
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
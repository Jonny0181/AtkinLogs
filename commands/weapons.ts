import { ICommand } from "wokcommands";
import DiscordJS, { GuildMember, TextChannel } from 'discord.js'
import { logChannel } from "..";

export default {
    category: 'Logging',
    description: 'Logs items put into the weapons storage.',
    slash: 'both',
    testOnly: true,
    minArgs: 5,
    expectedArgs: '<server> <in_out> <item> <amount> <server time> <notes>',
    options: [
        {
            name: 'server',
            description: 'Please specify either 1 or 2 for the city you are logging for.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: 'in_out',
            description: 'Mention if you are taking the item or puttiung it in storage.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'item',
            description: 'The item you added to shared storage. Ex: battery.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'amount',
            description: 'How many of the item you put in.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: 'time',
            description: 'Server time Ex: 20:30.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'notes',
            description: 'Optional notes. Ex: Put in for jonny or removed for nathan.',
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    callback: async ({ message, interaction: msgInt, args }) => {
        const options = ['in', 'out']
        const serverID = args[0]
        const item = args[2]
        const amount = args[3]
        const time = args[4]
        const IO = args[1]
        const desc = args[5]
        const author = message ? message.author : msgInt.user
        if (serverID === '1') {
            var channel = (message ? message.guild : msgInt.guild?.channels.cache.get('908023660663685120')) as TextChannel
        } else {
            
            var channel = (message ? message.guild : msgInt.guild?.channels.cache.get('908023602098622464')) as TextChannel
        }
        if (!channel || channel.type !== 'GUILD_TEXT') {
            return 'Please tag a text channel.'
        }
        if (IO !in options) {
            msgInt.reply({
                content: 'Please use `in` or `out`!',
                ephemeral: true
            })
        }
        if (IO === 'in') {
            var label = 'put in'
        } else {
            var label = 'taken'
        }
        if (desc) {
            var description = desc
        } else {
            description = "No notes added."
        }
        const embed = new DiscordJS.MessageEmbed()
            .setDescription(`A new item has been ${label} by <@${author.id}>!\n\n${description}`)
            .addField('Item', item, true)
            .addField('Amount', amount, true)
            .addField('Time', time, true)
            .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/48/pistol_1f52b.png')
            if (IO === 'in') {
                var label = 'put in'
                embed.setColor('GREEN')
            } else {
                var label = 'taken'
                embed.setColor('RED')
            }
        await channel.send({embeds: [embed]})
        if (msgInt) {
            msgInt.reply({
                content: 'Submitted your log!',
                ephemeral: true
            })
        }
    }
} as ICommand
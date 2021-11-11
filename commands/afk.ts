import DiscordJS, { MessageActionRow, MessageButton, MessageComponentInteraction, TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'

export default {
    category: 'Logging',
    description: 'Log your afk time.',
    slash: 'both',
    testOnly: true,
    minArgs: 1,
    expectedArgs: '<server>',
    options: [
        {
            name: 'server',
            description: 'Please specify either 1 or 2 for the city you are logging for.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        }
    ],
    callback: async ({ message, interaction: msgInt, args}) => {
        const serverID = args[0]
        if (serverID === '1') {
            var channel = (message ? message.guild : msgInt.guild?.channels.cache.get('908046740291223562')) as TextChannel
        } else {
            var channel = (message ? message.guild : msgInt.guild?.channels.cache.get('908041393417621545')) as TextChannel
        }

        function timer() {
            let timeStart = new Date().getTime();
            return {
                get hours() {
                    const hours = Math.ceil((new Date().getTime() - timeStart) / (1000 * 60 * 60) % 24) - 1 + ' hours';
                    return hours;
                },
                get minutes() {
                    const minutes = Math.ceil((new Date().getTime() - timeStart) / (1000 * 60) % 60) - 1 + ' minutes';
                    return minutes;
                },
                get seconds() {
                    const seconds = Math.ceil((new Date().getTime() - timeStart) / 1000 % 60) - 1 + ' seconds';
                    return seconds;
                }
            }
        }
        const howLong = timer();
        const embed = new DiscordJS.MessageEmbed()
            .setColor('YELLOW')
            .setDescription(`<@${msgInt.user.id}> has gone AFK!\n\nThey will be back in some time.`)
            .setThumbnail('http://cdn.shopify.com/s/files/1/1061/1924/products/Sleeping_Emoji_2_grande.png?v=1571606093')
        
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('back')
                .setLabel('I\'m back')
                .setStyle('SUCCESS')
        )

        let afkMsg = await channel.send({embeds: [embed], components: [row]})
        if (msgInt) {
            msgInt.reply({
                content: 'Submited your log!',
                ephemeral: true
            })
        }

        const filter = (btnInt: MessageComponentInteraction) => {
            return msgInt.user.id === btnInt.user.id
        }

        const collector = channel.createMessageComponentCollector({
            filter, 
            max: 1,
        })

        collector.on('end', async (collection) => {
            if (collection.first()?.customId === 'back') {
                const embed = new DiscordJS.MessageEmbed()
                .setColor('GREEN')
                .setDescription(`<@${msgInt.user.id}> is back from being AFK!\n\nHas been afk for ${howLong.hours} ${howLong.minutes} ${howLong.seconds}!`)
                .setFooter(`This action was logged for server ${serverID}.`)
                await afkMsg.edit({
                    embeds: [embed],
                    components: []
                })
                return
            }
        })
    }
} as ICommand
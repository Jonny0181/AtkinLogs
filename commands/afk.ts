import DiscordJS, { MessageActionRow, MessageButton, MessageComponentInteraction, MessageEmbed, TextChannel } from 'discord.js'
import { ICommand } from 'wokcommands'

export default {
    category: 'Logging',
    description: 'Log your afk time.',
    slash: 'both',
    testOnly: true,
    callback: async ({ message, interaction: msgInt, args}) => {
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
        try {
            var channel = (message ? message.guild : msgInt.guild?.channels.cache.get('908041393417621545')) as TextChannel
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
                    await afkMsg.edit({
                        embeds: [embed],
                        components: []
                    })
                    return
                }
            })
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
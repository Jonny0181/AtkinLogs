import { GuildMember, MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Moderation',
    description: 'Kicks a user from the guild.',
    permissions: ['ADMINISTRATOR'],

    slash: 'both',
    testOnly: true,
    guildOnly: true,

    minArgs: 2,
    expectedArgs: '<user> <reason>',
    expectedArgsTypes: ['USER', 'STRING'],

    callback: async ({ message, interaction: msgInt, channel, args }) => {
        const target = message ? message.mentions.members?.first() : msgInt.options.getMember('user') as GuildMember
        if (!target) {
            return 'Please tag someone to kick.'
        }

        if (!target.kickable) {
            return {
                custom: true,
                content: 'You cannot kick that user.',
                ephemeral: true
            }
        }

        args.shift()
        const reason = args.join(' ')

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('kick_yes')
                .setEmoji('👢')
                .setLabel('Confirm')
                .setStyle('SUCCESS')
        )
        .addComponents(
            new MessageButton()
                .setCustomId('kick_no')
                .setLabel('Cancel')
                .setStyle('DANGER')
        )
        
        await msgInt.reply({
            content: `Are you sure you want to kick ${target.displayName}?`,
            ephemeral: true,
            components: [row],
        })

        const filter = (btnInt: MessageComponentInteraction) => {
            return msgInt.user.id === btnInt.user.id
        }

        const collector = channel.createMessageComponentCollector({
            filter, 
            max: 1,
            time: 1000 * 15
        })

        collector.on('end', async (collection) => {
            collection.forEach((click) => {
                console.log(click.user.id, click.customId)
            })

            if (collection.first()?.customId === 'kick_yes') {
                target.kick(reason)
                await msgInt.editReply({
                    content: `You kicked <@${target.id}>`,
                    components: []
                })
            }
            if (collection.first()?.customId === 'kick_no') {
                await msgInt.editReply({
                    content: 'I have canceled the task.',
                    components: []
                })
            }
        })
    }
} as ICommand
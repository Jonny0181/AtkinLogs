import { GuildMember, MessageActionRow, MessageButton, MessageComponentInteraction } from "discord.js";
import { ICommand } from "wokcommands";

export default {
    category: 'Moderation',
    description: 'Bans a user from the guild.',
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
            return 'Please tag someone to ban.'
        }

        if (!target.bannable) {
            return {
                custom: true,
                content: 'You cannot ban that user.',
                ephemeral: true
            }
        }

        args.shift()
        const reason = args.join(' ')

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('ban_yes')
                .setEmoji('🔨')
                .setLabel('Confirm')
                .setStyle('SUCCESS')
        )
        .addComponents(
            new MessageButton()
                .setCustomId('ban_no')
                .setLabel('Cancel')
                .setStyle('DANGER')
        )
        
        await msgInt.reply({
            content: `Are you sure you want to ban ${target.displayName}?`,
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

            if (collection.first()?.customId === 'ban_yes') {
                target.ban({
                    reason,
                    days: 7
                })
                await msgInt.editReply({
                    content: `You banned <@${target.id}>`,
                    components: []
                })
            }
            if (collection.first()?.customId === 'ban_no') {
                await msgInt.editReply({
                    content: 'I have canceled the task.',
                    components: []
                })
            }
        })
    }
} as ICommand
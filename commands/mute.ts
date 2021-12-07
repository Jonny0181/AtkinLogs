import { User } from "discord.js"
import { ICommand } from "wokcommands"
import punishmentSchema from "../models/punishment-schema"
import DiscordJS from 'discord.js'

export default {
    category: 'Moderation',
    description: 'Mutes a user',

    permissions: ['ADMINISTRATOR'],

    minArgs: 3,
    expectedArgs: '<user> <duration> <reason>',
    slash: false,
    testOnly: true,

    callback: async ({
        args,
        member: staff,
        guild,
        client,
        message,
        interaction
    }) => {
        if (!guild) {
            return 'You can only use this in a server.'
        }
        let userId = args.shift()!
        const duration = args.shift()!
        const reason = args.join(' ')
        let user: User | undefined
        if (message) {
            user = message.mentions.users?.first()
        } else {
            user = interaction.options.getUser('user') as User
        }
        if (!user) {
            userId = userId.replace(/[<@!>]/g, '')
            user = await client.users.fetch(userId)
            if (!user) {
                return `Could not find the user with the id "${userId}"`
            }
        }
        userId = user.id
        let time
        let type
        try {
            const split = duration.match(/\d+|\D+/g)
            time = parseInt(split![0])
            type = split![1].toLocaleLowerCase()
        } catch (e) {
            return "Invalid time format! Example format: \"10d\" where 'd' = days, 'h' = hours and 'm' = minutes."
        }
        if (type === 'h') {
            time *= 60
        } else if (type === 'd') {
            time *= 60 * 24
        } else if (type !== 'm') {
            return 'Please use "m", "h", or "d" for minutes, hours, and days respectively.'
        }

        const expires = new Date()
        expires.setMinutes(expires.getMinutes() + time)

        const result = await punishmentSchema.findOne({
            guildId: guild.id,
            userId,
            type: 'mute'
        })
        if (result) {
            return `<@${user.id} is already muted in this server.`
        }
        try {
            const member = await guild.members.fetch(userId)
            if (member) {
                const muteRole = guild.roles.cache.find((role) => role.name === 'Muted')
                if (!muteRole) {
                    return 'This server does not have a role named "Muted".'
                }
                member.roles.add(muteRole)
                member.send(`You have been muted in server ${guild.name}!\nReason: ${reason}.`)
            }
            await new punishmentSchema({
                userId,
                guildId: guild.id,
                staffId: staff.id,
                reason,
                expires,
                type: 'mute',
            }).save()
        } catch (ignored) {
            return "Cannot mute that user."
        }
        return `<@${userId}> has been muted for ${duration}.`
    },
} as ICommand
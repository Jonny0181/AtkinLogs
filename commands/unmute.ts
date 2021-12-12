import { User } from "discord.js"
import { ICommand } from "wokcommands"
import punishmentSchema from "../models/punishment-schema"

export default {
    category: 'Moderation',
    description: 'Unmutes a user',

    permissions: ['ADMINISTRATOR'],

    minArgs: 1,
    expectedArgs: '<user>',
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

        const result = await punishmentSchema.findOne({
            guildId: guild.id,
            userId,
            type: 'mute'
        })
        if (!result) {
            return `<@${user.id} is not muted in this server.`
        }
        try {
            const member = await guild.members.fetch(userId)
            if (member) {
                const muteRole = guild.roles.cache.find((role) => role.name === 'Muted')
                if (!muteRole) {
                    return 'This server does not have a role named "Muted".'
                }
                member.roles.remove(muteRole)
                await punishmentSchema.findOneAndDelete({
                    guildId: guild.id,
                    userId,
                    type: 'mute'
                })
                member.send(`You have been unmuted in server ${guild.name}!`)
            }
        } catch (ignored) {
            return "Cannot mute that user."
        }
        return `<@${userId}> has been unmuted.`
    },
} as ICommand
import { ICommand } from "wokcommands";

export default {
    category: 'Moderation',
    description: 'Deletes multiple messages.',

    permissions: ['ADMINISTRATOR'],

    maxArgs: 1,
    expectedArgs: '<amount>',

    slash: 'both',
    testOnly: true,
    guildOnly: true,

    callback: async ({message, interaction, channel, args}) => {
        const amount = args.length ? parseInt(args.shift()!) : 10

        if (message) {
            await message.delete()
        }

        const { size } = await channel.bulkDelete(amount, true)

        const reply = `Deleted ${size} message(s).`

        if (interaction) {
            return reply
        }

        channel.send(reply)
    }
} as ICommand
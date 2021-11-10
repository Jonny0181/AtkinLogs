import DiscordJS, { Client, Intents } from 'discord.js'
import dotenv from 'dotenv'
import WOKCommands from 'wokcommands'
import path from 'path'
dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS
    ]
})

client.on('ready', () => {
    console.log('The bot is ready')
    new WOKCommands(client, {
        commandsDir: path.join(__dirname, 'commands'),
        showWarns: true,
        typeScript: true,
        testServers: ['864624899292266526'],
        mongoUri: process.env.MONGO_URI,
    })
    .setDefaultPrefix('a.')
    .setCategorySettings([
        {
            name: 'Moderation',
            emoji: '⚒️',
        },
        {
            name: 'Server Configuration',
            emoji: '🔧',
        },
        {
            name: 'Logging',
            emoji: '📃',
        },
    ])
})

client.login(process.env.TOKEN)
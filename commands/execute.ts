import { ICommand } from "wokcommands";
import { exec } from 'child_process';

export default {
    category: 'Owner',
    description: 'Executes console commands.',
    slash: true,
    testOnly: true,
    ownerOnly: true,
    options: [
        {
            type: 'STRING',
            name: 'command',
            description: 'What are you wanting to send to the console?',
            required: true
        }
    ],
    callback: async ({ message, interaction, args }) => {
        exec(args.join(' '), (error, stdout) => {
            const response = stdout || error
            let msg = message || interaction
            if (message) {
                message.reply(`\`\`\`\n${response}\`\`\``)
            } else {
                interaction.reply(`\`\`\`\n${response}\`\`\``)
            }
        })
    }
} as ICommand
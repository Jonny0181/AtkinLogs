const util = require("../util");

module.exports = {
    name: "skip",
    aliases: ["skipto"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        const skipTo = args[0] ? parseInt(args[0], 10) : null;
        if (!music.player || !music.player.playing) return msg.channel.send("❌ Currently not playing anything.").then(msg => {msg.delete({timeout: 10000})});

        if (!msg.member.voice.channel)
            return msg.channel.send("❌ You must be on a voice channel.").then(msg => {msg.delete({timeout: 10000})});
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`❌ You must be on ${msg.guild.me.voice.channel} to use this command.`).then(msg => {msg.delete({timeout: 10000})});

        if (skipTo !== null && (isNaN(skipTo) || skipTo < 1 || skipTo > music.queue.length))
            return msg.channel.send("❌ Invalid number to skip.").then(msg => {msg.delete({timeout: 10000})});

        try {
            await music.skip(skipTo);
            msg.react("⏭️").catch(e => e);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`).then(msg => {msg.delete({timeout: 10000})});
        }
    }
};

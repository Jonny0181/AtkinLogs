const util = require("../util");

module.exports = {
    name: "stop",
    aliases: ["leave", "dc"],
    exec: async (msg) => {
        const { music } = msg.guild;
        if (!music.player) return msg.channel.send("❌ Currently not playing anything.").then(msg => {msg.delete({timeout: 10000})});
        if (!msg.member.voice.channel)
            return msg.channel.send("❌ You must be on a voice channel.").then(msg => {msg.delete({timeout: 10000})});
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`❌ You must be on ${msg.guild.me.voice.channel} to use this command.`).then(msg => {msg.delete({timeout: 10000})});

        try {
            await music.stop();
            msg.react("⏹️").catch(e => e);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`).then(msg => {msg.delete({timeout: 10000})});
        }
    }
};

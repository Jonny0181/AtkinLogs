const util = require("../util");

module.exports = {
    name: "clearqueue",
    description:"Clean up the queue.",
    aliases: ["clr", "clear"],
    exec: (msg) => {
        const { music } = msg.guild;
        if (!music.player) return msg.channel.send("❌ Currently not playing anything.").then(msg => {msg.delete({timeout: 10000})});
        if (!music.queue.length) return msg.channel.send("❌ Queue is empty.").then(msg => {msg.delete({timeout: 10000})});

        if (!msg.member.voice.channel)
            return msg.channel.send("❌ You must be on a voice channel.");
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`❌ You must be on ${msg.guild.me.voice.channel} to use this command.`).then(msg => {msg.delete({timeout: 10000})});
            
        music.queue.splice(0, 1);
        msg.channel.send("✅ Cleared the queue.").catch(e => e);
    }
};

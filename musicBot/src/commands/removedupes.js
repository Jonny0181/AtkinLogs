const util = require("../util");

module.exports = {
    name: "removedupes",
    aliases: ["rdp"],
    description: "Removes duplicated tracks from the queue.",
    exec: (msg) => {
        const { music } = msg.guild;
        const seen = {};

        if (!music.player) return msg.channel.send("❌ Currently not playing anything.").then(msg => {msg.delete({timeout: 10000})});
        if (!music.queue.length) return msg.channel.send("❌ Queue is empty.").then(msg => {msg.delete({timeout: 10000})});

        if (!msg.member.voice.channel)
            return msg.channel.send("❌ You must be on a voice channel.").then(msg => {msg.delete({timeout: 10000})});
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`❌ You must be on ${msg.guild.me.voice.channel} to use this command.`).then(msg => {msg.delete({timeout: 10000})});
            
        for (const song of music.queue) {
            if (seen[song.info.indentifier] === undefined) seen[song.info.indentifier] = song;
        }
        music.queue = Object.values(seen);
    
        msg.channel.send("✅ Removed all Dupes").then(msg => {msg.delete({timeout: 10000})}).catch(e => e);
    }
};

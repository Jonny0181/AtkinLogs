const util = require("../util");

module.exports = {
    name: "removedupes",
    aliases: ["rdp"],
    description: "Removes duplicated tracks from the queue.",
    exec: (msg) => {
        const { music } = msg.guild;
        const seen = {};

        if (!music.player) return msg.channel.send("❌ Currently not playing anything.");
        if (!music.queue.length) return msg.channel.send("❌ Queue is empty.");

        if (!msg.member.voice.channel)
            return msg.channel.send("❌ You must be on a voice channel.");
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`❌ You must be on ${msg.guild.me.voice.channel} to use this command.`);
            
        for (const song of music.queue) {
            if (seen[song.info.indentifier] === undefined) seen[song.info.indentifier] = song;
        }
        music.queue = Object.values(seen);
    
        msg.channel.send("✅ Removed all Dupes").catch(e => e);
    }
};

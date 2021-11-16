const util = require("../util");

module.exports = {
    name: "remove",
    aliases: ["rm"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send("❌ Currently not playing anything.").then(msg => {msg.delete({timeout: 10000})});
        if (!music.queue.length) return msg.channel.send("❌ Queue is empty.").then(msg => {msg.delete({timeout: 10000})});

        if (!msg.member.voice.channel)
            return msg.channel.send("❌ You must be on a voice channel.").then(msg => {msg.delete({timeout: 10000})});
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`❌ You must be on ${msg.guild.me.voice.channel} to use this command.`).then(msg => {msg.delete({timeout: 10000})});

        if (!args[0]) return msg.channel.send("❌ Missing args.").then(msg => {msg.delete({timeout: 10000})});

        let iToRemove = parseInt(args[0], 10);
        if (isNaN(iToRemove) || iToRemove < 1 || iToRemove > music.queue.length)
            return msg.channel.send("❌ Invalid number to remove.");

        const removed = music.queue.splice(--iToRemove, 1)[0];
        msg.channel.send(`✅ Removed **${removed.info.title}** from the queue.`).then(msg => {msg.delete({timeout: 10000})});
    }
};

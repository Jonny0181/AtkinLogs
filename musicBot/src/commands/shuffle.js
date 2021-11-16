const util = require("../util");

module.exports = {
    name: "shuffle",
    aliases: ["sf"],
    exec: async (msg) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send("❌ Currently not playing anything.").then(msg => {msg.delete({timeout: 10000})});
        if (!music.queue.length) return msg.channel.send("❌ Queue is empty.").then(msg => {msg.delete({timeout: 10000})});
        if (!msg.member.voice.channel)
            return msg.channel.send("❌ You must be on a voice channel.").then(msg => {msg.delete({timeout: 10000})});
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`❌ You must be on ${msg.guild.me.voice.channel} to use this command.`).then(msg => {msg.delete({timeout: 10000})});

        music.queue = util.shuffleArray(music.queue);

        msg.channel.send(`✅ Queue shuffled! Type \`${msg.client.prefix}queue\` to see changes.`).then(msg => {msg.delete({timeout: 10000})});
    }
};

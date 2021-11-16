const util = require("../util");

const durationPattern = /^[0-5]?[0-9](:[0-5][0-9]){1,2}$/;

module.exports = {
    name: "seek",
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!music.player || !music.player.playing) return msg.channel.send("❌ Currently not playing anything.").then(msg => {msg.delete({timeout: 10000})});
        if (!msg.member.voice.channel)
            return msg.channel.send("❌ You must be on a voice channel.").then(msg => {msg.delete({timeout: 10000})});
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`❌ You must be on ${msg.guild.me.voice.channel} to use this command.`).then(msg => {msg.delete({timeout: 10000})});

        if (!music.current.info.isSeekable)
            return msg.channel.send("❌ Current track isn't seekable.").then(msg => {msg.delete({timeout: 10000})});

        const duration = args[0];
        if (!duration)
            return msg.channel.send("❌ You must provide duration to seek. Valid duration e.g. `1:34`.").then(msg => {msg.delete({timeout: 10000})});
        if (!durationPattern.test(duration))
            return msg.channel.send("❌ You provided an invalid duration. Valid duration e.g. `1:34`.").then(msg => {msg.delete({timeout: 10000})});

        const durationMs = util.durationToMillis(duration);
        if (durationMs > music.current.info.length)
            return msg.channel.send("❌ The duration you provide exceeds the duration of the current track.").then(msg => {msg.delete({timeout: 10000})});

        try {
            await music.player.seek(durationMs);
            msg.channel.send(`✅ Seeked to ${util.millisToDuration(durationMs)}.`).then(msg => {msg.delete({timeout: 10000})});
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`).then(msg => {msg.delete({timeout: 10000})});
        }
    }
};

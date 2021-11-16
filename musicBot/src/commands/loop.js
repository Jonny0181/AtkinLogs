const util = require("../util");

const modes = ["none", "track", "queue"];
const aliases = {
    single: "track",
    track: "track",
    song: "track",
    this: "track",
    current: "track",
    all: "queue",
    every: "queue",
    queue: "queue",
    off: "none",
    none: "none",
    nothing: "none"
};

module.exports = {
    name: "loop",
    aliases: ["repeat"],
    exec: (msg, args) => {
        const { music } = msg.guild;
        if (!music.player) return msg.channel.send("❌ Currently not playing anything.").then(msg => {msg.delete({timeout: 10000})});
        if (args[0]) {
            if (!msg.member.voice.channel)
                return msg.channel.send("❌ You must be on a voice channel.").then(msg => {msg.delete({timeout: 10000})});
            if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
                return msg.channel.send(`❌ You must be on ${msg.guild.me.voice.channel} to use this command.`).then(msg => {msg.delete({timeout: 10000})});

            const loopMode = aliases[args[0].toLowerCase()];
            if (loopMode && modes.includes(loopMode)) {
                music.loop = modes.indexOf(loopMode);
                msg.channel.send(music.loop === 0 ? "✅ | Loop disabled." : `✅ | Set loop to ${modes[music.loop]}.`);
            } else {
                msg.channel.send("❌ Invalid loop mode. Try single/all/off.");
            }
        } else {
            msg.channel.send(`✅ Current loop mode: ${modes[music.loop]}`);
        }
    }
};

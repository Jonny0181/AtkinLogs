const util = require("../util");

module.exports = {
    name: "volume",
    aliases: ["vol"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        const newVolume = parseInt(args[0], 10);
        if (!music.player || !music.player.playing) return msg.channel.send("❌ Currently not playing anything.").then(msg => {msg.delete({timeout: 10000})});
        try {
            if (isNaN(newVolume)) {
                msg.channel.send(`🔉 Current volume \`${music.volume}\`.`);
            } else {
                if (!msg.member.voice.channel)
                    return msg.channel.send("❌ You must be on a voice channel.").then(msg => {msg.delete({timeout: 10000})});
                if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
                    return msg.channel.send(`❌ You must be on ${msg.guild.me.voice.channel} to use this command.`).then(msg => {msg.delete({timeout: 10000})});

                if (newVolume < 0 || newVolume > 100)
                    return msg.channel.send("❌ You can only set the volume from 0 to 100.").then(msg => {msg.delete({timeout: 10000})});

                await music.setVolume(newVolume);
                msg.channel.send(`🔉 Volume set to \`${music.volume}\`.`);
            }
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`).then(msg => {msg.delete({timeout: 10000})});
        }
    }
};

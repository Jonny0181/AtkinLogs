const util = require("../util");

module.exports = {
    name: "volume",
    aliases: ["vol"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        const newVolume = parseInt(args[0], 10);
        if (!music.player || !music.player.playing) return msg.channel.send("❌ Currently not playing anything.");
        try {
            if (isNaN(newVolume)) {
                msg.channel.send(`🔉 Current volume \`${music.volume}\`.`);
            } else {
                if (!msg.member.voice.channel)
                    return msg.channel.send("❌ You must be on a voice channel.");
                if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
                    return msg.channel.send(`❌ You must be on ${msg.guild.me.voice.channel} to use this command.`);

                if (newVolume < 0 || newVolume > 150)
                    return msg.channel.send("❌ You can only set the volume from 0 to 150.");

                await music.setVolume(newVolume);
                msg.channel.send(`🔉 Volume set to \`${music.volume}\`.`);
            }
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`);
        }
    }
};

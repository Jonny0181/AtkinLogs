const util = require("../util");

const getAttachmentURL = (msg) => (msg.attachments.first() || {}).url;

module.exports = {
    name: "play",
    aliases: ["p"],
    exec: async (msg, args) => {
        const { music } = msg.guild;
        if (!msg.member.voice.channel)
            return msg.channel.send("❌ You must be on a voice channel.").then(msg => {msg.delete({timeout: 10000})});
        if (msg.guild.me.voice.channel && !msg.guild.me.voice.channel.equals(msg.member.voice.channel))
            return msg.channel.send(`❌ You must be on ${msg.guild.me.voice.channel} to use this command.`).then(msg => {msg.delete({timeout: 10000})});

        const missingPerms = util.missingPerms(msg.guild.me.permissionsIn(msg.member.voice.channel), ["CONNECT", "SPEAK"]);
        if ((!music.player || !music.player.playing) && missingPerms.length)
            return msg.channel.send(`❌ I need ${missingPerms.length > 1 ? "these" : "this"} permission${missingPerms.length > 1 ? "s" : ""} on your voice channel: ${missingPerms.map(x => `\`${x}\``).join(", ")}.`).then(msg => {msg.delete({timeout: 10000})});

        if (!music.node || !music.node.connected)
            return msg.channel.send("❌ Lavalink node not connected.").then(msg => {msg.delete({timeout: 10000})});

        const query = args.join(" ") || getAttachmentURL(msg);
        if (!query) return msg.channel.send("❌ Missing args.").then(msg => {msg.delete({timeout: 10000})});

        try {
            const { loadType, playlistInfo: { name }, tracks } = await music.load(util.isValidURL(query) ? query : `ytsearch:${query}`);
            if (!tracks.length) return msg.channel.send("❌ Couldn't find any results.").then(msg => {msg.delete({timeout: 10000})});
            
            if (loadType === "PLAYLIST_LOADED") {
                for (const track of tracks) {
                    track.requester = msg.author;
                    music.queue.push(track);
                }
                msg.channel.send(`✅ Loaded \`${tracks.length}\` tracks from **${name}**.`).then(msg => {msg.delete({timeout: 10000})});
            } else {
                const track = tracks[0];
                track.requester = msg.author;
                music.queue.push(track);
                if (music.player && music.player.playing)
                    msg.channel.send(`✅ **${track.info.title}** added to the queue.`).then(msg => {msg.delete({timeout: 10000})});
            }
            
            if (!music.player) {
                await music.join(msg.member.voice.channel);
                const newVolume = parseInt(10, 10);
                await music.setVolume(newVolume)
            }
            if (!music.player.playing) await music.start();

            music.setTextCh(msg.channel);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`).then(msg => {msg.delete({timeout: 10000})});
        }
    }
};

const util = require("../util");

module.exports = {
    name: "search",
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

        const query = args.join(" ");
        if (!query) return msg.channel.send("❌ Missing args.").then(msg => {msg.delete({timeout: 10000})});

        try {
            let { tracks } = await music.load(`ytsearch:${query}`);
            if (!tracks.length) return msg.channel.send("❌ Couldn't find any results.").then(msg => {msg.delete({timeout: 10000})});

            tracks = tracks.slice(0, 10);

            const resultMessage = await msg.channel.send(util.embed()
                .setAuthor("Search Result", msg.client.user.displayAvatarURL())
                .setDescription(tracks.map((x, i) => `\`${++i}.\` **${x.info.title}**`))
                .setFooter("Select from 1 to 10 or type \"cancel\" to cancel the command."));

            const collector = await awaitMessages();
            if (!collector) return resultMessage.edit("❌ Time is up!");
            const response = collector.first();

            if (response.deletable) response.delete();

            if (/^cancel$/i.exec(response.content))
                return resultMessage.edit("✅ Cancelled.");

            const track = tracks[response.content - 1];
            track.requester = msg.author;
            music.queue.push(track);

            if (music.player && music.player.playing) {
                resultMessage.edit(util.embed().setDescription(`✅ | **${track.info.title}** added to the queue.`));
            } else {
                resultMessage.delete();
            }

            if (!music.player) await music.join(msg.member.voice.channel);
            if (!music.player.playing) await music.start();

            music.setTextCh(msg.channel);
        } catch (e) {
            msg.channel.send(`An error occured: ${e.message}.`).then(msg => {msg.delete({timeout: 10000})});
        }

        async function awaitMessages() {
            try {
                const collector = await msg.channel.awaitMessages(
                    m => m.author.equals(msg.author) && (/^cancel$/i.exec(m.content) || (!isNaN(parseInt(m.content, 10)) && (m.content >= 1 && m.content <= 10))),
                    {
                        time: 10000,
                        max: 1,
                        errors: ["time"]
                    }
                );
                return collector;
            } catch {
                return null;
            }
        }
    }
};

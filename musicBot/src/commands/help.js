const util = require("../util");

const unlisted = ["eval", "source"];

module.exports = {
    name: "help",
    aliases: ["commands", "?"],
    exec: (msg) => {

        
        let text = `__**Atkin Family Music Commands**__

\`am.clearqueue/am.clr\`   **-   Removes all songs from the current queue.**
\`am.help\`   **-   Shows this message right here.**
\`am.loop\`   **-   Sets the desired loop.**
\`am.lyrics\`   **-   Fetches the lyrics for the current song.**
\`am.move\`   **-   Moves the song to a desired location in queue.**
\`am.nowplaying/am.np\`   **-   Shows the current song playing.**
\`am.pause\`   **-   Pauses the current song.**
\`am.play/am.p\`   **-   Plays a song using link or name. You can also queue YouTube playlists.**
\`am.previous/am.prev\`   **-   Returns to playing the previous song.**
\`am.queue/am.q\`   **-   Shows the current songs that are in the queue.**
\`am.remove/am.rm\`  **-   Remove the song from the queue.**
\`am.removedupes/am.rdp\`   **-   Removes all duplicate songs from the queue.**
\`am.resume\`   **-   Resumes the music from being paused.**
\`am.search\`   **-   Searches for a song with specified search query.**
\`am.seek\`   **-   Moves the current position of the playing song to a specified time.**
\`am.shuffle\`   **-   Shuffles the queue into a random order.**
\`am.skip\`   **-   Skips the current playing song and starts playing the next song.**
\`am.stop\`   **-   Stops all playing music and leaves the voice channel.**
\`am.volume\`   **-   Changes the volume of the player.**`


        msg.channel.send(text)
    }
};

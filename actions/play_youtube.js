module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------

    name: "Play YouTube Video",

    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------

    section: "Audio Control",

    //---------------------------------------------------------------------
    // Requires Audio Libraries
    //
    // If 'true', this action requires audio libraries to run.
    //---------------------------------------------------------------------

    requiresAudioLibraries: true,

    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------

    subtitle: function (data) {
        return `${data.url}`;
    },

    //---------------------------------------------------------------------
    // DBM Mods Manager Variables (Optional but nice to have!)
    //
    // These are variables that DBM Mods Manager uses to show information
    // about the mods for people to see in the list.
    //---------------------------------------------------------------------

    // Who made the mod (If not set, defaults to "DBM Mods")
    author: "DBM, TheMonDon, others?",

    // The version of the mod (Defaults to 1.0.0)
    version: "1.9.6",
    version2: "1.0.2", // Just to keep track of this version compared to mod pack version

    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "Gets extra video information on YouTube based on video ID.",

    // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

    //---------------------------------------------------------------------

    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------

    fields: ["url", "seek", "volume", "passes", "bitrate", "type"],

    //---------------------------------------------------------------------
    // Command HTML
    //
    // This function returns a string containing the HTML used for
    // editting actions. 
    //
    // The "isEvent" parameter will be true if this action is being used
    // for an event. Due to their nature, events lack certain information, 
    // so edit the HTML to reflect this.
    //
    // The "data" parameter stores constants for select elements to use. 
    // Each is an array: index 0 for commands, index 1 for events.
    // The names are: sendTargets, members, roles, channels, 
    //                messages, servers, variables
    //---------------------------------------------------------------------

    html: function (isEvent, data) {
        return `
        <div>
            <p>This action has been modified by DBM Mods.</p>
        </div>
        <div>
            YouTube URL:<br>
            <input id="url" class="round" type="text" value="https://www.youtube.com/watch?v=2zgcFFvEA9g"><br>
        </div>
        <div style="float: left; width: 50%;">
            Seek Position:<br>
            <input id="seek" class="round" type="text" value="0"><br>
            Passes:<br>
            <input id="passes" class="round" type="text" value="1">
        </div>
        <div style="float: right; width: 50%;">
            Volume (0 = min; 100 = max):<br>
            <input id="volume" class="round" type="text" placeholder="Leave blank for automatic..."><br>
            Bitrate:<br>
            <input id="bitrate" class="round" type="text" placeholder="Leave blank for automatic...">
        </div><br><br><br><br><br><br><br>
        <div>
            Play Type:<br>
            <select id="type" class="round" style="width: 90%;">
                <option value="0" selected>Add to Queue</option>
                <option value="1">Play Immediately</option>
            </select>
        </div>`;
    },

    //---------------------------------------------------------------------
    // Action Editor Init Code
    //
    // When the HTML is first applied to the action editor, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------

    init: function () {},

    //---------------------------------------------------------------------
    // Action Bot Function
    //
    // This is the function for the action within the Bot's Action class.
    // Keep in mind event calls won't have access to the "msg" parameter, 
    // so be sure to provide checks for variable existance.
    //---------------------------------------------------------------------

    action: async function (cache) {
        const data = cache.actions[cache.index];
        const Audio = this.getDBM()
            .Audio;
        const WrexMods = this.getWrexMods();
        const ytdl = WrexMods.require('ytdl-core');
        const getInfoAsync = WrexMods.require('util')
            .promisify(ytdl.getInfo);
        const url = this.evalMessage(data.url, cache);
        const msg = cache.msg;
        const options = {};

        if (url) {

            if (data.seek) {
                options.seek = parseInt(this.evalMessage(data.seek, cache));
            }
            if (data.volume) {
                options.volume = parseInt(this.evalMessage(data.volume, cache)) / 100;
            } else if (cache.server) {
                options.volume = Audio.volumes[cache.server.id] || 0.5;
            } else {
                options.volume = 0.5;
            }
            if (data.passes) {
                options.passes = parseInt(this.evalMessage(data.passes, cache));
            }
            if (data.bitrate) {
                options.bitrate = parseInt(this.evalMessage(data.bitrate, cache));
            } else {
                options.bitrate = 'auto';
            }
            options.requester = msg.author;

            const video = await getInfoAsync(url)
                .catch((err) => {
                    console.error(`Error with getInfoAsync in play_youtube: ${err}`);
                });
            options.title = video.title;
            options.duration = parseInt(video.length_seconds);
            options.thumbnail = video.player_response.videoDetails.thumbnail.thumbnails[3].url;

            const info = ['yt', options, url];
            if (data.type === "0") {
                Audio.addToQueue(info, cache);
            } else if (cache.server && cache.server.id !== undefined) {
                Audio.playItem(info, cache.server.id);
            }
        }
        this.callNextAction(cache);
    },

    //---------------------------------------------------------------------
    // Action Bot Mod
    //
    // Upon initialization of the bot, this code is run. Using the bot's
    // DBM namespace, one can add/modify existing functions if necessary.
    // In order to reduce conflictions between mods, be sure to alias
    // functions you wish to overwrite.
    //---------------------------------------------------------------------

    mod: function (DBM) {}

}; // End of module

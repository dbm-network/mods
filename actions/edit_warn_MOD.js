const fs = require('fs');
module.exports = {
    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------

    name: "Edit Warn Reason",

    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------

    section: "Warn Management",

    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------

    subtitle(data, presets) {
        return '';
    },

    //---------------------------------------------------------------------
    // Action Storage Function
    //
    // Stores the relevant variable info for the editor.
    //---------------------------------------------------------------------

    variableStorage(data, varType) {},

    //---------------------------------------------------------------------
    // Action Meta Data
    //
    // Helps check for updates and provides info if a custom mod.
    // If this is a third-party mod, please set "author" and "authorUrl".
    //
    // It's highly recommended "preciseCheck" is set to false for third-party mods.
    // This will make it so the patch version (0.0.X) is not checked.
    //---------------------------------------------------------------------

    meta: { version: "2.0.9", preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },

    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------

    fields: ["warnId", "reason"],

    //---------------------------------------------------------------------
    // Command HTML
    //
    // This function returns a string containing the HTML used for
    // editing actions.
    //
    // The "isEvent" parameter will be true if this action is being used
    // for an event. Due to their nature, events lack certain information,
    // so edit the HTML to reflect this.
    //---------------------------------------------------------------------

    html(isEvent, data) {
        return `
<div style="height: 350px;overflow-y: scroll !important;">
    <div style="...">
        <p>DBM warn system made by Finbar#0001<br> 
        <a href="#" onclick="require('child_process').execSync('start https://github.com/OneAndonlyFinbar/DBM-Warn-System')">Github</a><br>
        <a href="#" onclick="require('child_process').execSync('start https://ko-fi.com/thefinbar')">Support me</a></p>
    </div><br>
    <div style="...">
        Warn ID or Warn Object:<br>
        <input id="warnId" class="round" type="text"><br><br<br>
        <textarea id="reason" class="round" style="width: 100%; resize: none; height: 200px;" rows="8" cols="19"></textarea><br><br>
    </div>
</div>`;
    },

    //---------------------------------------------------------------------
    // Action Editor Init Code
    //
    // When the HTML is first applied to the action editor, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------

    init() {
        const { glob, document } = this;
    },

    //---------------------------------------------------------------------
    // Action Bot Function
    //
    // This is the function for the action within the Bot's Action class.
    // Keep in mind event calls won't have access to the "msg" parameter,
    // so be sure to provide checks for variable existence.
    //---------------------------------------------------------------------

    async action(cache) {
        const data = cache.actions[cache.index];
        const varName = this.evalMessage(data.varName, cache);
        const storage = parseInt(data.storage, 10);
        const reason = this.evalMessage(data.reason, cache);
        const warnId2 = this.evalMessage(data.warnId, cache);

        try{
            require('json-simplified');
        }catch{
            console.log('WarnManagerError: Required packages not installed, run npm i json-simplified');
            return this.callNextAction(cache);
        }

        let warnId;
        try{
            warnId = JSON.parse(warnId2)?.id
        }catch{
            warnId = warnId2;
        }

        const { Database } = require('json-simplified');
        const fs = require('fs');

        if(!fs.existsSync('./warns')) fs.mkdirSync('./warns');

        const warnFiles = fs.readdirSync('./warns');
        for(const guildId in warnFiles){
            let members = JSON.parse(fs.readFileSync(`./warns/${warnFiles[guildId]}`, 'utf8'));
            for(let member in members){
                const warns = members[member];
                for(let warn in warns) if(warns[warn].id === warnId) {
                    warns[warn].reason = reason;
                    fs.writeFileSync(`./warns/${warnFiles[guildId]}`, JSON.stringify(members));
                }
            }
        }

        this.callNextAction(cache);
    },

    //---------------------------------------------------------------------
    // Action Bot Mod
    //
    // Upon initialization of the bot, this code is run. Using the bot's
    // DBM namespace, one can add/modify existing functions if necessary.
    // In order to reduce conflicts between mods, be sure to alias
    // functions you wish to overwrite.
    //---------------------------------------------------------------------

    mod() {}
};

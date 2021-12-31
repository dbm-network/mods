const fs = require('fs');
module.exports = {
    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------

    name: "Store Warn Info",

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
        const types = [
            'Warn ID',
            'Warn Reason',
            'Warn Date',
            'Warn Moderator ID',
            'Warn Member ID',
            'Warn Guild ID',
            'Warn Object'
        ];
        return `${types[parseInt(data.type)]}`;
    },

    //---------------------------------------------------------------------
    // Action Storage Function
    //
    // Stores the relevant variable info for the editor.
    //---------------------------------------------------------------------

    variableStorage(data, varType) {
        let type;
        switch(data.type){
            case '0':
                type = 'Warn ID';
                break;
            case '1':
                type = 'Warn Reason';
                break;
            case '2':
                type = 'Warn Date';
                break;
            case '3':
                type = 'Warn Moderator ID';
                break;
            case '4':
                type = 'Warn Member ID';
                break;
            case '5':
                type = 'Warn Guild ID';
                break;
            case '6':
                type = 'Object';
                break;
        }
        return [data.varName, type];
    },

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

    fields: ["warnId", "storage", "varName", "type"],

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
        <select id="type" class="round" style="width: 60%">
            <option value="0">Warn ID</option>
            <option value="1">Reason</option>
            <option value="2">Date</option>
            <option value="3">Moderator ID</option>
            <option value="4">Member ID</option>
            <option value="5">Guild ID</option>
            <option value="6">Warn Object</option>
        </select><br>
        <store-in-variable dropdownLabel="Store In:" selectId="storage" variableContainerId="varNameContainer3" variableInputId="varName"></store-in-variable>
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
        const type = parseInt(data.type, 10);
        const warnId2 = this.evalMessage(data.warnId, cache);

        let warnId;
        try{
            warnId = JSON.parse(warnId2)?.id
        }catch{
            warnId = warnId2;
        }

        try{
            require('json-simplified');
        }catch{
            console.log('WarnManagerError: Required packages not installed, run npm i json-simplified');
            return this.callNextAction(cache);
        }

        const { Database } = require('json-simplified');
        const fs = require('fs');

        if(!fs.existsSync('./warns')) fs.mkdirSync('./warns');

        const warnFiles = fs.readdirSync('./warns');
        for(const guildId in warnFiles){
            let members = JSON.parse(fs.readFileSync(`./warns/${warnFiles[guildId]}`, 'utf8'));
            for(let member in members){
                const warns = members[member];
                for(let warn in warns) {
                    if(warns[warn]?.id === warnId) {
                        switch(type){
                            case 0:
                                this.storeValue(warnId, storage, varName, cache);
                                break;
                            case 1:
                                this.storeValue(warns[warn].reason, storage, varName, cache);
                                break;
                            case 2:
                                this.storeValue(warns[warn].date, storage, varName, cache);
                                break;
                            case 3:
                                this.storeValue(warns[warn].issuer, storage, varName, cache);
                                break;
                            case 4:
                                this.storeValue(warns[warn].member, storage, varName, cache);
                                break;
                            case 5:
                                this.storeValue(warns[warn].guild, storage, varName, cache);
                                break;
                            case 6:
                                this.storeValue(warns[warn], storage, varName, cache);
                                break;
                        }
                    }
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

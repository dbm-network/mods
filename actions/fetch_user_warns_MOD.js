const fs = require('fs');
module.exports = {
    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------

    name: "Fetch User Warns",

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
        let server;
        let member;
        switch(parseInt(data.server, 10)){
            case 0:
                server = 'Current Server';
                break;
            case 1:
                server = 'Temp Variable';
                break;
            case 2:
                server = 'Server Variable';
                break;
            case 3:
                server = 'Global Variable';
                break;
            case 100:
                server = 'Server (by Name)';
                break;
            case 101:
                server = 'Server (by ID)';
                break;
            default:
                server = 'none';
                break;
        }
        switch(parseInt(data.member, 10)){
            case 0:
                member = 'Mentioned User';
                break;
            case 1:
                member = 'Command User';
                break;
            case 2:
                member = 'Temp Variable';
                break;
            case 3:
                member = 'Server Variable';
                break;
            case 4:
                member = 'Global Variable';
                break;
            case 5:
                member = 'Slash Command Parameter';
                break;
            case 6:
                member = 'Interacted User';
                break;
            case 100:
                member = 'User (by Name)';
                break;
            case 101:
                member = 'User (by ID)';
                break;
            default:
                member = 'None';
                break;
        }
        return `${server} - ${member}`;
    },

    //---------------------------------------------------------------------
    // Action Storage Function
    //
    // Stores the relevant variable info for the editor.
    //---------------------------------------------------------------------

    variableStorage(data, varType) {
        return [data.varName, 'List Of Warns'];
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

    fields: ["server", "serverStorage", "member", "memberStorage", "storage", "varName"],

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
        <server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer" variableInputId="serverStorage"></server-input><br><br><br><br>
        <member-input dropdownLabel="Source Member" selectId="member" variableContainerId="varNameContainer2" variableInputId="memberStorage"></member-input><br><br><br><br>
        <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer3" variableInputId="varName"></store-in-variable>
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
        const guild = this.evalMessage(data.serverStorage, cache);
        const member = this.evalMessage(data.memberStorage, cache);

        try{
            require('json-simplified');
        }catch{
            console.log('WarnManagerError: Required packages not installed, run npm i json-simplified');
            return this.callNextAction(cache);
        }

        if(guild?.length === 0 || !guild){
            console.log('WarnManagerError: Invalid guild.');
            return this.callNextAction(cache);
        }

        const { Database } = require('json-simplified');
        const fs = require('fs');

        if(!fs.existsSync('./warns')) fs.mkdirSync('./warns');

        const db = new Database(guild, {registry: './warns'});

        if(member){
            let parsed = [];
            let warns = await db.get(member);
            warns.forEach(warn => {
                if(warn) parsed.push(JSON.stringify(warn));
            })
            this.storeValue(parsed, storage, varName, cache);
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

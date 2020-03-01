module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------
    
    name: "Check If Command Exists",
    
    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------
    
    section: "Conditions",
    
        
    //---------------------------------------------------------------------
    // DBM Mods Manager Variables (Optional but nice to have!)
    //
    // These are variables that DBM Mods Manager uses to show information
    // about the mods for people to see in the list.
    //---------------------------------------------------------------------
    
    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------
    
    subtitle: function(data) {
        const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions"];
        return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
    },
    
    // Who made the mod (If not set, defaults to "DBM Mods")
    author: "Cap",
    
    // The version of the mod (Last edited version number of DBM Mods)
    version: "1.9.6", //Added in 1.9.6
    
    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "Check if such a command exists.",
    
    // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
    // Uncomment if you need this. Also, replace WrexMODS if needed.
    depends_on_mods: ["WrexMODS"],

    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------
    
    fields: ["commandName", "iftrue", "iftrueVal", "iffalse", "iffalseVal"],
    
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
    
    html: function(isEvent, data) {
        return `
        <div>
            <p>
                <u>Mod Info:</u><br>
                Created by ${this.author}
            </p>
        </div><br>
        <div style="width: 45%">
            Command Name:<br>
            <input id="commandName" type="text" class="round">
        </div><br>
        <div>
            ${data.conditions[0]}
        </div>
        `
    },
    
    //---------------------------------------------------------------------
    // Action Editor Init Code
    //
    // When the HTML is first applied to the action editor, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------
    
    init: function() {
        const {glob, document} = this;
        
        glob.onChangeTrue(document.getElementById('iftrue'));
        glob.onChangeFalse(document.getElementById('iffalse'));
    },
    
    //---------------------------------------------------------------------
    // Action Bot Function
    //
    // This is the function for the action within the Bot's Action class.
    // Keep in mind event calls won't have access to the "msg" parameter, 
    // so be sure to provide checks for variable existance.
    //---------------------------------------------------------------------
    
    action: function(cache) {
        const data = cache.actions[cache.index];

        const fs = require("fs");
        const jp = this.getWrexMods().require("jsonpath");

        let commandName = this.evalMessage(data.commandName, cache);

        if (commandName.startsWith(cache.server.tag)) {
            commandName = commandName.slice(cache.server.tag.length).split(/ +/).shift();
        }

        else if (commandName.startsWith(this.getDBM().Files.data.settings.tag)) {
            commandName = commandName.slice(this.getDBM().Files.data.settings.tag.length).split(/ +/).shift();
        }

        const commandsFile = JSON.parse(fs.readFileSync("./data/commands.json", "utf-8"));
        const commands = jp.query(commandsFile, "$[*].name");
        const commandsAliases = jp.query(commandsFile, "$[*]._aliases");

        let result;

        if (commandName === "") {
            console.log("Please put something in 'Command Name' in the 'Check If Command Exists' action...");
            return;
        }

        // Work around that works =D LOL (I did it to improve the search). includes() Is really pretty bad ~~Cap...

        const check = commands.indexOf(commandName);
        const check2 = commandsAliases.indexOf(commandName);

        if (check !== -1) {
            result = true;
        }

        else if (check2 !== -1) {
            result = true;
        }

        else {
            result = false;
        }

        this.executeResults(result, data, cache);
    },
    
    //---------------------------------------------------------------------
    // Action Bot Mod
    //
    // Upon initialization of the bot, this code is run. Using the bot's
    // DBM namespace, one can add/modify existing functions if necessary.
    // In order to reduce conflictions between mods, be sure to alias
    // functions you wish to overwrite.
    //---------------------------------------------------------------------
    
    mod: function(DBM) {
    }
    
    }; // End of module
    

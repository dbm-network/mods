module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------
    
    name: "Store Command Info",
    
    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------
    
    section: "Bot Client Control",
    
        
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
        const info = ['Command Name', 'Command ID', 'Command Type', 'Command Restriction', 'Command User Required Permission', 'Command Aliases', 'Command Time Restriction', 'Command Actions Length'];
        const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
        return `${info[parseInt(data.info)]} - ${storage[parseInt(data.storage)]}`;
    },
    
    // Who made the mod (If not set, defaults to "DBM Mods")
    author: "Cap",
    
    // The version of the mod (Last edited version number of DBM Mods)
    version: "1.9.7", //Added in 1.9.7
    
    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "See information for some command.",
    
    // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
    // Uncomment if you need this. Also, replace WrexMODS if needed.
    depends_on_mods: ["WrexMODS"],
    
    
    //---------------------------------------------------------------------
    // Action Storage Function
    //
    // Stores the relevant variable info for the editor.
    //---------------------------------------------------------------------
    
    variableStorage: function (data, varType) {
        const type = parseInt(data.storage);
        if (type !== varType) return;
        let dataType = 'Unknown Type';
        switch(parseInt(data.info)) {
            case 0:
            case 1:
            case 2:
            case 3:
            case 4:
                dataType = "Text";
                break;
            case 5:
                dataType = "List";
                break;
            case 6:
            case 7:
                dataType = "Number"
                break;
        }
        return ([data.varName, dataType]);
    },
    
    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------
    
    fields: ["searchCommandBy", "valueToSearch", "info", "storage", "varName"],
    
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
            Created by ${this.author}<br>
            Idea by A1berti
        </p>
    </div><br>
    <div style="float: left; width: 40%">
        Search Command By:<br>
        <select id="searchCommandBy" class="round" onchange="glob.onChangeSame(this)">
            <option value="0">Name</option>
            <option value="1">ID</option>
            <option value="2" selected>None (Same Command)</option>
        </select>
    </div>
    <div id="vtsContainer" style="display: none; float: right; width: 55%">
        Value To Search:<br>
        <input id="valueToSearch" type="text" class="round">
    </div><br><br><br>
    <div style="float: left; width: 48%; padding-top: 8px">
        Source Info:<br>
        <select id="info" class="round">
            <option value="0" selected>Command Name</option>
            <option value="1">Command ID</option>
            <option value="2">Command Type</option>
            <option value="3">Command Restriction</option>
            <option value="4">Command User Required Permission</option>
            <option value="5">Command Aliases</option>
            <option value="6">Command Time Restriction</option>
            <option value="7">Command Actions Length</option>
        </select>
    </div><br><br><br>
    <div style="float: left; width: 35%; padding-top: 12px">
        Store In:<br>
        <select id="storage" class="round">
            ${data.variables[1]}
        </select>
    </div>
    <div id="varNameContainer" style="float: right; width: 60%; padding-top: 12px">
        Variable Name:<br>
        <input id="varName" class="round" type="text">
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

        glob.onChangeSame = function(searchCommandBy) {
            if (parseInt(searchCommandBy.value) === 2) {
                document.getElementById("vtsContainer").style.display = "none";
            }
            
            else {
                document.getElementById("vtsContainer").style.display = null;
            }
        }

        glob.onChangeSame(document.getElementById("searchCommandBy"));
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
        const jp = this.getWrexMods().require("jsonpath");

        const command = parseInt(data.searchCommandBy) === 0 ? jp.query(this.getDBM().Files.data.commands, `$..[?(@.name=="${this.evalMessage(data.valueToSearch, cache)}")]`) : parseInt(data.searchCommandBy) === 1 ? jp.query(this.getDBM().Files.data.commands, `$..[?(@._id=="${this.evalMessage(data.valueToSearch, cache)}")]`) : jp.query(this.getDBM().Files.data.commands, `$..[?(@.name=="${cache.msg.content.slice(this.getDBM().Files.data.settings.tag.length || cache.server.tag.length).split(/ +/).shift()}")]`);

        let result;
        switch(parseInt(data.info)) {
            case 0:
                result = jp.query(command, "$..name").length > 1 ? jp.query(command, "$..name")[0] : jp.query(command, "$..name");
                break;
            case 1:
                result = jp.query(command, "$.._id");
                break;
            case 2:
                result = jp.query(command, "$..comType") == 0 || "" ? "Normal Command" : jp.query(command, "$..comType") == 1 ? "Includes Word" : jp.query(command, "$..comType") == 2 ? "Matches Regular Expression" : "Any Message";
                break;
            case 3:
                result = jp.query(command, "$..restriction") == 0 ? "none" : jp.query(command, "$..restriction") == 1 ? "Server Only" : jp.query(command, "$..restriction") == 2 ? "Owner Only": jp.query(command, "$..restriction") == 3 ? "DMs Only" : "Bot Owner Only";
                break;
            case 4:
                result = JSON.stringify(jp.query(command, "$..permissions")).slice(2, -2).replace("_", " ").toLowerCase();
                break;
            case 5:
                result = jp.query(command, "$.._aliases") == "" ? "none" : jp.query(command, "$.._aliases");
                break;
            case 6:
                result = jp.query(command, "$.._timeRestriction") == "" ? "none" : parseInt(jp.query(command, "$.._timeRestriction"));
                break;
            case 7:
                result = parseInt(jp.query(command, "$..name").length) - 1 == "" ? "none" : parseInt(jp.query(command, "$..name").length) - 1;
                break;
            }

            if (!result) {
                result = "invalid";
            }

            if (result !== undefined) {
                const storage = parseInt(data.storage);
                const varName = this.evalMessage(data.varName, cache);
                this.storeValue(result, storage, varName, cache);
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
    
    mod: function(DBM) {
    }
    
    }; // End of module
    

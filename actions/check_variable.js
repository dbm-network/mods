module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------

    name: "Check Variable MOD",

    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------

    section: "Conditions",

    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------

    subtitle: function(data) {
        const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions"];
        return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
    },

    //---------------------------------------------------------------------
		// DBM Mods Manager Variables (Optional but nice to have!)
		//
		// These are variables that DBM Mods Manager uses to show information
		// about the mods for people to see in the list.
		//---------------------------------------------------------------------

		// Who made the mod (If not set, defaults to "DBM Mods")
		author: "EGGSY",

    // The version of the mod (Defaults to 1.0.0)
    version: "1.8.6", //Added in 1.8.6

    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "Check variables with more options.",

    // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


    //---------------------------------------------------------------------

    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------

    fields: ["storage", "varName", "comparison", "value", "iftrue", "iftrueVal", "iffalse", "iffalseVal"],

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
            Created by EGGSY!
        </p>
    <div>
        <div style="float: left; width: 35%;">
            Variable:<br>
            <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
                ${data.variables[1]}
            </select>
        </div>
        <div id="varNameContainer" style="float: right; width: 60%;">
            Variable Name:<br>
            <input id="varName" class="round" type="text" list="variableList">
        </div>
    </div><br><br><br>
    <div style="padding-top: 8px;">
        <div style="float: left; width: 45%;">
            Comparison Type:<br>
            <select id="comparison" class="round" onchange="glob.onChange1(this)">
                <option value="0" selected>Length is Bigger Than</option>
                <option value="1">Length is Smaller Than</option>
                <option value="2">Length Equals</option>
            </select>
        </div>
        <div style="float: right; width: 50%;" id="directValue">
            Value to Compare to:<br>
            <input id="value" class="round" type="text" name="is-eval">
        </div>
    </div><br><br><br>
    <div style="padding-top: 8px;">
        ${data.conditions[0]}
    </div>`
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

        glob.refreshVariableList(document.getElementById('storage'));
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
        const type = parseInt(data.storage);
        const varName = this.evalMessage(data.varName, cache);
        const variable = this.getVariable(type, varName, cache);
        let result = false;
        if(variable) {
            const val1 = variable;
            const compare = parseInt(data.comparison);
            let val2 = this.evalMessage(data.value, cache);
            if(compare !== 6) val2 = this.eval(val2, cache);
            if(val2 === false) val2 = this.evalMessage(data.value, cache);
            switch(compare) {
                case 0:
                    result = Boolean(val1.length > val2);
                    break;
                case 1:
                    result = Boolean(val1.length < val2);
                    break;
                case 2: //Added by Lasse
                  result = Boolean(val1.length == val2);
                  break;
            }
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

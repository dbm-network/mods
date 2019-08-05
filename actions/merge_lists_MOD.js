module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------

    name: "Merge Lists",

    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------

    section: "Lists and Loops",

    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------

    subtitle: function(data) {
        return `Merge two lists together`;
    },

    //---------------------------------------------------------------------
    // DBM Mods Manager Variables (Optional but nice to have!)
    //
    // These are variables that DBM Mods Manager uses to show information
    // about the mods for people to see in the list.
    //---------------------------------------------------------------------

    // Who made the mod (If not set, defaults to "DBM Mods")
    author: "TheMonDon",

    // The version of the mod (Defaults to 1.0.0)
    version: "1.9.6", //Added in 1.9.6

    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "Merge two lists together",

    // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

    //---------------------------------------------------------------------

    //---------------------------------------------------------------------
    // Action Storage Function
    //
    // Stores the relevant variable info for the editor.
    //---------------------------------------------------------------------

    variableStorage: function(data, varType) {
        const type = parseInt(data.storage3);
        if (type !== varType) return;
        return ([data.varName3, 'Unknown Type']);
    },

    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------

    fields: ["storage", "varName", "storage2", "varName2", "varName3", "storage3"],

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
	<div style="float: left; width: 35%;">
		Source List:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.lists[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round varSearcher" type="text" list="variableList">
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Source List 2:<br>
		<select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
			${data.lists[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%;">
		Variable Name 2:<br>
		<input id="varName2" class="round varSearcher" type="text" list="variableList">
	</div>
</div>
</div><br><br><br>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage3" class="round" onchange="glob.variableChange(this, 'varNameContainer3')">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer3" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName3" class="round" type="text">
	</div>
</div><br><br><br>`;
    },

    //---------------------------------------------------------------------
    // Action Editor Init Code
    //
    // When the HTML is first applied to the action editor, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------

    init: function() {
        const {
            glob,
            document
        } = this;
        glob.listChange(document.getElementById('storage'), 'varNameContainer');
        glob.listChange(document.getElementById('storage2'), 'varNameContainer');
        glob.variableChange(document.getElementById('storage3'), 'varNameContainer3');
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

        const varName = this.evalMessage(data.varName, cache);
        const storage = parseInt(data.storage);
        const list = this.getList(storage, varName, cache);

        const varName2 = this.evalMessage(data.varName2, cache);
        const storage2 = parseInt(data.storage2);
        const list2 = this.getList(storage2, varName2, cache);

        const result = list.concat(list2);

        if (result) {
            const varName3 = this.evalMessage(data.varName3, cache);
            const storage3 = parseInt(data.storage3);
            this.storeValue(result, storage3, varName3, cache);
            return this.callNextAction(cache);
        }
        console.log('Issue with merge lists mod!');
        return this.callNextAction(cache);
    },

    //---------------------------------------------------------------------
    // Action Bot Mod
    //
    // Upon initialization of the bot, this code is run. Using the bot's
    // DBM namespace, one can add/modify existing functions if necessary.
    // In order to reduce conflictions between mods, be sure to alias
    // functions you wish to overwrite.
    //---------------------------------------------------------------------

    mod: function(DBM) {}

}; // End of module

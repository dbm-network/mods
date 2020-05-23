module.exports = {
	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Send Message to Console" ,

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "Other Stuff" ,

	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function(data) {
		if (data.tosend.length > 0) {
			return `<font color="${data.color}">${data.tosend}</font>`;
		} else {
			return "Please enter a message!";
		}
	} ,


	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "Lasse & RigidStudios" ,

	// The version of the mod (Defaults to 1.0.0)
	version: "1.8.2" ,

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Sends a message to the console" ,

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
	// depends_on_mods: ["WrexMODS"],


	//---------------------------------------------------------------------

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["tosend" ,"color"] ,

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

	html: function(isEvent ,data) {
		return `
	<div>
		<p>
			<u>Mod Info:</u><br>
			Created by Lasse! (Color Support Added by RigidStudios)
		</p>
		Color:<br>
		<input type="color" id="color" value="#f2f2f2">
	</div><br>
<div style="padding-top: 8px;">
	Message to send:<br>
	<textarea id="tosend" rows="4" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`;
	} ,

	//---------------------------------------------------------------------
	// Action Editor Init Code
	//
	// When the HTML is first applied to the action editor, this code
	// is also run. This helps add modifications or setup reactionary
	// functions for the DOM elements.
	//---------------------------------------------------------------------

	init: function() {} ,

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter,
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: function(cache) {
		const WrexMODS = this.getWrexMods();                        // WrexMODS Require,
		WrexMODS.CheckAndInstallNodeModule("chalk");           // To use chalk,
		const chalk = WrexMODS.require("chalk");               // Because why not.

		const data = cache.actions[cache.index];
		const send = this.evalMessage(data.tosend ,cache);
		if (send.length > 0) {
			const color = this.evalMessage(data.color ,cache);			// Default to #f2f2f2
			console.log(chalk.hex(color)(send));										// Logs through Hex code fetched from "color" field.
			this.callNextAction(cache);
		} else {
			console.log(chalk.gray(`Please provide something to log: Action #${cache.index + 1}`));
			this.callNextAction(cache);
		}
	} ,

	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//---------------------------------------------------------------------

	mod: function(DBM) {
		DBM.Actions["Send Message to Console (Logs)"] = DBM.Actions["Send Message to Console"];
	}

}; // End of module

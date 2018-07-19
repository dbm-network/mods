module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Sends Stats to DBL",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "Other Stuff",

	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function (data) {
		const info = ['Only Server Count', 'Shard & Server Count'];
		return `Send ${info[parseInt(data.info)]} to DBL!`;
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
	version: "1.8.9",

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Send bot stats to Discord Bot List!",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	// NOTHING HERE, K, PLS LEAVE NOW.

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["dblToken", "info"],

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
<div id="modinfo">
	<p>
	   <u>Mod Info:</u><br>
	   Made by EGGSY!<br>
	</p>
	<div style="float: left; width: 99%; padding-top: 8px;">
	   Your DBL Token:<br>
	   <input id="dblToken" class="round" type="text">
	</div><br>
	<div style="float: left; width: 90%; padding-top: 8px;">
	   Info to Send:<br>
	   <select id="info" class="round">
		<option value="0">Send Only Server Count</option>
		<option value="1">Send Shard & Server Count</option>
	</select><br>
	<p>
		• Using this mod with events will be better. I suggest using this with Bot Join & Bot Leave Server event.<br>
		• Do not send anything about shards if you don't shard your bot!
	</p>
	</div>
</div>`
	},

	//---------------------------------------------------------------------
	// Action Editor Init Code
	//
	// When the HTML is first applied to the action editor, this code
	// is also run. This helps add modifications or setup reactionary
	// functions for the DOM elements.
	//---------------------------------------------------------------------

	init: function () {
	},

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter, 
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: function (cache) {

		const data = cache.actions[cache.index];
		const token = this.evalMessage(data.dblToken, cache);
		const info = parseInt(data.info);
		// Commented due errors => var client = this.getDBM().Bot.bot; 

		const WrexMODS = this.getWrexMods(); // still, as always <3
		const DBL = WrexMODS.require('dblapi.js'); // what a great module!
		const dbl = new DBL(token);

		if (info == 0) {
			dbl.postStats(this.getDBM().Bot.bot.guilds.size)
				.then(console.log("Successfully updated DBL stats! Thank you EGGSY!"))
				.catch(e => console.log(e))
		}
		else if (info == 1) {
			dbl.postStats(this.getDBM().Bot.bot.guilds.size, this.getDBM().Bot.bot.shard.id, this.getDBM().Bot.bot.shard.count)
				.then(console.log("Successfully updated DBL stats! Thank you EGGSY!"))
				.catch(e => console.log(e))
		}
	},

	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//---------------------------------------------------------------------

	mod: function (DBM) {
	}

}; // End of module

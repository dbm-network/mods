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
	version: "1.9.2", //Added in 1.8.9

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
		<option value="0">Send Server Count Only</option>
		<option value="1">Send Shard & Server Count</option>
	</select><br>
	<p>
		• Use this mod inside events or commands<br>
		• Do not send anything about shards if you don't shard your bot, otherwise it'll crash your bot!
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
		const data = cache.actions[cache.index],
			token = this.evalMessage(data.dblToken, cache),
			info = parseInt(data.info),
			snek = require("snekfetch");

		switch (info) {
			case 0:
				snek.post(`https://top.gg/api/bots/${this.getDBM().Bot.bot.user.id}/stats`)
					.set("Authorization", token)
					.send({ server_count: this.getDBM().Bot.bot.guilds.size })
					.catch(() => { })
				break;
			case 1:
				snek.post(`https://top.gg/api/bots/${this.getDBM().Bot.bot.user.id}/stats`)
					.set("Authorization", token)
					.send({ server_count: this.getDBM().Bot.bot.guilds.size, shard_id: this.getDBM().Bot.bot.shard.id })
					.catch(() => { })
				break;
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

	mod: function (DBM) {
	}

}; // End of module

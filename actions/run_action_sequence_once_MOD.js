module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Run Action Sequence Once",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "Other Stuff",

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "General Wrex",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.0.0",

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Ensures the action sequence runs once either per server, or once globally.",

	//---------------------------------------------------------------------

	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function(data) {
		return `Run Once ${data.behavior == "2" ? "Per Server" : "Globally"}`;
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["behavior"],

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
			Created by General Wrex!
		</p><br>
		<p>
			<u>Help:</u><br>
			THIS IS ONCE PER BOT RUN! It will run every time the bot is restarted.<br>
			This goes above the actions you wouldn't like to run more than once per bot session!<br>			
			It will ensure the command only runs once either per server, or once globally.<br>			
			Can be used in Bot Initialization to make sure it only runs once.  Sometimes Bot Initialization runs multiple times, this fixes it!<br>
			<br>
			Usecases:<br>
			Can be used to make setup commands that only work once per server.<br> 			
			Can use Any Message to run some actions, and have it only do it once globally.<br>
			
		</p><br>
		</div>
		<div>
			Run Once:<br>
			<select id="behavior" class="round">
				<option value="2" selected>Per Server</option>
				<option value="3">Globally</option>
			</select>
		<div> 
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
		const behavior = parseInt(data.behavior);

		// would only interfear if people had the same exact actions with the same details in another command
		const unique = Buffer.from(`${cache.actions}`); 
				
		let store = this.getVariable(behavior, unique, cache) || false;		
		if(!store){			
			this.storeValue(true, behavior, unique, cache);		
			this.callNextAction(cache);			
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

	mod: function(DBM) {
	}

}; // End of module
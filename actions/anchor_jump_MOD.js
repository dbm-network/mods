module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------
	
	name: "Jump to Anchor",
	
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
	
	subtitle: function(data) {
		return !!data.description ? `<font color="${data.color}">${data.description}</font>` : `Jump to ${!!data.jump_to_anchor ? `the "<font color="${data.color}">${data.jump_to_anchor}</font>" anchor in your command if it exists!` : 'an anchor!'}`;
	},
	
	author: "Deus Corvi && LeonZ",
	version: "1.0.0", // Added in 1.9.6
	
	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------
	
	fields: ["description", "jump_to_anchor", "color"],
	
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
			This mod will jump to the specified anchor point<br>
			without requiring you to edit any other skips or jumps.<br>
			<b>This is sensitive and must be exactly the same as your anchor name.</b>
		</p>
	</div><br>
	<div style="float: left; width: 74%;">
		Jump to Anchor ID:<br>
		<input type="text" class="round" id="jump_to_anchor"><br>
	</div>
	<div style="float: left; width: 24%;">
		Anchor Color:<br>
		<input type="color" id="color"><br>
	</div>
	<div style="float: left; width: 98%;">
		Description:<br>
		<input type="text" class="round" id="description"><br>
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
	},
	
	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter, 
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------
	
	action: function(cache) {
		const errors = {
			'404': 'There was not an anchor found with that exact anchor ID!'
		};
		const actions = cache.actions;
		const id = cache.actions[cache.index].jump_to_anchor;
		const anchorIndex = actions.findIndex((a) => a.name === "Create Anchor" &&
			a.anchor_id === id);
		if (anchorIndex === -1) throw new Error(errors['404']);
		cache.index = anchorIndex - 1;
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
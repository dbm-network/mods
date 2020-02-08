module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Call Command/Event",

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
	let source;
	if(parseInt(data.sourcetype) == 1) {
		source = data.source2.toString();
	} else {
		source = data.source.toString();
	};
	return `Call Command/Event ID "${source}"`;
},

//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "DBM & ZockerNico",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.9.5", //Added in 1.9.5

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Added more options to default action.",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


//---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["sourcetype", "source", "source2", "type"],

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
	<p>This action has been modified by DBM Mods.</p>
</div>
<div style="float: left; width: 85%; padding-top: 20px;">
	Source Type:<br>
	<select id="sourcetype" class="round" onchange="glob.onChange1(this)">
		<option value="0" selected>Choose from List</option>
		<option value="1">Insert an ID</option>
	</select>
</div>
<div id="info1"; style="float: left; width: 85%; padding-top: 20px; display: none;">
	Command/Event:<br>
	<select id="source" class="round">
		<optgroup id="commands" label="Commands"></optgroup>
		<optgroup id="events" label="Events"></optgroup>
	</select>
</div>
<div id="info2" style="float: left; width: 94.5%; padding-top: 20px;">
	Command/Event ID:<br>
	<input id="source2" class="round" type="text" placeholder="Insert a Command/Event ID...">
</div>
<div style="float: left; width: 85%; padding-top: 20px;">
	Call Type:<br>
	<select id="type" class="round">
	<option value="true" selected>Synchronous</option>
	<option value="false">Asynchronous</option>
	</select>
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

	const $cmds = glob.$cmds;
	const coms = document.getElementById('commands');
	coms.innerHTML = '';
	for(let i = 0; i < $cmds.length; i++) {
		if($cmds[i]) {
			coms.innerHTML += `<option value="${$cmds[i]._id}">${$cmds[i].name}</option>\n`;
		}
	};

	const $evts = glob.$evts;
	const evet = document.getElementById('events');
	evet.innerHTML = '';
	for(let i = 0; i < $evts.length; i++) {
		if($evts[i]) {
			evet.innerHTML += `<option value="${$evts[i]._id}">${$evts[i].name}</option>\n`;
		}
	};

	glob.onChange1 = function(event) {
		const sourceType = parseInt(document.getElementById('sourcetype').value);
		const info1 = document.getElementById('info1');
		const info2 = document.getElementById('info2');

		switch(sourceType) {
			case 0:
				info1.style.display = null;
				info2.style.display = 'none';
				break;
			case 1:
				info1.style.display = 'none';
				info2.style.display = null;
				break;
		};
	};

	glob.onChange1(document.getElementById('sourcetype'));
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
	const Files = this.getDBM().Files;
	
	let id;
	if(parseInt(data.sourcetype) == 1) {id = this.evalMessage(data.source2, cache)} else {id = data.source};
	if(!id) {return console.log('Please insert a Command/Event ID!')};

	let actions;
	const allData = Files.data.commands.concat(Files.data.events);
	for(let i = 0; i < allData.length; i++) {
		if(allData[i] && allData[i]._id === id) {
			actions = allData[i].actions;
			break;
		}
	}
	if(!actions) {
		this.callNextAction(cache);
		return;
	}

	const act = actions[0];
	if(act && this.exists(act.name)) {
		const cache2 = {
			actions: actions,
			index: 0,
			temp: cache.temp,
			server: cache.server,
			msg: (cache.msg || null)
		}
		if(data.type === 'true') {
			cache2.callback = function() {
				this.callNextAction(cache);
			}.bind(this);
			this[act.name](cache2);
		} else {
			this[act.name](cache2);
			this.callNextAction(cache);
		}
	} else {
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

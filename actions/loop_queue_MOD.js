module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Loop Queue",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Audio Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const actions = ["Loop Whole Queue", "Loop Current Item"];
	return `${actions[parseInt(data.loop)]}`;
},

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "ZockerNico",

// The version of the mod (Defaults to 1.0.0)
version: "1.9.5", //Added in 1.9.5

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "This action will loop the queue or the current item.",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


//---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["status", "loop"],

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
		Made by ZockerNico.<br>
	</p>
</div>
<div style="float: left; width: 45%; padding-top: 8px;">
	Loop Setting:<br>
	<select id="status" class="round" onchange="glob.onChange(this)">
		<option value="0" selected>Enable</option>
		<option value="1">Disable</option>
	</select>
</div>
<div style="float: right; width: 50%; padding-top: 8px;">
	Loop Operation:<br>
	<select id="loop" class="round">
		<option value="0" selected>Loop Whole Queue</option>
		<option value="1">Loop Current Item</option>
	</select><br>
</div>
<div style="float: left; width: 100%; padding-top: 8px;">
	<p>
		Please put the Welcome action into a Bot Initalization event to be able to store the current song!
	</p>
</div>`;
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
	const Audio = this.getDBM().Audio;
	const server = cache.server;
	const status = parseInt(data.status);
	const loop = parseInt(data.loop);

	switch(status) {
		case 0://Enable
			switch(loop) {
				case 0://Loop Queue
					Audio.loopQueue[server.id] = true;
					break;
				case 1://Loop Item
					Audio.loopItem[server.id] = true;
					break;
			};
			break;
		case 1://Disable
			switch(loop) {
				case 0://Loop Queue
					Audio.loopQueue[server.id] = false;
					break;
				case 1://Loop Item
					Audio.loopItem[server.id] = false;
					break;
			};
			break;
	};
	
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
	//Check for PlayingNow Data Object
	if(DBM.Audio.playingnow === undefined) {
		DBM.Audio.playingnow = [];
	};

	//Check for Loop Data Objects
	if(DBM.Audio.loopQueue === undefined) {
		DBM.Audio.loopQueue = {};
	};
	if(DBM.Audio.loopItem === undefined) {
		DBM.Audio.loopItem = {};
	};

	DBM.Audio.addToQueue = function(item, cache) {
		if(!cache.server) return;
		const id = cache.server.id;
		if(!this.queue[id]) {
			this.queue[id] = [];
			DBM.Audio.loopQueue[id] = false;//Reset loop status
			DBM.Audio.loopItem[id] = false;
		};
		this.queue[id].push(item);
		this.playNext(id);
	};

	DBM.Audio.playNext = function(id, forceSkip) {
		if(!this.connections[id]) {
			DBM.Audio.loopQueue[id] = false;//Reset loop status
			DBM.Audio.loopItem[id] = false;
			return;
		};
		if(!this.dispatchers[id] || !!forceSkip) {
			if(DBM.Audio.loopItem[id] == true) {//Check if Item Loop is active
				const item = this.playingnow[id];
				this.playItem(item, id);
			} else if(DBM.Audio.loopQueue[id] == true) {//Check if Queue Loop is active
				const currentItem = this.playingnow[id];
				this.queue[id].push(currentItem);
				const nextItem = this.queue[id].shift();
				this.playItem(nextItem, id);
			} else {//Basic DBM function (No Loops are active)
				if(this.queue[id].length > 0) {
					const item = this.queue[id].shift();
					this.playItem(item, id);
				} else {
					DBM.Audio.loopQueue[id] = false;//Reset loop status
					DBM.Audio.loopItem[id] = false;
					this.connections[id].disconnect();
				};
			};
		};
	};
	
	DBM.Audio.playItem = function(item, id) {
		if(!this.connections[id]) return;
		if(this.dispatchers[id]) {
			this.dispatchers[id]._forceEnd = true;
			this.dispatchers[id].end();
		};
		const type = item[0];
		let setupDispatcher = false;
		switch(type) {
			case 'file':
				setupDispatcher = this.playFile(item[2], item[1], id);
				this.playingnow[id] = item;
				break;
			case 'url':
				setupDispatcher = this.playUrl(item[2], item[1], id);
				this.playingnow[id] = item;
				break;
			case 'yt':
				setupDispatcher = this.playYt(item[2], item[1], id);
				this.playingnow[id] = item;
				break;
		};
		if(setupDispatcher && !this.dispatchers[id]._eventSetup) {
			this.dispatchers[id].on('end', function() {
				const isForced = this.dispatchers[id]._forceEnd;
				this.dispatchers[id] = null;
				if(!isForced) {
					this.playNext(id);
				}
			}.bind(this));
			this.dispatchers[id]._eventSetup = true;
		};
	};
}

}; // End of module

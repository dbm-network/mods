module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Set AFK Channel",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Server Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	const channels = ['Command Author\'s Voice Ch.', 'Mentioned User\'s Voice Ch.', 'Default Voice Channel', 'Temp Variable', 'Server Variable', 'Global Variable'];
	return `${channels[parseInt(data.afkchannel)]}`;
},

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "NetLuis",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.9.2", //Added in 1.9.2

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description:  "Sets the AFK channel of the guild.",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["server", "varName", "afkchannel", "varNameChannel"],

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
	<div class="embed">
		<embedleftline style="background-color: #2b9696;"></embedleftline>
	<div class="embedinfo">
	<span class="embed-auth"><u>Mod Info:</u><br>Made by <b>${this.author}</b></span><br>
	<span class="embed-desc">${this.short_description}<br>Version: ${this.version}</span>
	</div>
	</div><br>
	<div style="float: left; width: 35%;">
		Server:<br>
		<select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
			${data.servers[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList">
	</div>
</div><br><br><br>
<div>
	<div style="float: left; width: 35%;">
		Set AFK Channel To:<br>
		<select id="afkchannel" class="round" onchange="glob.channelChange(this, 'varNameContainerr')">
			${data.voiceChannels[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainerr" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varNameChannel" class="round" type="text" list="variableList"><br>
	</div>
	        
	<style>
	/* START OF EMBED CSS */
	div.embed { /* <div class="embed"></div> */
		position: relative;
	}
		embedleftline { /* <embedleftline></embedleftline> OR if you wan't to change the Color: <embedleftline style="background-color: #HEXCODE;"></embedleftline> */
			background-color: #eee;
			width: 4px;
			border-radius: 3px 0 0 3px;
			border: 0;
			height: 100%;
			margin-left: 4px;
			position: absolute;
		}
		div.embedinfo { /* <div class="embedinfo"></div> */
			background: rgba(46,48,54,.45) fixed;
			border: 1px solid hsla(0,0%,80%,.3);
			padding: 10px;
			margin:0 4px 0 7px;
			border-radius: 0 3px 3px 0;
		}
			span.embed-auth { /* <span class="embed-auth"></span> (Title thing) */
				color: rgb(255, 255, 255);
			}
			span.embed-desc { /* <span class="embed-desc"></span> (Description thing) */
				color: rgb(128, 128, 128);
			}
	
			span { /* Only making the text look, nice! */
				font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
			}
			</style>`
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

	glob.serverChange(document.getElementById('server'), 'varNameContainer');
	glob.voiceChannelChange(document.getElementById('afkchannel'), 'varNameContainerr');
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
	const type = parseInt(data.server);
	const afkchannel = parseInt(data.afkchannel);
	const varName2 = this.evalMessage(data.varNameChannel, cache);
	const varName = this.evalMessage(data.varName, cache);
	const server = this.getServer(type, varName, cache);
	const channel = this.getVoiceChannel(afkchannel, varName2, cache);
	if(!channel) {
		this.callNextAction(cache);
		return;
	}
	if(Array.isArray(server)) {
		this.callListFunc(server, 'setAFKChannel', channel).then(function() {
			this.callNextAction(cache);
		}.bind(this));
	} else if(server && server.setAFKChannel) {
		server.setAFKChannel(channel).then(function() {
			this.callNextAction(cache);
		}.bind(this)).catch(this.displayError.bind(this, data, cache));
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

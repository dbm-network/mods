module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Set Bot Activity",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Bot Client Control",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {

	const activities = ["Playing", "Listening", "Watching", "Streaming Twitch"];
	return `${activities[data.activity]} ${data.nameText}`;
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["activity", "nameText", "url"],

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
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
  <div>
		<p>
			<u>Mod Info:</u><br>
			Created by Lasse!<br>
			Edited by General Wrex<br><br>
			Streaming Activity only works with Twitch.<br>
			This action requires the latest discord.js version!<br>
			Check out this video: https://youtu.be/mrrtj5nlV58<br>
		</p>
	</div>

  <div style="float: left; width: 70%;">
  Activity:<br>
  <select id="activity" class="round">
     <option value="0">Playing</option>
     <option value="1">Listening</option>
     <option value="2">Watching</option>
     <option value="3">Streaming Twitch</option>
   </select><br>
     Name: (Shown to the right of the activity)<br>
    <input id="nameText" class="round" type="text"><br>
     Twitch Stream URL: (Streaming Twitch Only)<br>
    <input id="url" class="round" type="text">
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
	const botClient = this.getDBM().Bot.bot.user;
	const data = cache.actions[cache.index];

	const nameText = this.evalMessage(data.nameText, cache)
	const url = this.evalMessage(data.url, cache)


	const activity = parseInt(data.activity);

	let target;
	if(activity >= 0) {
		switch(activity) {
			case 0:
				target = 'PLAYING';
				break;
			case 1:
				target = 'LISTENING';
				break;
			case 2:
				target = 'WATCHING';
				break;
			case 3:
				target = 'STREAMING';
				break;
		}
	}

	if(botClient) {

		let obj;

		if(nameText && activity){
			obj = { game:{ name: nameText, type: target }}

			if(url){
				obj = { game:{ name: nameText, type: target, url: url } }
			}
		}

		botClient.setPresence(obj).then(function() {
			this.callNextAction(cache);
			}.bind(this))
		.catch(err=>console.log(err));
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

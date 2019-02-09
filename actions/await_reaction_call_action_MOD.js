module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Await Reaction Call Action",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Messaging",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	return `Await ${data.max} ${data.max === "1" ? `reaction` : `reactions`} for ${data.time} ${data.time === "1" ? `milisecond` : `miliseconds`}`;
},

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "MrGold",

// The version of the mod (Defaults to 1.0.0)
version: "1.9.4", //Added in 1.9.4

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "Awaits Reaction",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


//---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage2);
	if(type !== varType) return;
	return ([data.varName2, 'Reaction List']);
},


//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "filter", "max", "time", "maxEmojis", "maxUsers", "iftrue", "iftrueVal", "iffalse", "iffalseVal", "storage2", "varName2"],

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
	<div id="wrexdiv2" style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
	<div>
	<p>
		<u>Mod Info:</u><br>
		Created by MrGold
	</p>
</div><br>
<div class="codeblock" style="float: left; width: 88%; padding-top: 8px;">
	<p>
	<span style="color:white"><b>Filters Examples:</b><br><span style="color:#9b9b9b">
	reaction.emoji.name === '😎'<br>
	reaction.emoji.id === '1234567890'<br>
	<br>
	user.id === '1234567890'<br>
	user.name === 'Mr.Gold'<br>
	user.tag === 'Mr.Gold#9003'<br>
    <br>
    <u><span class="wrexlink" data-url="https://www.w3schools.com/js/js_comparisons.asp">JavaScript Comparison and Logical Operators</span></u>
	</p>
</div><br><br><br><br><br><br><br><br><br><br><br>
<div>
        <div style="float: left; width: 35%;">
		    Source Message:<br>
            <select id="storage" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
				${data.messages[isEvent ? 1 : 0]}
			</select>
        </div>
        <div id="varNameContainer" style="display: none; float: right; width: 60%;">
            Variable Name:<br>
            <input id="varName" class="round" type="text" list="variableList">
        </div>
    </div><br><br><br>
<div style="width: 567px; margin-top: 8px;">
JavaScript Filter Eval: <span style="opacity: 0.5;">(JavaScript Strings)<br>
<input id="filter" class="round" type="text" value="reaction.emoji.name === '👌' && user.id === 'someID'">
</div><br>
<div style="float: left; width: 50%;">
Max Reactions:<br>
<input id="max" class="round" type="text" value="1" placeholder="Optional"><br>
</div>
<div style="float: left; width: 49%;">
Max Time (miliseconds):<br>
<input id="time" class="round" type="text" value="60000" placeholder="Optional"><br>
</div><br><br><br>
<div style="float: left; width: 50%;">
Max Emojis:<br>
<input id="maxEmojis" class="round" type="text" placeholder="Optional"><br>
</div>
<div style="float: left; width: 49%;">
Max Users:<br>
<input id="maxUsers" class="round" type="text" placeholder="Optional"><br>
</div><br><br><br>
    <div style="padding-top: 8px;">
        <div style="float: left; width: 35%;">
            On Respond:<br>
            <select id="iftrue" class="round" onchange="glob.onChangeTrue(this)">
					 <option value="0" selected>Continue Actions</option>
					 <option value="1">Stop Action Sequence</option>
					 <option value="2">Jump To Action</option>
					 <option value="3">Skip Next Actions</option>
				</select>
        </div>
        <div id="iftrueContainer" style="display: none; float: right; width: 60%;"><span id="iftrueName">Action Number</span>:<br><input id="iftrueVal" class="round" type="text">
        </div>
    </div>
    <br><br><br>
    <div style="padding-top: 18px;">
        <div style="float: left; width: 35%;">
            On Timeout:<br>
            <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
				<option value="0">Continue Actions</option>
				<option value="1" selected>Stop Action Sequence</option>
				<option value="2">Jump To Action</option>
				<option value="3">Skip Next Actions</option>
		 </select>
        </div>
        <div id="iffalseContainer" style="display: none; float: right; width: 60%;"><span id="iffalseName">Action Number</span>:<br><input id="iffalseVal" class="round" type="text"></div>
	</div><br><br><br>
	<div style="padding-top: 10px;">
        <div style="float: left; width: 35%;">
            Store Reaction List To:<br>
            <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
		${data.variables[0]}
	</select>
        </div>
        <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		    Variable Name:<br>
            <input id="varName2" class="round" type="text">
        </div>
    </div><br><br><br><br>
<style>
    .codeblock {
    		margin: 4px; background-color: rgba(0,0,0,0.20); border-radius: 3.5px; border: 1px solid rgba(255,255,255,0.15); padding: 4px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; transition: border 175ms ease;
    	}
		span.wrexlink {
			color: #99b3ff;
			text-decoration:underline;
			cursor:pointer;
		  }
		span.wrexlink:hover { 
			color:#4676b9; 
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

	glob.messageChange(document.getElementById('storage'), 'varNameContainer');

	glob.variableChange(document.getElementById('storage2'), 'varNameContainer2');


	glob.onChangeTrue(document.getElementById('iftrue'));
	glob.onChangeFalse(document.getElementById('iffalse'));

	var wrexlinks = document.getElementsByClassName("wrexlink")
	for(var x = 0; x < wrexlinks.length; x++) {
	  
	  var wrexlink = wrexlinks[x];
	  var url = wrexlink.getAttribute('data-url');   
	  if(url){
		wrexlink.setAttribute("title", url);
		wrexlink.addEventListener("click", function(e){
		  e.stopImmediatePropagation();
		  console.log("Launching URL: [" + url + "] in your default browser.")
		  require('child_process').execSync('start ' + url);
		});
	  }   
	}  
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

	const message = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	const msg = this.getMessage(message, varName, cache);

	const storage = parseInt(data.storage2);
	const varName2 = this.evalMessage(data.varName2, cache);

	if(msg) {
		const js = String(this.evalMessage(data.filter, cache));
		
		const max = parseInt(this.evalMessage(data.max, cache));
		const maxEmojis = parseInt(this.evalMessage(data.maxEmojis, cache));
		const maxUsers = parseInt(this.evalMessage(data.maxUsers, cache));
		const time = parseInt(this.evalMessage(data.time, cache));

		msg.awaitReactions(function(reaction, user) {
			try {
				return !!eval(js);
			} catch(e) {
				return false;
			}
		}, {
			max: max,
			maxEmojis: maxEmojis,
			maxUsers: maxUsers,
			time: time,
			errors: ['time']
		}).then(function(collected) { 
			this.storeValue(collected, storage, varName2, cache);
			this.executeResults(true, data, cache);
		}.bind(this)).catch(function() {
			this.executeResults(false, data, cache);
		}.bind(this)).catch(function(err) {console.error(err.stack ? err.stack : err)});
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

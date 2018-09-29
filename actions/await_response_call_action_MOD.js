module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Await Response Call Action",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "Messaging",

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "General Wrex(Code), EliteArtz(Style)",

// The version of the mod (Defaults to 1.0.0)
version: "1.8.8",

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "The broken Await thats not broken anymore!",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


//---------------------------------------------------------------------


//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	return `Await ${data.max} responses for ${data.time} miliseconds."`;
},

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage2);
	if(type !== varType) return;
	return ([data.varName2, 'Response']);
},


//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["storage", "varName", "filter", "max", "time", "storage2", "varName2", "iftrue", "iftrueVal", "iffalse", "iffalseVal"],

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
	<div id="wrexdiv2" style="width: 550px; height: 350px; overflow-y: scroll;">
    <div class="codeblock" style="width:75%;">
        <p>
            <u>Mod Info:</u><br>
            <i>Made by ${this.author}</i><br>
		</p>
		
	</div>
	<div class="help">

		Common Filters:<br>
		<pre>
		If message IS the response: content === 'response'
		if message HAS the word:  content.includes('response')
		if message BEGINS wth the word: content.startsWith('response')
		if message ENDS wth the word: content.endsWith('response')
		To use regex: content.match(/response/)	
		</pre>
		Can use most of these string functions: <u><span class="wrexlink" data-url="https://www.w3schools.com/Jsref/jsref_obj_string.asp">Located Here</span></u>
	</div>
    <div>
        <div style="float: left; width: 35%;">
            Source Channel:<br>
            <select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
				${data.channels[isEvent ? 1 : 0]}
			</select>
        </div>
        <div id="varNameContainer" style="display: none; float: right; width: 60%;">
            Variable Name:<br>
            <input id="varName" class="round" type="text" list="variableList"><br>
        </div>
    </div>
	<br><br><br>
    <div style="width: 75%; margin-top: 8px;">
        Javascript Filter Eval: (Javascript Strings)<br>
		<input id="filter" class="round" type="text" value="content.equals('response')" placeholder="e.g. content == 'YourAwaitAnswer' or content"><br>
    </div>
    <br>
    <div style="float: left; width: 50%;">
        Max Responses:<br>
        <input id="max" class="round" type="text" value="1"><br>
    </div>
    <div style="float: right; width: 50%;">
        Max Time (miliseconds):<br>
        <input id="time" class="round" type="text" value="60000"><br>
    </div>
    <br><br><br>
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
    <div style="padding-top: 8px;">
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
	</div><br><br><br><br><br><br><br>
	
    <div>
        <div style="float: left; width: 35%;">
            Store Response To:<br>
            <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
		${data.variables[0]}
	</select>
        </div>
        <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
            Latest Response Variable Name: <br>
            <input id="varName2" class="round" type="text"><br>
        </div>
    </div><br><br><br><br><br>
</div>
<style>
    .codeblock {
    		margin: 4px; background-color: rgba(0,0,0,0.20); border-radius: 3.5px; border: 1px solid rgba(255,255,255,0.15); padding: 4px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; transition: border 175ms ease;
    	}
    	.codeblock:hover {
    		border: 1px solid rgba(255,255,255,0.45);
    	}
    	.text {
    		color: cyan;
		}
		
		.help { 
			font-size: smaller;
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

	glob.channelChange(document.getElementById('storage'), 'varNameContainer');

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
	
	const storage = parseInt(data.storage);
	const varName = this.evalMessage(data.varName, cache);
	const channel = this.getChannel(storage, varName, cache);


	const responseStorage = parseInt(data.storage2);
	const responseVar = this.evalMessage(data.varName2, cache);

	if(channel) {
		const js = String(data.filter);
		const max = parseInt(this.evalMessage(data.max, cache));
		const time = parseInt(this.evalMessage(data.time, cache));

		const saved_index = cache.index;

		channel.awaitMessages(function(msg) {
			const content = msg.content;
			const author = msg.member || msg.author;

			try {
				return !!eval(js);
			} catch(e) {
				return false;
			}
		}, {
			max: max,
			time: time,
			errors: ['time']
		}).then(function(collected) { 
			this.storeValue(collected.last(), responseStorage, responseVar, cache);
			this.executeResults(true, data, cache);		
		}.bind(this)).catch(function(collected) {
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
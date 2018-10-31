module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Welcome",

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

section: "#Mod Information",

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

subtitle: function(data) {
	return `Put this into a Bot Initalization event for music!`;
},

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "DBM Mods",

// The version of the mod (Defaults to 1.0.0)
version: "1.9.2 ~ beta",

// A short description to show on the mod line for this mod.
short_description: "Information about the Mod Collection & Overwrites Bot.js",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

//---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["mods"],

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
<style>
table.scroll {
    width: 525px; /* 140px * 5 column + 16px scrollbar width */
    border-spacing: 0;
    border: 2px solid white;
}

table.scroll tbody,
table.scroll thead tr { display: block; }

table.scroll tbody {
    height: 100px;
    overflow-y: auto;
    overflow-x: hidden;
}

table.scroll tbody td,
table.scroll thead th {
    width: 176px;
}

table.scroll thead th:last-child {
    width: 180px; /* 140px + 16px scrollbar width */
}

thead tr th {
    height: 30px;
    line-height: 30px;
    /*text-align: left;*/
}

tbody { border-top: 2px solid white; }

</style>
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
	<p>
		<h1>Welcome!</h1>
		Thank you for using the DBM Mod Collection!<br>
		If you want to tell us something, join the Discord Guild below.
		And if something doesn't work feel free to create an issue on GitHub
		or open #support and describe your problem.

		<h3>Discord:</h3>
		Join the Discord Guild to stay updated and be able to suggest things.<br>
		https://dbm-network.com/

		<h3>Your version:</h3>
		${this.version}

		<h3>GitHub:</h3>
		Visit us on GitHub! The whole mod collection is on GitHub
		and everyone is invited to join us developing new mods!<br>
		Copy and paste the link to view the site in your browser.<br>
		https://github.com/Discord-Bot-Maker-Mods/DBM-Mods/
	</p>
	<h3>Current List of Mods</h3>
	<table class="scroll">
		<thead >
			<tr>
				<th scope="col">Name</th>
				<th scope="col">Section</th>
				<th scope="col">Author</th>
			</tr>
		</thead>
			<tbody id="mods">
			</tbody>
	</table><br><br>
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

	var path = require("path")

	try {

		var mods = document.getElementById("mods");

		require("fs").readdirSync(__dirname).forEach(function(file) {
			if(file.match(/MOD.js/i)) {
				var action = require(path.join(__dirname, file));
				if(action.name && action.action !== null) {

					const tr = document.createElement('tr')
					tr.setAttribute('class', 'table-dark')

					const name = document.createElement('td')
					const headerText = document.createElement("b")
					headerText.innerHTML = action.name
					name.appendChild(headerText)

					name.setAttribute('scope', 'row')
					tr.appendChild(name)

					const section = document.createElement('td')
					section.appendChild(document.createTextNode(action.section))
					tr.appendChild(section)

					const author = document.createElement('td')
					author.appendChild(document.createTextNode(action.author ? action.author : "DBM"))
					tr.appendChild(author)
					mods.appendChild(tr);
				}
			}
		});
	} catch (error) {
		// write any init errors to errors.txt in dbm's main directory
		require("fs").appendFile("errors.txt", error.stack ? error.stack : error + "\r\n");
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

	console.log('Music function successfully overwritten.');

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
	DBM.Audio.playingnow = [];

    var oldFunc = DBM.Audio.playItem;
    DBM.Audio.playItem = function(item, id) {
        oldFunc.apply(this, arguments);
        if(item[0] === "yt") {
            this.playingnow[id] = item;
        }
	};
}

}; // End of module

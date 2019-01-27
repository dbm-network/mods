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
version: "1.9.4 ~ beta",

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
border: 2px solid #47494c;
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

tbody { border-top: 2px solid #47494c; }

.embed {
position: relative;
}

.embedinfo {
background: rgba(46,48,54,.45) fixed;
border: 1px solid #2f3237;
border-radius: 0 3px 3px 0;
padding: 10px;
margin:0 4px 0 7px;
border-radius: 0 3px 3px 0;
}

embedleftline {
background-color: #e74c3c;
width: 4px;
border-radius: 3px 0 0 3px;
border: 0;
height: 100%;
margin-left: 4px;
position: absolute;
}

span {
font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

span.embed-auth {
color: rgb(255, 255, 255);
}

span.embed-desc {
color: #afafaf;
} 

span.wrexlink2, span.wrexlink3 {
color: #0096cf;
text-decoration: none;
cursor:pointer;
font-family: inherit;
font-weight: inherit;
}

span.wrexlink2:hover, span.wrexlink3:hover {
  text-decoration: underline;
}
  
span.discord_channel {
background-color: rgba(114,137,218,.1);
color: #7289da;
cursor: pointer;
font-family: sans-serif;
padding: 2px;
}
  
span.discord_channel:hover {
background-color: rgba(114,137,218,.7);
color: #fff;
}
  
span.discord_code_blocks {
background: #2f3136;
border: 1.5px solid #2b2c31;
border-radius: 7px;
box-sizing: border-box;
overflow: hidden;
padding: 8px 10px;
color: #839496;
font-family: Consolas
}

</style>
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
<p>
<h1 style="color: #fff">Welcome!</h1>
Thank you for using the DBM Mod Collection!<br>
If you want to tell us something, join the Discord Guild below.
And if something doesn't work feel free to create an issue on GitHub
or open <span class="discord_channel wrexlink" data-url="https://discordapp.com/channels/374961173524643843/374961417016573962">#support</span> and describe your problem.

<h3 style="color: #fff">Discord:</h3>
Join the Discord Guild to stay updated and be able to suggest things.<br>
<span class="wrexlink2" data-url2="https://dbm-network.org/">https://dbm-network.org/</span>

<h3 style="color: #fff">Your version:</h3>
<span class="discord_code_blocks">${this.version}</span>

<h3 style="color: #fff">Our Donators:</h3>
<div class="embed" style="width:35%;">
        <embedleftline></embedleftline>
        <div class="embedinfo">
            <span class="embed-auth">
                Our Supporters
            </span><br>
            <span class="embed-desc">
		Sam<br>
		Zaserr<br>
		papa goobs<br>
		Danno3817<br>
		GeT_DuCkT<br>
		Nerd<br>
		squiffy<br>
		Noah<br>
		Adam_V<br>
		DoimptSopy<br>
		Lasse<br>
		Not Alien<br>
		𝕯𝖔𝖒<br>
		Leondre Devries [BAM]<br>
		_iTrqPss<br>
		NetLuis<br>
		Almeida<br>
		Orochimaru<br>
		Max 🌟<br>
		GAMER<br>
		S h i r o ツ<br>
		Quinten<br>
		Rafied<br>
		lucasboss45<br>
		Dominus_Marceau
            </span>
        </div>
</div>

<h3 style="color: #fff">GitHub:</h3>
Visit us on GitHub! The whole mod collection is on GitHub
and everyone is invited to join us developing new mods!<br>
Copy and paste the link to view the site in your browser.<br>
<span class="wrexlink3" data-url3="https://github.com/Discord-Bot-Maker-Mods/DBM-Mods">https://github.com/Discord-Bot-Maker-Mods/DBM-Mods</span><br>
</p>

<h3 style="color: #fff">Current List of Mods</h3>
<table class="scroll">
<thead >
<tr>
<th scope="col">Name</th>
<th scope="col">Section</th>
<th scope="col">Author(s)</th>
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

var wrexlinks = document.getElementsByClassName("wrexlink")
	for(var x = 0; x < wrexlinks.length; x++) {
	    var wrexlink = wrexlinks[x];
	    var url = wrexlink.getAttribute('data-url');
	    if(url){
		    wrexlink.addEventListener("click", function(e){
		        e.stopImmediatePropagation();
		        console.log("Launching URL: [" + url + "] in your default browser.");
		        require('child_process').execSync('start ' + url);
		    });
	    }
	}

var wrexlinks2 = document.getElementsByClassName("wrexlink2")
	for(var x2 = 0; x2 < wrexlinks2.length; x2++) {
	    var wrexlink2 = wrexlinks2[x2];
	    var url2 = wrexlink2.getAttribute('data-url2');
	    if(url2){
		    wrexlink2.setAttribute("title", url2);
		    wrexlink2.addEventListener("click", function(e2){
		        e2.stopImmediatePropagation();
		        console.log("Launching URL: [" + url2 + "] in your default browser.");
		        require('child_process').execSync('start ' + url2);
		    });
	    }
	}

var wrexlinks3 = document.getElementsByClassName("wrexlink3")
	for(var x3 = 0; x3 < wrexlinks3.length; x3++) {
	    var wrexlink3 = wrexlinks3[x3];
	    var url3 = wrexlink3.getAttribute('data-url3');
	    if(url3){
		    wrexlink3.setAttribute("title", url3);
		    wrexlink3.addEventListener("click", function(e3){
		        e3.stopImmediatePropagation();
		        console.log("Launching URL: [" + url3 + "] in your default browser.");
		        require('child_process').execSync('start ' + url3);
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

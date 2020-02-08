module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Speed Test",

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

	subtitle: function (data) {
		if (data.info === "downloadspeed") {
			return "Speed Test - Download Speed"
		} else if (data.info === "uploadspeed") {
			return "Speed Test - Upload Speed"
		} else {
			return `Error in subtitles.`
		}
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
	version: "1.9.3", //Added in 1.9.3

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description:  "Tests and stores download/upload speed.",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


	//---------------------------------------------------------------------

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		let dataType;
		if (data.info === 'downloadspeed') {
			dataType = 'Download Speed'
		} else if (data.info === 'uploadspeed') {
			dataType = 'Upload Speed'
		} else {
			dataType = 'Unknown Data Type'
		}
		return ([data.varName, dataType]);
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["info", "type", "storage", "varName"],

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

	html: function (isEvent, data) {
        return `
		<div class="embed">
            <embedleftline style="background-color: #2b9696;"></embedleftline>
        <div class="embedinfo">
	    <span class="embed-auth"><u>Mod Info:</u><br>Made by <b>${this.author}</b></span><br>
	    <span class="embed-desc">${this.short_description}<br>Version: ${this.version}</span>
        </div>
        </div><br>
	<div style="float: left; width: 50%; padding-top: 8px;">
		Speed:<br>
		<select id="info" class="round">
			<option value="downloadspeed" selected>Download Speed</option>
			<option value="uploadspeed">Upload Speed</option>
		</select>
	</div>
		<div style="float: left; width: 50%; padding-left: 10px; padding-top: 8px;">
		Bit Type:<br>
		<select id="type" class="round">
			<option value="0" selected>MB/s</option>
			<option value="1">KB/s</option>
		</select>
        </div><br><br><br>
	<div>
		<div style="float: left; width: 35%; padding-top: 8px;">
			Store In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%; padding-top: 8px;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
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

	init: function () {
		const {glob, document} = this;
		glob.variableChange(document.getElementById('storage'), 'varNameContainer');
	},

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter,
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: function (cache) {
		const _this = this //This is needed sometimes
		const data = cache.actions[cache.index];
		const info = _this.evalMessage(data.info);
		const type = parseInt(data.type);

		// Main code:
		const WrexMODS = _this.getWrexMods(); // as always.
		WrexMODS.CheckAndInstallNodeModule('speedtest-net'); //To install module automatically
		const speedTest = WrexMODS.require('speedtest-net');
		const test = speedTest({maxTime: 5000});

		let result;
		test.on(`${info}`, speed => {
			switch (type) {
				case 0:
					result = speed
					break;
				case 1:
					result = (speed * 125).toFixed(2)
					break;
				default:
					break;
			}
			
		if (result !== undefined) {
			const storage = parseInt(data.storage);
			const varName2 = _this.evalMessage(data.varName, cache);
			_this.storeValue(result, storage, varName2, cache);
		}
		_this.callNextAction(cache);

		})

		test.on('error', error => {
			console.log("Error in Speed Test MOD: " + error)
			_this.callNextAction(cache)
		})
	},

	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//---------------------------------------------------------------------

	mod: function (DBM) {}

}; // End of module

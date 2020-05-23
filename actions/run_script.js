module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Run Script",

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
	return `${data.code}`;
},

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
author: "DBM & MrGold",

// The version of the mod (Defaults to 1.0.0)
version: "1.9.6", //Added in 1.9.6

// A short description to show on the mod line for this mod (Must be on a single line)
short_description: "Runs a JavaScript Script",

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

//---------------------------------------------------------------------

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	const info = parseInt(data.VTypeSelect);
	let dataType = 'Unknown Type';
	switch (info) {
		case 0:
			dataType = "Unknown Type";
			break;
		case 1:
			dataType = "Number";
			break;
		case 2:
			dataType = "String";
			break;
		case 3:
			dataType = "Image";
			break;
		case 4:
			dataType = "Member";
			break;
		case 5:
			dataType = "Message";
			break;
		case 6:
			dataType = "Text Channel";
			break;
		case 7:
			dataType = "Voice Channel";
			break;
		case 8:
			dataType = "Role";
			break;
		case 9:
			dataType = "Server";
			break;
		case 10:
			dataType = "Emoji";
			break;
		case 11:
			dataType = data.CVTypeValue;
			break;
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

fields: ["code", "behavior", "interpretation", "storage", "varName", "VTypeSelect", "CVTypeValue"],

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
	<div id ="wrexdiv" style="width: 570px; height: 359px; overflow-x: hidden;">

		<div style="width: 100%; height: 324px;">
			<iframe id="JSEditor" style="visibility: hidden; width: 100%; height: 320px;" frameBorder="0"></iframe>
			<textarea id="code" name="is-eval" style="display: none; width: 100%; height: 320px; white-space: nowrap; resize: none;"></textarea>
		</div>
		<div style="width: 100%; height: 39px; background-color: #161616; margin-top: -4px; user-select: none;">
		    <button class="RS_button" onclick="glob.onClickDefault(this)">Default</button>
            <span style="font-family:Verdana, Geneva, sans-serif; opacity: .3; font-size: 20px; color: white; position: relative; top: 2px; left: 3px;">Run Script V2</span><br>
            <span style="font-family:Verdana, Geneva, sans-serif; opacity: .2; font-size: 11.9px; color: white; position: relative; top: -1px; left: 4px;">Modification by MrGold</span>
        </div>

		<div style="padding-left: 17px; padding-top: 17px;">
		    <div>
		        <div style="float: left; width: 257px;">
		            End Behavior:<br>
		            <select id="behavior" class="round">
			            <option value="0" selected>Call Next Action Automatically</option>
			            <option value="1">Do Not Call Next Action</option>
		            </select>
	            </div>
	            <div style="padding-left: 5%; float: left; width: 255px;">
		            Interpretation Style:<br>
		            <select id="interpretation" class="round">
			            <option value="0" selected>Evaluate Code First</option>
			            <option value="1">Evaluate Code Directly</option>
		            </select>
	            </div>
			</div><br><br><br>
			<div>
				<div style="float: left; width: 35%;">
					Store In:<br>
					<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer'); glob.onChangeVTypeSelect1()">
						${data.variables[0]}
					</select>
				</div>
				<div id="varNameContainer" style="display: none; float: right; width: 60%;">
					Variable Name:<br>
					<input id="varName" class="round" type="text">
				</div>
			</div>
			<div id="VTypeDiv" style="display: none;">
			    <br><br><br>
				<div style="float: left; width: 35%;">
					Variable Type:<br>
					<select id="VTypeSelect" class="round" onchange="glob.onChangeVTypeSelect2(this)">
				        <option value="0" selected>Unknown Type</option>
				        <option value="1">Number</option>
				        <option value="2">String</option>
				        <option value="3">Image</option>
				        <option value="4">Member</option>
				        <option value="5">Message</option>
						<option value="6">Text Channel</option>
						<option value="7">Voice Channel</option>
						<option value="8">Role</option>
						<option value="9">Server</option>
						<option value="10">Emoji</option>
				        <option value="11">Custom Variable Type</option>
					</select>
				</div>
				<div id="CVTypeDiv" style="display: none; float: right; width: 60%;">
				    Custom Variable Type Name:<br>
					<input id="CVTypeValue" class="round" type="text">
				</div>
			</div>
			<br><br><br><br>
        </div>
    </div>

    <style>
        .action-input {
            margin: 0 !important;
            padding: 0px !important;
		}

		.RS_button {
			float: right;
			border: none;
			outline: 0;
			height: 100%;
			width: 100px;
			font-size: 25px;
			font-family: Arial;
			background-color: #2d2d2d;
			color: white;
			transition: background-color .1s;
			cursor: pointer;
		}
		.RS_button:hover {
			background-color: #3b3c3d;
		}

        .RS_button:active {
			background-color: #404142;
	    }
	</style>`
},

//---------------------------------------------------------------------
// JavaScript Editor
//
// by: MrGold
// Powered by Ace
//---------------------------------------------------------------------

init: function() {
	const {glob, document} = this;

	document.getElementById("JSEditor").src = "data:text/html," + `
	<script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.3/ace.js" integrity="sha256-gkWBmkjy/8e1QUz5tv4CCYgEtjR8sRlGiXsMeebVeUo=" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.3/ext-language_tools.js" integrity="sha256-PAtX04Rk2WBELn+z4CmyvM2E5bhFBNEplF8mrHBvMJc=" crossorigin="anonymous"></script>

	<div id="editor"></div>
	<textarea id="hideCode" style="display: none;"></textarea>

	<script>
	    var editor = ace.edit("editor", {
		    mode: "ace/mode/javascript",
		    theme: "ace/theme/monokai"
		});
		
		editor.setOptions({
			enableBasicAutocompletion: true,
			enableLiveAutocompletion: true,
			autoScrollEditorIntoView: true,
			showPrintMargin: false
		});

		document.getElementById("hideCode").addEventListener("_load", function() {
			editor.session.setValue(document.getElementById("hideCode").value);
		});

		editor.session.on('change', function() {
			document.getElementById("hideCode").value = editor.getValue();
		});
	</script>

	<style>
	    #editor {
			position: absolute;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			font-size: 12.1px;
		}

		::-webkit-scrollbar {
            width: 13px;
        }
        
        ::-webkit-scrollbar-track {
            background: #38393a; 
        }
        
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 15px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
            background: #555; 
        }
	</style>`;

	document.getElementById("JSEditor").addEventListener("load", function() {
		if(document.getElementById("code").value) {
		    this.contentWindow.document.getElementById("hideCode").value = document.getElementById("code").value;
			this.contentWindow.document.getElementById("hideCode").dispatchEvent(new Event('_load'));
		}
		this.style.visibility = "visible";
	})
	
	document.getElementById("code").addEventListener("input", function() {
		document.getElementById("JSEditor").contentWindow.document.getElementById("hideCode").value = document.getElementById("code").value;
		document.getElementById("JSEditor").contentWindow.document.getElementById("hideCode").dispatchEvent(new Event('_load'));
	})

	document.getElementById("createAction").setAttribute("onclick", 'if(document.getElementById("JSEditor").contentWindow.document.getElementById("hideCode").value) document.getElementById("code").value = document.getElementById("JSEditor").contentWindow.document.getElementById("hideCode").value; finish()');

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

	glob.onChangeVTypeSelect1 = function() {
		if(document.getElementById("storage").value === "0") {
			document.getElementById("VTypeDiv").style.display = 'none';
		} else {
			document.getElementById("VTypeDiv").style.display = null;
		}
	};

	glob.onChangeVTypeSelect2 = function(element) {
		if(element.value === "11") {
			document.getElementById("CVTypeDiv").style.display = null;
		} else {
			document.getElementById("CVTypeDiv").style.display = 'none';
		}
	};

	glob.onClickDefault = function(element) {
		if(document.getElementById("code").style.display == "none") {
			element.innerHTML = "Back";

			document.getElementById("code").value = document.getElementById("JSEditor").contentWindow.document.getElementById("hideCode").value;

			document.getElementById("code").style.display = "initial"
			document.getElementById("JSEditor").style.display = "none"
		} else {
			element.innerHTML = "Default";

			document.getElementById("JSEditor").contentWindow.document.getElementById("hideCode").value = document.getElementById("code").value;
			document.getElementById("JSEditor").contentWindow.document.getElementById("hideCode").dispatchEvent(new Event('_load'));
			
			document.getElementById("code").style.display = "none"
			document.getElementById("JSEditor").style.display = "initial"
		}
	};

	glob.onChangeVTypeSelect1();
	glob.onClickDefault();
	glob.onChangeVTypeSelect2(document.getElementById('VTypeSelect'));
	glob.variableChange(document.getElementById('storage'), 'varNameContainer');
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

	let code;
	if(data.interpretation === "0") {
		code = this.evalMessage(data.code, cache);
	} else {
		code = data.code;
	}

	if(data.storage !== "0") {
		const result = this.eval(code, cache);
	    const varName = this.evalMessage(data.varName, cache);
		const storage = parseInt(data.storage);
		this.storeValue(result, storage, varName, cache);
	} else {
		this.eval(code, cache);
	}
	if(data.behavior === "0") {
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

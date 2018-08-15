module.exports = {

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------

name: "Run Script Too",

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
    if(data.title) return `${data.title}`;
	return `${ data.file ? "External File: " + data.file : data.code}`;
},

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

variableStorage: function(data, varType) {
	const type = parseInt(data.storage);
	if(type !== varType) return;
	return ([data.varName, 'Unknown Type']);
},

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

fields: ["behavior", "interpretation", "code", "file", "storage", "varName", "title"],

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
       <div style="float: left; width: 45%;">
          End Behavior:<br>
          <select id="behavior" class="round">
             <option value="0"selected>Call Next Action</option>
             <option value="1">Do Not Call Next Action</option>
          </select>
       </div>
       <div style="padding-left: 5%; float: left; width: 55%;">
          Interpretation Style:<br>
          <select id="interpretation" class="round">
             <option value="0">Evaluate Text First</option>
             <option value="1" selected>Evaluate Text Directly</option>
          </select>
       </div>
    </div>
    <br><br><br><br>
    <div>
       <div class="embed" style="width:98%;">
          <embedleftline></embedleftline>
          <div class="embedinfo">
             <span class="embed-auth">
             <u><span class="wrexlink" data-url="https://github.com/Discord-Bot-Maker-Mods/DBM-Mods">Mod Info:</span></u><br>
             Made by General Wrex
             </span><br>
             <span class="embed-desc">
             This mod allows you to load run scripts from external javascript files.  The point of it is to allow the use of syntax highlighting and syntax checking by allowing the use of your favorite text editor. It also live reloads the file if used in a command. Very useful for live changes! Make a change, call the command!
             </span>
          </div>
       </div>
    </div>
    <br>  
    <div id="" style="float: left; width: 65%;">
       Script Name: (shown in the action subtitle)<br>
       <input id="title" class="round" type="text">
    </div>
    <br><br><br><br>
    <div>
       External File Path: (Root directory is your bot folder )<br>
       <div style="float: left; width: 65%;">     
          <input type="text" name="file" id="file" class="round" placeholder="./scripts/myscript.js" style="float: left;"/>
       </div>
    </div>
    <br><br><br><br><br><br>
    <div>
       <div style="float: left; width: 35%;">
          Store In:<br>
          <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
          ${data.variables[0]}
          </select>
       </div>
       <div id="varNameContainer" style="display: none; float: right; width: 60%;">
          Variable Name:<br>
          <input id="varName" class="round" type="text">
       </div>
    </div>
    <br><br><br><br><br>   
    <div style="padding-top: 8px;"> 
       Or Use Custom Code: (This isn't used if an external path is defined.)<br>
       <textarea id="code" rows="14" name="is-eval" style="width: 99%; white-space: nowrap; resize: none;"></textarea>
    </div>
    <br><br>
 </div>
 <style>  
    /* EliteArtz Embed CSS code */
    .embed {
    position: relative;
    }
    .embedinfo {
    background: rgba(46,48,54,.45) fixed;
    border: 1px solid hsla(0,0%,80%,.3);
    padding: 10px;
    margin:0 4px 0 7px;
    border-radius: 0 3px 3px 0;
    }
    embedleftline {
    background-color: #eee;
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
    color: rgb(128, 128, 128);
    } 
    span.wrexlink {
    color: #99b3ff;
    text-decoration:underline;
    cursor:pointer;
    }
    span.wrexlink:hover { 
    color:#4676b9; 
    }
 </style>
    `
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
	const file = data.file;

    let code;
    
    const fs = require('fs');
	if(file && fs.existsSync(file)){
		try {
            code = fs.readFileSync(file, "utf8");
		} catch (error) {
			console.error(error.stack ? error.stack : error)
		}		
	}else{

        if(data.interpretation === "0") {
            code = this.evalMessage(data.code, cache);
        } else {
            code = data.code;
        }
    }

    const result = this.eval(code, cache);    
    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage);
    this.storeValue(result, storage, varName, cache);
    
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
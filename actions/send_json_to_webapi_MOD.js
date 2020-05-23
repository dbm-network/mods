//---------------------------------------------------------------------
// Created by General Wrex
// My Patreons have made creating this script possible @ https://www.patreon.com/generalwrex
// At the time of editing this script, they are:
// - MitchDaGamer
//
// Thanks so much guys, you allow me to continue to do what i love!
//---------------------------------------------------------------------

var dbmMod = {};
dbmMod.version = "1.0.1";
dbmMod.requiredDBMVersion = "2.0.0-beta.7";

//---------------------------------------------------------------------
// Action Name
//
// This is the name of the action displayed in the editor.
//---------------------------------------------------------------------
dbmMod.name = "Send Json to WebAPI";

//---------------------------------------------------------------------
// Action Section
//
// This is the section the action will fall into.
//---------------------------------------------------------------------

dbmMod.section = "JSON Things";

//---------------------------------------------------------------------
// DBM Mods Manager Variables (Optional but nice to have!)
//
// These are variables that DBM Mods Manager uses to show information
// about the mods for people to see in the list.
//---------------------------------------------------------------------

// Who made the mod (If not set, defaults to "DBM Mods")
dbmMod.author = "General Wrex";

// The version of the mod (Defaults to 1.0.0)
dbmMod.version = "2.0.0";

// A short description to show on the mod line for this mod (Must be on a single line)
dbmMod.short_description = "Allows it to push Json to the Web";

// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
dbmMod.depends_on_mods = ["WrexMODS"];

//---------------------------------------------------------------------
// Dependencies Section
//
// If your action requires any node modules, add them here.
//---------------------------------------------------------------------

dbmMod.dependencies = ["request" ,"valid-url"];

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

dbmMod.subtitle = function(data) {
	return `Store: ${data.varName} DebugMode: ${data.debugMode === "1" ? "Enabled" : "Disabled"}`;
};

//---------------------------------------------------------------------
// Action Subtitle
//
// This function generates the subtitle displayed next to the name.
//---------------------------------------------------------------------

dbmMod.subtitle = function(data) {
	return `Store: ${data.varName} DebugMode: ${data.debugMode === "1" ? "Enabled" : "Disabled"}`;
};

//---------------------------------------------------------------------
// Action Storage Function
//
// Stores the relevant variable info for the editor.
//---------------------------------------------------------------------

dbmMod.variableStorage = function(data ,varType) {
	const type = parseInt(data.storage);
	if (type !== varType) return;
	return ([data.varName ,"JSON Object"]);
};

//---------------------------------------------------------------------
// Action Fields
//
// These are the fields for the action. These fields are customized
// by creating elements with corresponding IDs in the HTML. These
// are also the names of the fields stored in the action's JSON data.
//---------------------------------------------------------------------

dbmMod.fields = ["hideUrl" ,"debugMode" ,"postUrl" ,"postJson" ,"storage" ,"varName" ,"token" ,"user" ,"pass" ,"headers" ,"method"];

//---------------------------------------------------------------------
// Command HTML
//
// This function returns a string containing the HTML used for
// editing actions.
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

dbmMod.html = function(isEvent ,data) {

	return `
    <div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
    <div class="embed" style="width:98%;">
        <embedleftline></embedleftline><div class="embedinfo">
            <span class="embed-auth">
              <u><span class="wrexlink" data-url="https://github.com/Discord-Bot-Maker-Mods/DBM-Mods">Mod Info:</span></u><br>
                Made by ${this.author}
              </span><br>
            <span class="embed-desc">${this.short_description}<br>Added in: ${this.version}</span>
        </div>
    </div>
	<div>
</div><br>
    <div style="padding: 10px;" class="ui toggle checkbox">
         <input  type="checkbox"
                id="toggleAuth"
                onclick='document.getElementById("authSection").style.display = this.checked  ? "block" : "none";'>
         <label><font color="white" style="font-size: 90%;">Show URL & Connection Options</font></label>
         <text style="font-size: 60%;">Show/Hide the Url and Connection Options</text>
    </div><br>
    <div id="authSection" style="display: none; ">
        WebAPI Url:<br>
	      <input id="postUrl" class="round" type="text">
      <text style="font-size: 60%">The url needs to accept&nbsp&nbsp<code style="background-color: black">application/json</code></text><br>
        Headers: (By default 'User-Agent: Other' is applied, It's 1 per line, (<b>key:value</b>))<br>
		    <textarea id="headers" class="round" placeholder="User-Agent: Other" style="width: 99%; resize: none;" type="textarea" rows="4" cols="20"></textarea>
        <text style="font-size: 60%">If the API requires headers or something thats not included on the form, use headers!</text><br>
        Bearer Token:<br>
		    <textarea id="token" class="round" placeholder="blank if none" style="width: 99%; resize: none;" type="textarea" rows="4" cols="20"></textarea>
        <text style="font-size: 60%">If the API requires a bearer token, input it in the field above!</text><br>
		    Username:<br>
		    <input id="user" class="round"  placeholder="blank if none" style="width: 99%; resize: none;" ><br>
		    Password:<br>
		    <input id="pass" class="round"  placeholder="blank if none"  style="width: 99%; resize: none;" >
        <text style="font-size: 60%">If the API requires basic authentication, use username and password! </text><br>
    </div>
	  <div style="padding-top: 4px;">
        Method:<br>
           <select id="method" class="round" style="width: 15%;">
            <option value="POST" selected>Post</option>
            <option value="PATCH">Patch</option>
            <option value="PUT">Put</option>
            <option value="DELETE">Delete</option>
          </select>
        <br>
	      Json To Post:<br>
	      <textarea id="postJson" rows="13" style="width: 99%; white-space: nowrap; resize: none;"></textarea>
      <text style="font-size: 60%">This must parse into Json or be Json!.<br>
	  </div><br>
	  <div>
	    <div style="float: left; width: 35%;">
		    Store Response In:<br>
		    <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
		      ${data.variables[0]}
		    </select>
	    </div>
	    <div id="varNameContainer" style="display: none; float: right; width: 60%;">
		    Response Variable Name: <br>
		    <input id="varName" class="round" type="text">
	   </div><br><br><br><br>
	   <div>
			  Debug Mode (Print More Info To Console):<br>
		    <select id="debugMode" class="round" style="width: 45%">
			    <option value="0">Disabled</option>
			    <option value="1" selected>Enabled</option>
		    </select><br>
	   </div>
	   <div>
	      <p>
		      <u>Note:</u><br>
		      If Debug Mode is enabled, check the Bot Log or the Bot Console for the response data!<br>
		      Use <b>Parse From Stored Json</b> to parse the response into a variable!<br><br>
	      </p>
	   </div>
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
</style>`;
};

//---------------------------------------------------------------------
// Action Editor Init Code
//
// When the HTML is first applied to the action editor, this code
// is also run. This helps add modifications or setup reactionary
// functions for the DOM elements.
//---------------------------------------------------------------------

dbmMod.init = function() {
	const {
		glob ,
		document
	} = this;

	var wrexlinks = document.getElementsByClassName("wrexlink");
	for(var x = 0; x < wrexlinks.length; x++) {

		var wrexlink = wrexlinks[x];
		var url = wrexlink.getAttribute("data-url");
		if(url){
			wrexlink.setAttribute("title" ,url);
			wrexlink.addEventListener("click" ,function(e){
				e.stopImmediatePropagation();
				console.log("Launching URL: [" + url + "] in your default browser.");
				require("child_process").execSync("start " + url);
			});
		}
	}

	glob.variableChange(document.getElementById("storage") ,"varNameContainer");
};

//---------------------------------------------------------------------
// Action Bot Function
//
// This is the function for the action within the Bot's Action class.
// Keep in mind event calls won't have access to the "msg" parameter,
// so be sure to provide checks for variable existance.
//---------------------------------------------------------------------

dbmMod.action = function(cache) {

	const data = cache.actions[cache.index];
	const Actions = this;

	const WrexMODS = this.getWrexMods();
	const request = WrexMODS.require("request");
	const buffer = WrexMODS.require("buffer");

	const url = this.evalMessage(data.postUrl ,cache);
	const method = this.evalMessage(data.method ,cache);
	const token = this.evalMessage(data.token ,cache);
	const user = this.evalMessage(data.user ,cache);
	const pass = this.evalMessage(data.pass ,cache);
	const headers = this.evalMessage(data.headers ,cache);



	const varName = this.evalMessage(data.varName ,cache);
	const storage = parseInt(data.storage);
	const debugMode = parseInt(data.debugMode);

	const postJson = this.evalMessage(data.postJson ,cache);

	if (!WrexMODS.checkURL(url)) {
		url = encodeURI(url);
	}

	if (WrexMODS.checkURL(url)) {

		if (postJson) {
			// Test the json

			try {
				var test = JSON.parse(JSON.stringify(postJson));
			} catch (error) {
				var errorJson = JSON.stringify({
					error: error ,
					statusCode: statusCode ,
					success: false
				});
				console.error(error.stack ? error.stack : error);

				return this.storeValue(errorJson ,storage ,varName ,cache);
			}


			let setHeaders = {};

			// set default required header
			setHeaders["User-Agent"] = "Other";
			setHeaders["Content-Type"] = "application/json";

			const buffer = require("buffer/").Buffer;

			// if user or pass, apply it to headers
			if(user || pass) setHeaders["Authorization"] = "Basic " + buffer.from(user + ":" + pass).toString("base64");

			// if token, apply it to headers
			if(token) setHeaders["Authorization"] = "Bearer " + token;


			// Because headers are a dictionary ;)
			if(headers){
				var lines = String(headers).split("\n");
				for(var i = 0;i < lines.length;i++){
					var header = lines[i].split(":");

					if(lines[i].includes(":") && header.length > 0){
						var key = header[0] || "Unknown";
						var value = header[1] || "Unknown";
						setHeaders[key] = value;

						if(_DEBUG) console.log("Applied Header: " + lines[i]);
					}else{
						console.error(`WebAPI: Error: Custom Header line ${lines[i]} is wrongly formatted. You must split the key from the value with a colon (:)`);
					}
				}
			}

			request({
				method: method ||"POST" ,
				url: url ,
				body: JSON.parse(postJson) ,
				json: true ,
				headers: setHeaders
			} ,(error ,res ,jsonData) => {

				try {
					if (error) {
						var errorJson = JSON.stringify({
							error ,
							statusCode
						});
						Actions.storeValue(errorJson ,storage ,varName ,cache);

						console.error("WebAPI: Error: " + errorJson + " stored to: [" + varName + "]");
					} else {
						if (jsonData) {
							Actions.storeValue(jsonData ,storage ,varName ,cache);

							if (debugMode) {
								console.log("WebAPI: JSON Data Response value stored to: [" + varName + "]");
								console.log("Response (Disable DebugMode to stop printing the response data to the console):\r\n");
								console.log(JSON.stringify(jsonData ,null ,4));
							}
						} else {
							var errorJson = JSON.stringify({
								error ,
								statusCode
							});
							Actions.storeValue(errorJson ,storage ,varName ,cache);

							console.error("WebAPI: Error: " + errorJson + " stored to: [" + varName + "]");
						}
					}

					Actions.callNextAction(cache);

				} catch (err) {
					console.error(err.stack ? err.stack : err);
				}

			});
		}
	} else {
		console.error("URL [" + url + "] Is Not Valid");
	}
};


//---------------------------------------------------------------------
// Action Bot Mod
//
// Upon initialization of the bot, this code is run. Using the bot's
// DBM namespace, one can add/modify existing functions if necessary.
// In order to reduce conflictions between mods, be sure to alias
// functions you wish to overwrite.
//---------------------------------------------------------------------

dbmMod.mod = function(DBM) {

};

module.exports = dbmMod;

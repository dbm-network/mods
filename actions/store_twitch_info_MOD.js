module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Store Twitch Info",

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
		const sourceType = parseInt(data.type);//"Channel", "Stream", "Video" or "Game"
		const inputType = parseInt(data.inputtype);//"ID" or "Name"

		const info1 = parseInt(data.info1);
		const info2 = parseInt(data.info2);
		const info3 = parseInt(data.info3);
		const info4 = parseInt(data.info4);

		const list1 = [ "User ID", "User Login Name", "User Display Name", "User Type", "Broadcaster Type", "Channel Description", "Channel Profile Picture", "Channel Offline Picture", "Channel View Count", "Channel Follower Count"];//User & Channel Info
		const list2 = ["Stream ID", "User ID", "User Display Name", "Game ID", "Community IDs", "Live Status", "Stream Title", "Viewer Count", "Started At Time", "Language Code", "Thumbnail URL", "Tag IDs"];//Stream Info
		const list3 = ["Video IDs", "User IDs", "User Display Names", "Video Titles", "Video Descriptions", "Video Creation Dates", "Video Publish Dates", "Video URLs", "Video Thumbnail URLs", "Videos Viewable?", "Video Viewcounts", "Video Languages", "Video Types", "Video Durations"];//Video Info
		const list4 = ["Game ID", "Game Name", "Game Box Art URL", "Popular Games List (Game IDs)", "Popular Games List (Game Names)", "Popular Games List (Game Box Art URLs)"];//Game Info
		
		let infoNum1 = 0;
		let infoNum2;
		let infoList1 = [];
		let infoList2 = [];
		let infoName1 = '';
		let infoName2 = '';

		switch(sourceType) {//"Channel", "Stream", "Video" or "Game"
			case 0:
				infoList1 = list1;//Channel
				infoNum1 = info1;
				infoName2 = 'Channel';
				switch(inputType) {
					case 0://User ID
						infoName1 = 'ID';
						break;
					case 1://User Login Name
						if(sourceType > 0) {
							infoName1 = 'ID';
						} else if (info1 < 9) {
							infoName1 = 'Login Name';
						} else {
							infoName1 = 'ID';
						};
						break;
				};
				break;
			case 1:
				infoList1 = list2;//Stream
				infoNum1 = info2;
				infoName2 = 'User';
				break;
			case 2:
				infoList1 = list3;//Video
				infoNum1 = info3;
				infoName2 = 'Video';
				break;
			case 3:
				infoList1 = list4;//Game
				infoNum1 = info4;
				infoName2 = 'Game';
				switch(inputType) {
					case 0:
						infoName1 = 'ID';
						break;
					case 1:
						infoName1 = 'Name';
						break;
				};
				break;
		};

		infoList2.push(`from ${infoName2} ${infoName1} "${data.input.toString()}"`);
		infoList2.push('');

		if(info4 > 2 && sourceType == 3) {
			infoNum2 = 1;
		} else {
			infoNum2 = 0;
		};

		return `Get "${infoList1[parseInt(infoNum1)]}" ${infoList2[parseInt(infoNum2)]}`;
	},

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "ZockerNico",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.9.5", //Added in 1.9.5

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "This mod will store a specific information from Twitch.",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
	depends_on_mods: [
		{name:'WrexMODS',path:'aaa_wrexmods_dependencies_MOD.js'}
	],

	//---------------------------------------------------------------------

	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		const sourceType = parseInt(data.type);//"Channel", "Stream", "Video" or "Game"
		const inputType = parseInt(data.inputtype);//"ID" or "Name"
		if (type !== varType) return;
		let dataType = "Unknown Type";

		if(sourceType == 0) {//Source Type: Channel
			var info1 = parseInt(data.info1);
			switch(info1) {
				case 0: 
				case 8:
				case 9: dataType = "Number"; break;
				case 1:
				case 2:
				case 3:
				case 4:
				case 5: dataType = "Text"; break;
				case 6:
				case 7: dataType = "Image URL"; break;
			};
		} else if (sourceType == 1) {//Source Type: Stream
			var info2 = parseInt(data.info2);
			switch(info2) {
				case 0:
				case 1:
				case 3:
				case 7:
				case 8: dataType = "Number"; break;
				case 2:
				case 6:
				case 9: dataType = "Text"; break;
				case 5: dataType = "Boolean"; break;
				case 10: dataType = "Image URL"; break;
				case 4:
				case 11: dataType = "List"; break;
			}
		} else if (sourceType == 2) {//Source Type: Video
			/*var info3 = parseInt(data.info3);*/
			dataType = "List";
		} else if (sourceType == 3) {//Source Type: Game
			var info4 = parseInt(data.info4);
			switch(info4) {
				case 0:
					dataType = "Number";
					break;
				case 1:
					dataType = "Text";
					break;
				case 2:
					dataType = "Image URL";
					break;
				case 3:
				case 4:
				case 5:
					dataType = "List";
					break;
			};
		};

		return ([data.varName, dataType]);
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["wrexdiv", "type", "divinputtype", "inputtype", "divinput", "input", "divinfo1", "info1", "divinfo2", "info2", "divinfo3", "info3", "divinfo4", "info4", "clientid", "results", "divresults", "storage", "varName"],

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
	<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
	<div>
		<p>
			<u>Mod Info:</u><br>
			Made by ZockerNico<br>
			Idea by Ju#0007<br>
		</p>
	</div>
	<div style="float: left; width: 42%;">
		<br>Source Type:<br>
		<select id="type" class="round" onchange="glob.onChange1(this)">
			<option value="0" selected>Channel Info</option>
			<option value="1">Stream Info</option>
			<option value="2">Video Info</option>
			<option value="3">Game Info</option>
		</select>
	</div>
	<div id="divinputtype" style="padding-left: 5%; float: left; width: 52%; display: none;">
		<br>Input Type:<br>
		<select id="inputtype" class="round" onchange="glob.onChange2(this)" style="display: none;">
			<option value="0" selected>ID</option>
			<option value="1">Name</option>
		</select>
	</div>
	<div id="divinput" style="float: left; width: 99%; padding-top: 8px;">
		<span id="tempName1">User</span> <span id="tempName2">ID</span>:<br>
		<textarea id="input" rows="2" placeholder="Please insert the needed information..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	</div>
	<div id="divinfo1"; style="float: left; width: 94%; padding-top: 8px; display: none;" onchange="glob.onChange3(this)">
		Source Channel Info:<br>
		<select id="info1" class="round">
			<option value="0">User ID</option>
			<option value="1">User Login Name</option>
			<option value="2" selected>User Display Name</option>
			<option value="3">User Type</option>
			<option value="4">Broadcaster Type</option>
			<option value="5">Channel Description</option>
			<option value="6">Channel Profile Picture URL</option>
			<option value="7">Channel Offline Picture URL</option>
			<option value="8">Channel View Count</option>
			<option value="9">Channel Follower Count</option>
		</select>
	</div>
	<div id="divinfo2"; style="float: left; width: 94%; padding-top: 8px; display: none;">
		Source Stream Info:<br>
		<select id="info2" class="round">
			<option value="5">Is Live?</option>
			<option value="0">Stream ID</option>
			<option value="6" selected>Stream Title</option>
			<option value="7">Viewer Count</option>
			<option value="8">Started At</option>
			<option value="9">Language Code</option>
			<option value="10">Thumbnail URL</option>
			<option value="1">User ID</option>
			<option value="2">User Display Name</option>
			<option value="3">Game ID</option>
			<option value="4">Community IDs</option>
			<option value="11">Tag IDs</option>
		</select>
	</div>
	<div id="divinfo3"; style="float: left; width: 94%; padding-top: 8px; display: none;">
		Source Video Info:<br>
		<select id="info3" class="round">
			<option value="1">User IDs</option>
			<option value="2">User Display Names</option>
			<option value="0">Video IDs</option>
			<option value="3" selected>Video Titles</option>
			<option value="4">Video Descriptions</option>
			<option value="5">Video Creation Dates</option>
			<option value="6">Video Publish Dates</option>
			<option value="7">Video URLs</option>
			<option value="8">Video Thumbnail URLs</option>
			<option value="9">Videos Viewable?</option>
			<option value="10">Video Viewcounts</option>
			<option value="11">Video Languages</option>
			<option value="12">Video Types</option>
			<option value="13">Video Durations</option>
		</select>
	</div>
	<div id="divinfo4"; style="float: left; width: 94%; padding-top: 8px; display: none;" onchange="glob.onChange4(this)">
		Source Game Info:<br>
		<select id="info4" class="round">
			<option value="0">Game ID</option>
			<option value="1">Game Name</option>
			<option value="2">Game Box Art URL</option>
			<option value="3">Popular Games List (Game IDs)</option>
			<option value="4">Popular Games List (Game Names)</option>
			<option value="5">Popular Games List (Game Box Art URLs)</option>
		</select>
	</div>
	<div style="float: left; width: 104.5%; padding-top: 8px;">
		Client ID:<br>
		<input id="clientid" class="round" type="text" placeholder="Insert your Twitch Application Client ID...">
	</div>
	<div id="divresults" style="float: left; width: 95%; padding-top: 8px; display: none;">
		Max Results:<br>
		<input id="results" class="round" type="text" placeholder="Default: 20 | Max: 100">
	</div>
	<div>
		<div style="float: left; width: 35%;  padding-top: 8px;">
			Store In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%; padding-top: 8px;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
		<div style="float: left; padding-top: 8px;">
			<p>
				<u>API Info:</u><br>
				You will need a <span class="wrexlink" data-url="https://glass.twitch.tv/console/apps">Twitch Client ID</span> to use this mod!<br><br>
				<u>Client ID Introductions:</u><br>
				To get a client id: login through Twitch, create a new application. Then insert your favourite application name & some url (this could be your GitHub page).<br>
				Then select the category "Application Integration" down below and click on create! You should now be in your application list again.<br>
				You need to edit your application once more to copy the client id.<br><br>
				<u>API Limitations:</u><br>
				Please go to the <span class="wrexlink2" data-url2="https://dev.twitch.tv/docs/api/guide/#rate-limits">Twitch API Rate Limits Page</span> if need this information.<br><br>
				<u>Explanations of individual source types:</u><br>
				• User Types: "staff", "admin", "global_mod" or ""<br>
				• Broadcaster Types: "partner", "affiliate" or ""<br>
				• Video Types: "upload", "archive" or "highlight"<br>
				• Video Duration: Will return something like "3h8m33s"<br>
			</p>
		</div>
	</div>
	</div>
	<style>
	  span.wrexlink {
		color: #99b3ff;
		text-decoration:underline;
		cursor:pointer;
	  }
	  span.wrexlink:hover {
		color:#4676b9; 
	  }
	  span.wrexlink2 {
		color: #99b3ff;
		text-decoration:underline;
		cursor:pointer;
	  }
	  span.wrexlink2:hover {
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

	init: function () {
		const { glob, document } = this;
		
		try {//Used for the Twitch API link | Made by General Wrex
			var WrexMODS = require(require('path').join(__dirname,'aaa_wrexmods_dependencies_MOD.js')).getWrexMods();
							
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
			};

			var wrexlinks2 = document.getElementsByClassName("wrexlink2")
			for(var x2 = 0; x2 < wrexlinks2.length; x2++) {
	  
		  		var wrexlink2 = wrexlinks2[x2];
		  		var url2 = wrexlink2.getAttribute('data-url2');   
		  		if(url2){
					wrexlink2.setAttribute("title", url2);
					wrexlink2.addEventListener("click", function(e2){
			  			e2.stopImmediatePropagation();
			  			console.log("Launching URL: [" + url2 + "] in your default browser.")
			  			require('child_process').execSync('start ' + url2);
					});
		  		}
			};

		} catch (error) {//Write any init errors to errors.txt in dbm's main directory
			require("fs").appendFile("errors.txt", error.stack ? error.stack : error + "\r\n"); 
		};

		glob.onChange1 = function(event) {//"Channel", "Stream", "Video" or "Game"
			//Load HTML Stuff
			const id1 = parseInt(document.getElementById('type').value);//Source Type: "Channel", "Stream", "Video" or "Game"
			const infoDiv1 = document.getElementById('divinfo1');//Source Channel Info
			const info1 = document.getElementById('info1');//Source Channel Info
			const infoDiv2 = document.getElementById('divinfo2');//Source Stream Info
			const info2 = document.getElementById('info2');//Source Stream Info
			const infoDiv3 = document.getElementById('divinfo3');//Source Video Info
			const info3 = document.getElementById('info3');//Source Video Info
			const infoDiv4 = document.getElementById('divinfo4');//Source Game Info
			const info4 = document.getElementById('info4');//Source Game Info
			const input = document.getElementById('input');//InputField
			const inputDiv = document.getElementById('divinput');//Div of InputField
			const inputType = document.getElementById('inputtype');//InputType: "ID" or "Name"
			const inputTypeDiv = document.getElementById('divinputtype');//Div of InputType
			const results = document.getElementById('results');//Max Results
			const resultsDiv = document.getElementById('divresults');//Max Results
			const inputList1 = ['ID', 'Login Name'];//List for "switch": "case 0"
			const inputList2 = ['ID', 'Name'];//List for "switch": "case 3"

			//Change HTML Stuff
			let result1 = '';
			let result2 = '';
			switch(id1) {
				case 0://User & Channel
					result1 = 'User';
					if(parseInt(info1.value) < 9) {
						result2 = inputList1[parseInt(inputType.value)];
						inputType.style.display = null;
						inputTypeDiv.style.display = null;
					} else {
						result2 = 'ID';
						inputType.style.display = 'none';
						inputTypeDiv.style.display = 'none';
					};
					infoDiv1.style.display = null;
					info1.style.display = null;
					infoDiv2.style.display = 'none';
					info2.style.display = 'none';
					infoDiv3.style.display = 'none';
					info3.style.display = 'none';
					infoDiv4.style.display = 'none';
					info4.style.display = 'none';
					/*inputType.style.display = null;
					inputTypeDiv.style.display = null;*/
					results.style.display = 'none';
					resultsDiv.style.display = 'none';
					break;
				case 1://Stream
					result1 = 'User';
					result2 = 'ID';
					infoDiv1.style.display = 'none';
					info1.style.display = 'none';
					infoDiv2.style.display = null;
					info2.style.display = null;
					infoDiv3.style.display = 'none';
					info3.style.display = 'none';
					infoDiv4.style.display = 'none';
					info4.style.display = 'none';
					inputType.style.display = 'none';
					inputTypeDiv.style.display = 'none';
					results.style.display = 'none';
					resultsDiv.style.display = 'none';
					break;
				case 2://Video
					result1 = 'Video'
					result2 = 'ID';
					infoDiv1.style.display = 'none';
					info1.style.display = 'none';
					infoDiv2.style.display = 'none';
					info2.style.display = 'none';
					infoDiv3.style.display = null;
					info3.style.display = null;
					infoDiv4.style.display = 'none';
					info4.style.display = 'none';
					inputType.style.display = 'none';
					inputTypeDiv.style.display = 'none';
					results.style.display = null;
					resultsDiv.style.display = null;
					break;
				case 3://Game
					result1 = 'Game';
					result2 = inputList2[parseInt(inputType.value)];
					if(parseInt(info4.value) < 3) {
						inputType.style.display = null;
						inputTypeDiv.style.display = null;
					} else {
						inputType.style.display = 'none';
						inputTypeDiv.style.display = 'none';
					};
					infoDiv1.style.display = 'none';
					info1.style.display = 'none';
					infoDiv2.style.display = 'none';
					info2.style.display = 'none';
					infoDiv3.style.display = 'none';
					info3.style.display = 'none';
					infoDiv4.style.display = null;
					info4.style.display = null;
					/*inputType.style.display = null;
					inputTypeDiv.style.display = null;*/
					results.style.display = 'none';
					resultsDiv.style.display = 'none';
					break;
			};

			//Reload HTML Stuff
			document.getElementById('tempName1').innerHTML = result1;
			document.getElementById('tempName2').innerHTML = result2;
		};

		glob.onChange2 = function(event) {//"ID" or "Login Name"
			//Load HTML Stuff
			const id1 = parseInt(document.getElementById('type').value);//Source Type: "Channel", "Stream", "Video" or "Game"
			const id2 = parseInt(document.getElementById('inputtype').value);//Input Type

			//Change HTML Stuff
			let result = '';
			if(id1 == 0) {
				switch(id2) {
					case 0:
						result = 'ID';
						break;
					case 1:
						if(id2 > 0) {
							result = 'Login Name';
						} else {
							result = 'ID';
						};
						break;
				};
			} else if (id1 == 3) {
				switch(id2) {
					case 0:
						result = 'ID';
						break;
					case 1:
						result = 'Name';
				};
			} else {
				result = 'ID';
			};
			

			//Reload HTML Stuff
			document.getElementById('tempName2').innerHTML = result;
		};

		glob.onChange3 = function(event) {//Source Channel Info
			//Load HTML Stuff
			const id4 = parseInt(document.getElementById('info1').value);//Source Channel Info
			const inputType = document.getElementById('inputtype');//InputType: "ID" or "Login Name"
			const inputTypeDiv = document.getElementById('divinputtype');//Div of InputType
			const inputList1 = ['ID', 'Login Name'];//List for "case 0"

			//Change HTML Stuff

			let result2 = '';
			if(id4 < 9) {
				inputType.style.display = null;
				inputTypeDiv.style.display = null;
				result2 = inputList1[parseInt(inputType.value)];
			} else {
				inputType.style.display = 'none';
				inputTypeDiv.style.display = 'none';
				result2 = 'ID';
			};

			//Reload HTML Stuff
			document.getElementById('tempName2').innerHTML = result2;
		};

		glob.onChange4 = function(event) {//Source Game Info
			//Load HTML Stuff
			const id1 = parseInt(document.getElementById('type').value);//Source Type: "Channel", "Stream", "Video" or "Game"
			const id5 = parseInt(document.getElementById('info4').value);//Source Game Info
			const inputType = document.getElementById('inputtype');//InputType: "ID" or "Login Name"
			const inputTypeDiv = document.getElementById('divinputtype');//Div of InputType

			//Change HTML Stuff
			if(id1 == 3) {
				if(parseInt(id5) < 3) {
					inputType.style.display = null;
					inputTypeDiv.style.display = null;
				} else {
					inputType.style.display = 'none';
					inputTypeDiv.style.display = 'none';
				};
			} else if(id1 == 1 || id1 == 2) {
				inputType.style.display = 'none';
				inputTypeDiv.style.display = 'none';
			} else {
				inputType.style.display = null;
				inputTypeDiv.style.display = null;
			};
		};

		//Load HTML Stuff if a user opens the action in DBM
		document.getElementById('type');
		document.getElementById('inputtype').style.display = null;
		document.getElementById('divinputtype').style.display = null;
		document.getElementById('info1');
		document.getElementById('info4');

		//On Type Change
		glob.onChange1(document.getElementById('type'));//For the "Source Type"
		glob.onChange2(document.getElementById('inputtype'));//For the "Input Type"
		glob.onChange3(document.getElementById('info1'));//For Source Info: Channel
		glob.onChange4(document.getElementById('info4'));//For Source Info: Game
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
		const data = cache.actions[cache.index];
		const _this = this;//Just to be sure
		const WrexMODS = this.getWrexMods();//As always.
		const request = WrexMODS.require('request');

		const input = this.evalMessage(data.input, cache);//The inserted "ID" or "Name"
		const clientID = this.evalMessage(data.clientid, cache);
		const sourceType = parseInt(data.type);//"Channel", "Stream", "Video" or "Game"
		const inputType = parseInt(data.inputtype);//Channel "ID" or "Name"
		let searchResults = parseInt(data.results);//Default: 20 | Max: 100 (Because of API limitation!)
		let infoType = 0;
		const info1 = parseInt(data.info1);
		const info2 = parseInt(data.info2);
		const info3 = parseInt(data.info3);
		const info4 = parseInt(data.info4);
		switch(sourceType) {
			case 0:
				infoType = info1;
				break;
			case 1:
				infoType = info2;
				break;
			case 2:
				infoType = info3;
				break;
			case 3:
				infoType = info4;
				break;
		};



		//Check Input
		if(!clientID) {return console.log('Please insert a client id!')};
		if(!input) {return console.log('Please insert something to search for!')};

		if(searchResults > 0) {
			if(searchResults > 100) {
				searchResults = 100;//Max value
			};
		} else {//Default value
			searchResults = 20;
		};



		if(sourceType == 0) {//Soure Info: Channel

			if(inputType == 0 || infoType == 9) {//Input Type: ID

				if(infoType < 9) {
					var options = {
						url: `https://api.twitch.tv/helix/users?id=${input}`,
						headers: {
							'Client-ID': `${clientID}`
						}
					};
				} else {
					var options = {
						url: `https://api.twitch.tv/helix/users/follows?to_id=${input}&first=2`,
						headers: {
							'Client-ID': `${clientID}`
						}
					};
				};
				
				function callback(error, response, body) {
					if (!error && response.statusCode == 200) {
					  	var info = JSON.parse(body);
					  	let result = '';
						if(!info.data[0]) {
							console.log(`No results for ${input}.`);
							return _this.callNextAction(cache);
						};
						switch(infoType) {
							case 0: result = info.data[0].id; break;
							case 1: result = info.data[0].login; break;
							case 2: result = info.data[0].display_name; break;
							case 3: result = info.data[0].type; break;//"staff", "admin", "global_mod", or ""
							case 4: result = info.data[0].broadcaster_type; break;//"partner", "affiliate", or ""
							case 5: result = info.data[0].description; break;
							case 6: result = info.data[0].profile_image_url; break;
							case 7: result = info.data[0].offline_image_url; break;
							case 8: result = info.data[0].view_count; break;
							case 9: result = info.total; break;
						};
						if (result !== undefined) {
							const storage = parseInt(data.storage);
							const varName = _this.evalMessage(data.varName, cache);
							_this.storeValue(result, storage, varName, cache);
							_this.callNextAction(cache);
						};
					} else {
						console.error(error);
					};
				};
				request(options, callback);

			} else if (inputType == 1 && infoType < 9) {//Input Type: Name

				var options = {
					url: `https://api.twitch.tv/helix/users?login=${input}`,
					headers: {
						'Client-ID': `${clientID}`
					}
				};
				function callback(error, response, body) {
					if (!error && response.statusCode == 200) {
					  	var info = JSON.parse(body);
					  	let result = '';
						if(!info.data[0]) {
							console.log(`No results for ${input}.`);
							return _this.callNextAction(cache);
						};
						switch(infoType) {
							case 0: result = info.data[0].id; break;
							case 1: result = info.data[0].login; break;
							case 2: result = info.data[0].display_name; break;
							case 3: result = info.data[0].type; break;//"staff", "admin", "global_mod", or ""
							case 4: result = info.data[0].broadcaster_type; break;//"partner", "affiliate", or ""
							case 5: result = info.data[0].description; break;
							case 6: result = info.data[0].profile_image_url; break;
							case 7: result = info.data[0].offline_image_url; break;
							case 8: result = info.data[0].view_count; break;
						};
						if (result !== undefined) {
							const storage = parseInt(data.storage);
							const varName = _this.evalMessage(data.varName, cache);
							_this.storeValue(result, storage, varName, cache);
							_this.callNextAction(cache);
						};
					} else {
						console.error(error);
					};
				};
				request(options, callback);

			} else {//Input Type: Undefined
				return console.log('Please select either "User ID" or "User Login Name"!');
			};

		} else if (sourceType == 1) {//Source Info: Stream

			//Input Type: ID
			var options = {
				url: `https://api.twitch.tv/helix/streams?user_id=${input}`,
				headers: {
					'Client-ID': `${clientID}`
				}
			};
			function callback(error, response, body) {
				if (!error && response.statusCode == 200) {
					var info = JSON.parse(body);
					let result = '';
					let result2 = false;
					if(!info.data[0]) {
						if(infoType == 5) {
							const storage = parseInt(data.storage);
							const varName = _this.evalMessage(data.varName, cache);
							_this.storeValue(result2, storage, varName, cache);
						} else {
							console.log(`No results for ${input}.`);
						};
						return _this.callNextAction(cache);
					};
					switch(infoType) {
						case 0: result = info.data[0].id; break;
						case 1: result = info.data[0].user_id; break;
						case 2: result = info.data[0].user_name; break;//Same as "Display Name"
						case 3: result = info.data[0].game_id; break;
						case 4: result = info.data[0].community_ids; break;
						case 5: result2 = true; break;//"live" or ""
						case 6: result = info.data[0].title; break;
						case 7: result = info.data[0].viewer_count; break;
						case 8: result = info.data[0].started_at; break;
						case 9: result = info.data[0].language; break;
						case 10: result = info.data[0].thumbnail_url.replace('{width}', '1920').replace('{height}', '1280'); break;
						case 11: result = info.data[0].tag_ids; break;
					};
					if (result !== undefined) {
						const storage = parseInt(data.storage);
						const varName = _this.evalMessage(data.varName, cache);
						_this.storeValue(result, storage, varName, cache);
						_this.callNextAction(cache);
					} else if (result2 !== undefined || result2 === false || result2 === true) {
						const storage = parseInt(data.storage);
						const varName = _this.evalMessage(data.varName, cache);
						_this.storeValue(result2, storage, varName, cache);
						_this.callNextAction(cache);
					};
				} else {
					console.error(error);
				};
			};
			request(options, callback);

		} else if (sourceType == 2) {//Source Info: Video

			//Input Type: ID
			var options = {
				url: `https://api.twitch.tv/helix/videos?user_id=${input}&first=${searchResults}`,
				headers: {
					'Client-ID': `${clientID}`
				}
			};
			function callback(error, response, body) {
				if (!error && response.statusCode == 200) {
					var info = JSON.parse(body);
					let result = [];
					if(!info.data[0]) {
						console.log(`No results for ${input}.`);
						return _this.callNextAction(cache);
					};
					switch(infoType) {
						case 0: info.data.forEach(video => result.push(video.id)); break;
						case 1: info.data.forEach(video => result.push(video.user_id)); break;
						case 2: info.data.forEach(video => result.push(video.user_name)); break;//Same as "Display Name"
						case 3: info.data.forEach(video => result.push(video.title)); break;
						case 4: info.data.forEach(video => result.push(video.description)); break;
						case 5: info.data.forEach(video => result.push(video.created_at)); break;
						case 6: info.data.forEach(video => result.push(video.published_at)); break;
						case 7: info.data.forEach(video => result.push(video.url)); break;
						case 8: info.data.forEach(video => result.push(video.thumbnail_url.replace('%{width}', '1920').replace('%{height}', '1280'))); break;
						case 9: info.data.forEach(video => {if(video.viewable !== '' || video.viewable !== undefined) {if(video.viewable == 'public') {result.push(true)} else if(video.viewable == 'private') {result.push(false)}}}); break;//"public" or "private"
						case 10: info.data.forEach(video => result.push(video.view_count)); break;
						case 11: info.data.forEach(video => result.push(video.language)); break;
						case 12: info.data.forEach(video => result.push(video.type)); break;//"upload", "archive" or "highlight"
						case 13: info.data.forEach(video => result.push(video.duration)); break;
					};
					if (result !== undefined) {
						const storage = parseInt(data.storage);
						const varName = _this.evalMessage(data.varName, cache);
						_this.storeValue(result, storage, varName, cache);
						_this.callNextAction(cache);
					};
				} else {
					console.error(error);
				};
			};
			request(options, callback);

		} else if (sourceType == 3) {//Source Info: Game

			if(inputType == 0) {//Input Type: Game ID

				if(infoType < 3) {
					var options = {
						url: `https://api.twitch.tv/helix/games?id=${input}`,
						headers: {
							'Client-ID': `${clientID}`
						}
					};
				} else {
					var options = {
						url: 'https://api.twitch.tv/helix/games/top',
						headers: {
							'Client-ID': `${clientID}`
						}
					};
				};
				function callback(error, response, body) {
					if (!error && response.statusCode == 200) {
						var info = JSON.parse(body);
						let result;
						let result2 = [];
						if(!info.data[0]) {
							console.log(`No results for ${input}.`);
							return _this.callNextAction(cache);
						};
						switch(infoType) {
							case 0: result = info.data[0].id.toString(); break;
							case 1: result = info.data[0].name.toString(); break;
							case 2: result = info.data[0].box_art_url.replace('{width}', '1300').replace('{height}', '1730'); break;
							case 3: info.data.forEach(game => result2.push(game.id)); break;
							case 4: info.data.forEach(game => result2.push(game.name)); break;
							case 5: info.data.forEach(game => result2.push(game.box_art_url.replace('{width}', '1300').replace('{height}', '1730'))); break;
						};
						if (result !== undefined) {
							const storage = parseInt(data.storage);
							const varName = _this.evalMessage(data.varName, cache);
							_this.storeValue(result, storage, varName, cache);
							_this.callNextAction(cache);
						} else if (result2 !== undefined) {
							const storage = parseInt(data.storage);
							const varName = _this.evalMessage(data.varName, cache);
							_this.storeValue(result2, storage, varName, cache);
							_this.callNextAction(cache);
						};
					} else {
						console.error(error);
					};
				};
				request(options, callback);

			} else if (inputType == 1) {//Input Type: Game Name

				if(infoType < 3) {
					var options = {
						url: `https://api.twitch.tv/helix/games?id=${input}`,
						headers: {
							'Client-ID': `${clientID}`
						}
					};
				} else {
					var options = {
						url: `https://api.twitch.tv/helix/games/top?first=${searchResults}`,
						headers: {
							'Client-ID': `${clientID}`
						}
					};
				};
				function callback(error, response, body) {
					if (!error && response.statusCode == 200) {
						var info = JSON.parse(body);
						let result;
						let result2 = [];
						if(!info.data[0]) {
							console.log(`No results for ${input}.`);
							return _this.callNextAction(cache);
						};
						switch(infoType) {
							case 0: result = info.data[0].id.toString(); break;
							case 1: result = info.data[0].name.toString(); break;
							case 2: result = info.data[0].box_art_url.replace('{width}', '1300').replace('{height}', '1730'); break;
							case 3: info.data.forEach(game => result2.push(game.id)); break;
							case 4: info.data.forEach(game => result2.push(game.name)); break;
							case 5: info.data.forEach(game => result2.push(game.box_art_url.replace('{width}', '1300').replace('{height}', '1730'))); break;
						};
						if (result !== undefined) {
							const storage = parseInt(data.storage);
							const varName = _this.evalMessage(data.varName, cache);
							_this.storeValue(result, storage, varName, cache);
							_this.callNextAction(cache);
						} else if (result2 !== undefined) {
							const storage = parseInt(data.storage);
							const varName = _this.evalMessage(data.varName, cache);
							_this.storeValue(result2, storage, varName, cache);
							_this.callNextAction(cache);
						};
					} else {
						console.error(error);
					};
				};
				request(options, callback);

			} else {//Input Type: Popular Games List
				return console.log('Please select either "Game ID" or "Game Name"!');
			};
		} else {//Source Type: Undefined
			return console.log('Please select either "Channel", "Stream", "Video" or "Game"!');//This will only be executed if there is an invaild action setting of the "Source Input".
		};
	},

	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//---------------------------------------------------------------------

	mod: function (DBM) {

	}

}; // End of module

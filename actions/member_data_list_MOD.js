module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Store Member Data List",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "Member Control",

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "Two",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.9.4", //Added in 1.9.4

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "This mod allows you to grab the members from a dataname then sort/dont sort it and/or use a result limit.",
	long_description: "While using this mod you can grab the members tag from a dataname that are stored in 'players.json'. You can use these members to sort their datas/dont sort and/or use a result limit. This mod can be used to make a leaderboard without MySQL or any other SQL Database.",

	// If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods


	//---------------------------------------------------------------------
	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function (data) {
		return `${[(data.dataName)]}`
	},


	//---------------------------------------------------------------------
	// Action Storage Function
	//
	// Stores the relevant variable info for the editor.
	//---------------------------------------------------------------------

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		return ([data.varName2, 'Array']);
	},

	//---------------------------------------------------------------------
	// Action Fields
	//
	// These are the fields for the action. These fields are customized
	// by creating elements with corresponding IDs in the HTML. These
	// are also the names of the fields stored in the action's JSON data.
	//---------------------------------------------------------------------

	fields: ["debu", "numbefst2", "numbefst", "numbefstselect", "sort", "start", "middle", "end", "getresults", "dataName", "varName2", "storage"],

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
	<html>
	<div id="wrexdiv2" style="width: 550px; height: 350px; overflow-y: scroll;">
<div>
<div style="padding-top: 8px;">
	<div style="float: left; width: 50%;">
		Data Name:<br>
		<input id="dataName" class="round" type="text">
	</div>
	<span>
	
</div>
      Number before start
<select id="numbefstselect" class="round" style="width:33%" onchange="glob.onChange1(this)">
<option value="1" >No</option>
<option value="2"selected>Yes</option>
</select> 
<br>


<div id="numbefst" style=" width: 80%; display: none;">
Char after Number:<br>
<input id="numbefst2" class="round" type="text" value=")">
</div>
<br>

	Start:
    
	<select id="start" class="round" style="width:33%">
	<option value="result" >Result</option>
	<option value="username"selected>Username</option>
	</select>
    <br>
    
    	<div style="display: table-cell;">
		Middle:
        
    
		<input id="middle" style="width:80%"  class="round" type="text" value="-">
		</input>
			<br>
	
	End:
    
    
	<select id="end" class="round" style="width:100%">
	
	<option value="result" selected>Result</option>
	<option value="username">Username</option>
	</select><br>


   </span>
   </div>
   <select id="sort" class="round" style="width: 90%;">
   <option value="0" selected>Don't Sort</option>
   <option value="1" selected>Sort from Descending</option>
   <option value="2">Sort from Ascending</option>
</select><br>



	<div style="float: left; width: 50%; font-family: monospace; white-space: nowrap; resize: none;">
	Result Limit:
	<input id="getresults" class="round" type="text" placeholder="If blank it gets all results.">
</div><br><br><br>
	<div style="float: left; width: 35%; font-family: monospace; white-space: nowrap; resize: none;"">
	Store In:<br>
	<select id="storage" class="round">
		${data.variables[1]}
	</select>
</div>
<div id="varNameContainer2" style="float: right; width: 60%;">
	Variable Name:<br>
	<input id="varName2" class="round" type="text"><br>
</div>
</div>
<select id="debu" class="round" style="width: 90%;">
<option value="0" selected>Debug</option>
<option value="1" selected>Don't Debug</option>

</select><br>
</div>
</html>`
	},

	//---------------------------------------------------------------------
	// Action Editor Init Code
	//
	// When the HTML is first applied to the action editor, this code
	// is also run. This helps add modifications or setup reactionary
	// functions for the DOM elements.
	//---------------------------------------------------------------------

	init: function () {
		const {
			glob,
			document
		} = this;
		glob.onChange1 = function(event) {
			const value = parseInt(event.value);
			const dom = document.getElementById('numbefst');
			
			
			if(value == 1) {
				dom.style.display = 'none';
				
			} else if(value == 2) {
				
				dom.style.display = null;
			}
			
		}
		glob.onChange1(document.getElementById('numbefstselect'));
	},

	//---------------------------------------------------------------------
	// Action Bot Function
	//
	// This is the function for the action within the Bot's Action class.
	// Keep in mind event calls won't have access to the "msg" parameter, 
	// so be sure to provide checks for variable existance.
	//---------------------------------------------------------------------

	action: function (cache) {
		var _this = this;
		const data = cache.actions[cache.index];
		var msg = cache.msg
		const type = parseInt(data.member);
		const varName = this.evalMessage(data.varName, cache);
		const storage = parseInt(data.storage);
		const varName2 = this.evalMessage(data.varName2, cache);
		const st = this.evalMessage(data.start, cache)
		const mid = this.evalMessage(data.middle, cache)
		const selectionsnum = parseInt(data.numbefstselect);

		const en = this.evalMessage(data.end, cache)
		const sort = parseInt(data.sort);
		const debug = parseInt(data.debu);
		const WrexMODS = this.getWrexMods(); // as always.
		

		var Discord = WrexMODS.require('discord.js');
		var fastsort = WrexMODS.require('fast-sort');
		var client = new Discord.Client();
		const {
			JSONPath
		} = WrexMODS.require('jsonpath-plus');
		fs = require('fs')
		var file = fs.readFileSync("./data/players.json", 'utf8');




		if (file) {
			var dataName = this.evalMessage(data.dataName, cache);
			dataName = '[' + "'" + dataName + "'" + ']'

			const isAdd = Boolean(data.changeType === "1");
			let val = this.evalMessage(data.value, cache);
			var list2 = []
			var list = []
			var list4 = []
			var list5 = []

			if (val !== undefined) {
				var file = JSON.parse(file)
				try {
					var list = []
					var result = JSONPath({
						path: '$.[?(@' + dataName + ' || @' + dataName + ' > -9999999999999999999999999999999999999999999999999999999)]*~',
						json: file
					});
					var pull = result;

					function sortNumber(a, b) {
						return b - a;
					}
					for (var i = 0; i < result.length; i++) {

						var result2 = JSONPath({
							path: '$.' + result[i] + dataName,
							json: file
						});

						try {
							
							var user = msg.guild.members.get(result[i]);

							tag = user.user.tag

							var name2 = "'" + "name" + "'";
							var id = "'" + "id" + "'";
							var tag2 = "" + tag + "";
							var res2 = "" + result2 + "";


							list.push({
								id: tag2,
								name2: res2
							});


						} catch (err) {
							switch (debug) {
								case 0:
								console.log(err)
								break;
								case 1:
								break;
							} 
							
						}
					}
					switch (sort) {
						case 1:
							result = fastsort(list).desc(u => parseInt(u.name2));
							break;
						case 2:

							result = fastsort(list).asc(u => parseInt(u.name2));
							break;
						case 0:
							result = list
							break;
					}
                   console.log(result)
					var result2 = JSON.stringify(result)

					var getres = parseInt(this.evalMessage(data.getresults, cache));


					if (!getres) {

						getres = result.length;
					}

					for (var i = 0; i < getres; i++) {
						var result2 = JSON.stringify(list[i])

						try {
							var file = JSON.parse(result2)


							var res = JSONPath({
								path: '$..name2',
								json: file
							});
							var res2 = JSONPath({
								path: '$..id',
								json: file
							});

							var username = res2
							var result = res

							eval(' ' + st + ' ');
							var middle = " " + mid + " "
							eval(' ' + en + ' ');
							var username = res2
							var result = res
							var en2 = eval(en);
							var st2 = eval(st);
							list5.push("easter egg :eyes:")
							switch (selectionsnum) {
								case 1:


									list2.push(st2 + middle + en2 + '\n')
									break;
								case 2:

									var num = list5.length;
									var numbef = this.evalMessage(data.numbefst2, cache)
									list2.push(num + numbef + " " + st2 + middle + en2 + '\n')
									break;
							}

						} catch (err) {
							switch (debug) {
								case 0:
								console.log(err)
								break;
								case 1:
								break;
							} 
						}




						list4 = list2.join('')

					}

					_this.storeValue(list4, storage, varName2, cache)
					_this.callNextAction(cache);
				} catch (err) {
					switch (debug) {
						case 0:
						console.log(err)
						break;
						case 1:
						break;
					} 
				}

			}
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

	mod: function (DBM) {}

}; // End of module

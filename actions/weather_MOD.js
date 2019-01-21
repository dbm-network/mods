module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Weather",

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
		const info = ['Temperature', 'Weather Text', 'Date', 'City', 'Country', 'Region', 'Wind Speed', 'Wind Chill', 'Wind Direction', 'Humidity', 'Pressure', 'Atmosphere Visibility', 'Sunrise Time', 'Sunset Time', 'Feelslike', 'Image URL', 'Current Day'];
		return `${info[parseInt(data.info)]}`;
	},

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "EGGSY",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.8.7", //Added in 1.8.7

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Stores weather informations with node module.",

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
		const info = parseInt(data.info);
		let dataType = 'Unknown Weather Type';
		switch (info) {
			case 0:
				dataType = "Temperature";
				break;
			case 1:
				dataType = "Weather - Text";
				break;
			case 2:
				dataType = "Date";
				break;
			case 3:
				dataType = "Weather - City";
				break;
			case 4:
				dataType = "Weather - Country";
				break;
			case 5: // Deprecated...
				dataType = "Weather - Region";
				break;
			case 6:
				dataType = "Wind Speed";
				break;
			case 7: // Deprecated...
				dataType = "Wind Chill";
				break;
			case 8:
				dataType = "Wind Direction";
				break;
			case 9:
				dataType = "Atmosphere Humidity";
				break;
			case 10: // Deprecated...
				dataType = "Atmosphere Pressure";
				break;
			case 11: // Deprecated...
				dataType = "Atmosphere Visibility";
				break;
			case 12: // Deprecated...
				dataType = "Weather - Sunrise";
				break;
			case 13: // Deprecated...
				dataType = "Weather - Sunset";
				break;
			case 14:
				dataType = "Feelslike";
				break;
			case 15:
				dataType = "Image URL";
				break;
			case 16:
				dataType = "Current Day";
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

	fields: ["city", "degreeType", "info", "storage", "varName"],

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
		<div>
			<p>
				<u>Mod Info:</u><br>
				Created by EGGSY!
			</p>
		</div><br>
	<div style="float: left; width: 55%; padding-top: 8px;">
		Source City:<br>
		<input id="city" class="round" type="text">
	 </div>
	 <div style="float: right; width: 45%; padding-top: 8px;">
	 	Degree Type:<br>
	 	<select id="degreeType" class="round">
			<option value="F">F</option>
			<option value="C">C</option>
		</select>
  	</div><br>
	<div style="float: left; width: 100%; padding-top: 8px;">
		Source Info:<br>
		<select id="info" class="round">
			<option value="0">Temperature</option>
			<option value="14">Feelslike</option>
			<option value="1">Weather Text</option>
			<option value="2">Date</option>
			<option value="3">City</option>
			<option value="4">Country</option>
			<option value="6">Wind Speed</option>
			<option value="8">Wind Direction</option>
			<option value="9">Humidity</option>
			<option value="15">Image URL</option>
			<option value="16">Current Day</option>
		</select>
	</div><br>
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
	</div><br><br>`
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
		const data = cache.actions[cache.index],
			info = parseInt(data.info),
			city = this.evalMessage(data.city, cache),
			degreeType2 = this.evalMessage(data.degreeType, cache),
			_this = this;

		// Check if everything is ok:
		if (!city) return console.log("Please specify a city to get weather informations.");

		// Main code:
		const WrexMODS = this.getWrexMods(), // as always.
			weather = WrexMODS.require('weather-js'); // WrexMODS'll automatically try to install the module if you run it with CMD/PowerShell.

		weather.find({ search: `${city}`, degreeType: `${degreeType2}` }, function (err, response) {
			if (err || !response || response.length < 1) {
				const storage = parseInt(data.storage),
					varName2 = _this.evalMessage(data.varName, cache);
				_this.storeValue(undefined, storage, varName2, cache); // Store as "undefined" because the result was empty.
				_this.callNextAction(cache);
			} else {
				switch (info) { // Never use deprecated results. Current API doesn't support any of them. RIP old module...
					case 0:
						result = response[0].current.temperature;
						break;
					case 1:
						result = response[0].current.skytext;
						break;
					case 2:
						result = response[0].current.date;
						break;
					case 3:
						result = response[0].location.name;
						break;
					case 4:
						result = response[0].current.observationpoint;
						break;
					case 5: // Deprecated...
						result = response[0].location.region;
						break;
					case 6:
						result = response[0].current.windspeed;
						break;
					case 7: // Deperecated...
						result = response[0].wind.chill;
						break;
					case 8:
						result = response[0].current.winddisplay;
						break;
					case 9:
						result = response[0].current.humidity;
						break;
					case 10: // Deprecated...
						result = response[0].atmosphere.pressure;
						break;
					case 11: // Deprecated...
						result = response[0].atmosphere.visibility;
						break;
					case 12: // Deprecated...
						result = response[0].astronomy.sunrise;
						break;
					case 13: // Deprecated...
						result = response[0].astronomy.sunset;
						break;
					case 14:
						result = response[0].current.feelslike;
						break;
					case 15:
						result = response[0].current.imageUrl;
						break;
					case 16:
						result = response[0].current.day;
						break;
					default:
						break;
				}
				if (result !== undefined) {
					const storage = parseInt(data.storage),
						varName2 = _this.evalMessage(data.varName, cache);
					_this.storeValue(result, storage, varName2, cache);
				}
				_this.callNextAction(cache);
			}
		});
	},

	//---------------------------------------------------------------------
	// Action Bot Mod
	//
	// Upon initialization of the bot, this code is run. Using the bot's
	// DBM namespace, one can add/modify existing functions if necessary.
	// In order to reduce conflictions between mods, be sure to alias
	// functions you wish to overwrite.
	//---------------------------------------------------------------------

	mod: function (DBM) { }

}; // End of module
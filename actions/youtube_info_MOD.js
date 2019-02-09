module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "Store YouTube Info",

	//---------------------------------------------------------------------
	// Action Section
	//
	// This is the section the action will fall into.
	//---------------------------------------------------------------------

	section: "Audio Control",

	//---------------------------------------------------------------------
	// Action Subtitle
	//
	// This function generates the subtitle displayed next to the name.
	//---------------------------------------------------------------------

	subtitle: function (data) {
		const info = ['Video ID', 'Video URL', 'Video Title', 'Video Description', 'Video Owner', 'Video ChannelID', 'Video ThumbnailUrl', 'Video EmbedURL', 'Video Genre', 'Video Paid', 'Video Unlisted', 'Video isFamilyFriendly', 'Video Duration', 'Video Views', 'Video regionsAllowed', 'Video commentCount', 'Video  likeCount', 'Video  dislikeCount',  'Video  channelThumbnailUrl' ];
		return `YouTube ${info[parseInt(data.info)]}`;
	},

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "Aamon",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.9.4", //Added in 0.00.00 not yet....

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Gets extra video information on YouTube based on video ID. Works with Discord Bot Maker (beta) and WrexMods.",

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
		let dataType = 'Unknown YouTube Type';
		switch (info) {
			case 0:
				dataType = "YouTube Video ID";
				break;
			case 1:
				dataType = "YouTube Video URL";
				break;
			case 2:
				dataType = "YouTube Video Title";
				break;
			case 3:
				dataType = "YouTube Video Description";
				break;
			case 4:
				dataType = "YouTube Video Owner";
				break;
			case 5:
				dataType = "YouTube Video ChannelID";
				break;
			case 6:
				dataType = "YouTube Video ThumbnailUrl";
				break;
			case 7:
				dataType = "YouTube Video EmbedURL";
				break;
			case 8:
				dataType = "YouTube Video Genre";
				break;
			case 9:
				dataType = "YouTube Video Paid";
				break;
			case 10:
				dataType = "YouTube Video Unlisted";
				break;
			case 11:
				dataType = "YouTube Video isFamilyFriendly";
				break;
			case 12:
				dataType = "YouTube Video Duration";
				break;
			case 13:
				dataType = "YouTube Video Views";
				break;
			case 14:
				dataType = "YouTube Video regionsAllowed";
				break;
			case 15:
				dataType = "YouTube Video commentCount";
				break;
			case 16:
				dataType = "YouTube Video likeCount";
				break;
			case 17:
				dataType = "YouTube Video dislikeCount";
				break;
			case 18:
				dataType = "YouTube Video channelThumbnailUrl";
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

	fields: ["video", "info", "storage", "varName"],

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
<div style="width: 550px; height: 350px; overflow-y: scroll;">
		<div>
			<p>
				<u>Mod Info:</u><br>
				Created by <b>Aamon</b>!
			</p>
		</div><br>
	<div style="width: 95%; padding-top: 8px;">
		Video to Search:<br>
		<textarea id="video" rows="2" placeholder="Write a video id here or use variables..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	 </div>
	<div style="width: 95%; padding-top: 8px;">
		Source Info:<br>
		<select id="info" class="round">
			<option value="0">Video ID</option>
			<option value="1">Video URL</option>
			<option value="2">Video Title</option>
			<option value="3">Video Description</option>
			<option value="4">Video Owner</option>
			<option value="5">Video ChannelID</option>
			<option value="6">Video ThumbnailUrl</option>
			<option value="7">Video EmbedURL</option>
			<option value="8">Video Genre</option>
			<option value="9">Video Paid</option>
			<option value="10">Video Unlisted</option>
			<option value="11">Video isFamilyFriendly</option>
			<option value="12">Video Duration(hh:mm:ss)</option>
			<option value="13">Video Views</option>
			<option value="14">Video regionsAllowed</option>
			<option value="15">Video commentCount</option>
			<option value="16">Video likeCount</option>
			<option value="17">Video dislikeCount</option>
			<option value="18">Video channelThumbnailUrl</option>
		</select>
	</div>
	<div>
		<div style="float: left; width: 35%;  padding-top: 8px;">
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
	<div style="float: left; width: 88%; padding-top: 8px;">
		<br>
		<p>
			For aditional information contact <b>Aamon#9130</b> on Discord or <a href ="https://twitter.com/44m0n"><b>@44m0n<b></a> on Twitter. 
		</p>
	<div>
</div>`
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
		const data = cache.actions[cache.index];
		const info = parseInt(data.info);
		const video = this.evalMessage(data.video, cache);
		//const key = this.evalMessage(data.key, cache);
		//const resultNumber = parseInt(data.resultNo);

		// Check if everything is ok:
		if (!video) return console.log("Please specify a video id to get video informations.");
		//if (!key) return console.log("Please get your key from Google and write it in the field.");

		// Main code:
		var _this = this; // this is needed sometimes.
		const WrexMODS = _this.getWrexMods(); // as always.
		WrexMODS.CheckAndInstallNodeModule('youtube-info');
		const search = WrexMODS.require('youtube-info'); // WrexMODS'll automatically try to install the module if you run it with CMD/PowerShell.

		const AnotherWrexMODS = _this.getWrexMods(); // "as always" too
		AnotherWrexMODS.CheckAndInstallNodeModule('hh-mm-ss');
		const AnotherSearch = WrexMODS.require('hh-mm-ss') //never used and nevermind ==> ask General Wrex (at your own risk)

		var fetchVideoInfo = require('youtube-info');
		var TimeFormat = require("hh-mm-ss");
		fetchVideoInfo(`${video}`, function (err, videoInfo) {
  		if (err) throw new Error(err);
 		//console.log(videoInfo);
 		

 		switch (info) {
				case 0:
					result = videoInfo.videoId;
					break;
				case 1:
					result = videoInfo.url;
					break;
				case 2:
					result = videoInfo.title;
					break;
				case 3:
					result = videoInfo.description;
					break;
				case 4:
					result = videoInfo.owner;
					break;
				case 5:
					result = videoInfo.channelId;
					break;	
				case 6:
					result = videoInfo.thumbnailUrl;
					break;
				case 7:
					result = videoInfo.embedURL;
					break;
				case 8:
					result = videoInfo.genre;
					break;
				case 9:
					result = videoInfo.paid;
					break;
				case 10:
					result = videoInfo.unlisted;
					break;
				case 11:
					result = videoInfo.isFamilyFriendly;
					break;
				case 12:
					{
						result = TimeFormat.fromS(videoInfo.duration); // check documentation/parameters ==> https://www.npmjs.com/package/hh-mm-ss
						//result = videoInfo.duration; just seconds =]]
					}
					break;
				case 13:
					result = videoInfo.views;
					break;
				case 14:
					result = videoInfo.regionsAllowed;
					break;
				case 15:
					result = videoInfo.commentCount;
					break;
				case 16:
					result = videoInfo.likeCount;
					break;
				case 17:
					result = videoInfo.dislikeCount;
					break;
				case 18:
					result = videoInfo.channelThumbnailUrl;
					break;
				default:
				break;
			}
			// Storing:
			if (result !== undefined) {
				const storage = parseInt(data.storage);
				const varName2 = _this.evalMessage(data.varName, cache);
				_this.storeValue(result, storage, varName2, cache);
			}
			_this.callNextAction(cache);


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

}; // End of module   <-- as he says


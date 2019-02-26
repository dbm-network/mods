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
		const videoInfo = ['ID', 'URL', 'Title', 'Description', 'Owner', 'Channel ID', 'Thumbnail URL', 'Embed URL', 'Genre', 'Paid', 'Unlisted', 'is Family Friendly', 'Duration', 'Views', 'regions Allowed', 'comment Count', 'like Count', 'dislike Count',  'channel Thumbnail URL' ];
		const playlistInfo = ['Video IDs', 'Video URLs', 'Video Titles', 'Channel IDs', 'Channel URLs', 'Channel Names', 'Video Positons', 'Video Publish Dates', 'Thumbnail (Default)', 'Thumbnail (Medium)', 'Thumbnail (High)', 'Thumbnail (Standard)', 'Thumbnail (Maxres)'];
		if(parseInt(data.type) == 1) {
			return `YouTube Playlist ${playlistInfo[parseInt(data.info1)]}`;
		} else {
			return `YouTube Video ${videoInfo[parseInt(data.info0)]}`;
		};
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
	version: "1.9.5", //Added in 1.9.5

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "If selected 'Video': Gets extra video information on YouTube based on video ID. | If selected 'Playlist': It will add every video info from a youtube playlist to a list in DBM. | Works with Discord Bot Maker (Beta) and WrexMods.",

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
		const info0 = parseInt(data.info0);
		const info1 = parseInt(data.info1);
		let dataType = 'Unknown Type';
		if(parseInt(data.type) == 1) {
			dataType = "List";
		} else {
			switch (info0) {
				case 0:
				case 1:
				case 2:
				case 3:
				case 4:
				case 5:
				case 8:
					dataType = "Text";
					break;
				case 6:
				case 7:
				case 18:
					dataType = "Image URL";
					break;
				case 9:
				case 10:
				case 11:
					dataType = "Boolean";
					break;
				case 12:
				case 13:
				case 15:
				case 16:
				case 17:
					dataType = "Number";
					break;
				case 14:
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

	fields: ["type", "position", "url", "divinfo0", "info0", "divinfo0", "info1", "apikey", "divapikey", "results", "divresults", "storage", "varName"],

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
			Created by <b>Aamon</b> and <b>ZockerNico</b>!
		</p>
	</div>
	<div style="width: 30%; padding-top: 8px;">
		Source Type:<br>
		<select id="type" class="round" onchange="glob.onChange1(this)">
			<option value="0" selected>YouTube Video</option>
			<option value="1">YouTube Playlist</option>
		</select>
	</div>
	<div id="positionHolder" style="float: right; width: 50%; display: none;">
		Position:<br>
		<input id="position" class="round" type="text"><br>
	</div>
	<div style="float: left; width: 90%; padding-top: 8px;">
		<span id="tempName">Video</span> to search:<br>
		<textarea id="url" rows="2" placeholder="Insert your url in here..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	</div>
	<div id="divinfo0"; style="float: left; width: 85%; padding-top: 8px;">
		Source Video Info:<br>
		<select id="info0" class="round">
			<option value="0">Video ID</option>
			<option value="1" selected>Video URL</option>
			<option value="2">Video Title</option>
			<option value="3">Video Description</option>
			<option value="4">Video Owner</option>
			<option value="5">Video Channel ID</option>
			<option value="6">Video Thumbnail URL</option>
			<option value="7">Video Embed URL</option>
			<option value="8">Video Genre</option>
			<option value="9">Paid Video?</option>
			<option value="10">Unlisted Video?</option>
			<option value="11">Is Video Family Friendly?</option>
			<option value="12">Video Duration</option>
			<option value="13">Video Views</option>
			<option value="14">Video Allowed Regions</option>
			<option value="15">Video Comment Count</option>
			<option value="16">Video Like Count</option>
			<option value="17">Video Dislike Count</option>
			<option value="18">Video Channel Thumbnail URL</option>
		</select>
	</div>
	<div id="divinfo1"; style="float: left; width: 85%; padding-top: 8px;">
		Source Playlist Info:<br>
		<select id="info1" class="round">
			<option value="0">Video IDs</option>
			<option value="1" selected>Video URLs</option>
			<option value="2">Video Titles</option>
			<option value="3">Channel IDs</option>
			<option value="4">Channel URLs</option>
			<option value="5">Channel Names</option>
			<option value="6">Video Positions</option>
			<option value="7">Video Publish Dates</option>
			<option value="8">Thumbnails (Default)</option>
			<option value="9">Thumbnails (Medium)</option>
			<option value="10">Thumbnails (High)</option>
			<option value="11">Thumbnails (Standard)</option>
			<option value="12">Thumbnails (Maxres)</option>
		</select>
	</div>
	<div id="divapikey" style="float: left; width: 95%; padding-top: 8px;">
		API Key:<br>
		<input id="apikey" class="round" type="text" placeholder="Insert your YouTube Data V3 API Key...">
	</div>
	<div id="divresults" style="float: left; width: 95%; padding-top: 8px;">
		Max Results:<br>
		<input id="results" class="round" type="text" placeholder="Leave blank for 100">
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
	</div>
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
		glob.onChange1 = function(event) {
			const id = parseInt(event.value);
			//Load [Source Video Info], [Source Playlist Info], [API Key], [Max Results]
			const videoDiv = document.getElementById('divinfo0');
			const video = document.getElementById('info0');
			const playlistDiv = document.getElementById('divinfo1');
			const playlist = document.getElementById('info1');
			const apikey = document.getElementById('apikey');
			const apikeyDiv = document.getElementById('divapikey');
			const results = document.getElementById('results');
			const resultsDiv = document.getElementById('divresults');
			let result = '';
			switch(id) {//Show: [Source Video Info] Hide: [Source Playlist Info], [API Key], [Max Results]
				case 0:
					result = 'Video';
					video.style.display = null;
					videoDiv.style.display = null;
					playlist.style.display = 'none';
					playlistDiv.style.display = 'none';
					apikey.style.display = 'none';
					apikeyDiv.style.display = 'none';
					results.style.display = 'none';
					resultsDiv.style.display = 'none';
					break;
				case 1://Show: [Source Playlist Info], [API Key], [Max Results] Hide: [Source Video Info]
					result = 'Playlist';
					video.style.display = 'none';
					videoDiv.style.display = 'none';
					playlist.style.display = null;
					playlistDiv.style.display = null;
					apikey.style.display = null;
					apikeyDiv.style.display = null;
					results.style.display = null;
					resultsDiv.style.display = null;
					break;
			};
			//Replace text with [Video/Playlist]
			document.getElementById('tempName').innerHTML = result;
		};
		glob.onChange1(document.getElementById('type'));
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
		const url = this.evalMessage(data.url, cache);
		const WrexMODS = this.getWrexMods(); // as always.


		
		if(parseInt(data.type) == 1) {//Playlist section (by ZockerNico)



			const info = parseInt(data.info1);
			const playlist = url.slice(38);
			const ypi = WrexMODS.require('youtube-playlist-info');
			var _this = this; //This is needed sometimes.

			//Check input
			if(!data.url) {
				return console.log('Please insert a playlist url!');
			};
			if(!data.apikey) {
				return console.log('Please insert a api key!');
			};

			//Load playlist
			var apikey = "";
			if(data.apikey) {
				apikey = this.evalMessage(data.apikey, cache);
			};
			var results = 100;
			if(data.results) {
				results = parseInt(this.evalMessage(data.results, cache));
			};
			const options = {
				maxResults: results
			};
			ypi(apikey, playlist, options).then(items => {
				var urlList = [];
				switch(info) {
					case 0://Video ID
						items.forEach(item=> {
							urlList.push(item.resourceId.videoId);
						});
						break;
					case 1://Video URL
						items.forEach(item=> {
							urlList.push(`https://www.youtube.com/watch?v=${item.resourceId.videoId}`);
						});
						break;
					case 2://Video Title
						items.forEach(item=> {
							urlList.push(item.title);
						});
						break;
					case 3://Channel ID
						items.forEach(item=> {
							urlList.push(item.channelId);
						});
						break;
					case 4://Channel URL
						items.forEach(item=> {
							urlList.push(`https://www.youtube.com/channel/${item.channelId}`);
						});
						break;
					case 5://Channel Name
						items.forEach(item=> {
							urlList.push(item.channelTitle);
						});
						break;
					case 6://Video Position
						items.forEach(item=> {
							urlList.push(item.position);
						});
						break;
					case 7://Video Publish Date
						items.forEach(item=> {
							urlList.push(item.publishedAt);
						});
						break;
					case 8://Thumbnail (Default)
						items.forEach(item=> {
							urlList.push(item.thumbnails.default);
						});
						break;
					case 9://Thumbnail (Medium)
						items.forEach(item=> {
							urlList.push(item.thumbnails.medium);
						});
						break;
					case 10://Thumbnail (High)
						items.forEach(item=> {
							urlList.push(item.thumbnails.high);
					});
						break;
					case 11://Thumbnail (Standard)
						items.forEach(item=> {
							urlList.push(item.thumbnails.standard);
						});
						break;
					case 12://Thumbnail (Maxres)
						items.forEach(item=> {
							urlList.push(item.thumbnails.maxres);
						});
						break;
					default:
						break;
				};
				//Store Output
				const storage = parseInt(data.storage);
				const varName = _this.evalMessage(data.varName, cache);
				_this.storeValue(urlList, storage, varName, cache);

			}).catch(console.error);

			setTimeout(function(){ _this.callNextAction(cache); }, 1000);



		} else {//Video section (by Aamon)



			const info = parseInt(data.info0);
			const video = url.slice(32);
			var _this = this; //This is needed sometimes.

			//Check input
			if (!video) return console.log('Please insert a video url!');

			var fetchVideoInfo = WrexMODS.require('youtube-info');
			var TimeFormat = WrexMODS.require("hh-mm-ss");
			fetchVideoInfo(`${video}`, function (err, videoInfo) {
  			if (err) throw new Error(err);

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
				//Store Output
				if (result !== undefined) {
					const storage = parseInt(data.storage);
					const varName = _this.evalMessage(data.varName, cache);
					_this.storeValue(result, storage, varName, cache);
				};
				_this.callNextAction(cache);
			});
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

	mod: function (DBM) { }

}; // End of module   <-- as he says


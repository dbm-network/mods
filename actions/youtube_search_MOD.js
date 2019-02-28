module.exports = {

	//---------------------------------------------------------------------
	// Action Name
	//
	// This is the name of the action displayed in the editor.
	//---------------------------------------------------------------------

	name: "YouTube Search",

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
		const videoInfo = ['ID', 'URL', 'Title', 'Description', 'Owner', 'Channel ID', 'Thumbnail URL', 'Embed URL', 'Genre', 'Paid', 'Unlisted', 'is Family Friendly', 'Duration', 'Views', 'Regions Allowed', 'Comment Count', 'Like Count', 'Dislike Count',  'Channel Thumbnail URL' ];
		const playlistInfo = ['ID', 'URL', 'Name', 'Video IDs', 'Video URLs', 'Video Titles', 'Channel IDs', 'Channel URLs', 'Channel Names', 'Video Positons', 'Video Publish Dates', 'Thumbnail (Default)', 'Thumbnail (Medium)', 'Thumbnail (High)', 'Thumbnail (Standard)', 'Thumbnail (Max)'];
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
	author: "EGGSY, Aamon & ZockerNico",

	// The version of the mod (Defaults to 1.0.0)
	version: "1.9.5", //Added in 1.8.7

	// A short description to show on the mod line for this mod (Must be on a single line)
	short_description: "Searches video informations on YouTube",

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
			switch(info1) {
				case 0:
				case 1:
				case 2:
					dataType = "Text";
					break;
				case 3:
				case 4:
				case 5:
				case 6:
				case 7:
				case 8:
				case 9:
				case 10:
				case 11:
				case 12:
				case 13:
				case 14:
				case 15:
					dataType = "List";
					break;
			}
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

	fields: ["type", "position", "input", "info0", "info1", "apikey", "results", "resultNumber", "storage", "varName"],

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
			Created by <b>EGGSY</b>, <b>Aamon</b> and <b>ZockerNico</b>!
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
		<select id="position" class="round">
			<option value="0">PositionHolder</option>
			<option value="1">PositionHolder</option>
		</select><br>
	</div>
	<div style="float: left; width: 90%; padding-top: 8px;">
		<span id="tempName">Video</span> to search:<br>
		<textarea id="input" rows="2" placeholder="Insert your url or keywords in here..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
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
			<option value="0">Playlist ID</option>
			<option value="1" selected>Playlist URL</option>
			<option value="2">Playlist Name</option>
			<option value="3">Video IDs</option>
			<option value="4">Video URLs</option>
			<option value="5">Video Titles</option>
			<option value="6">Channel IDs</option>
			<option value="7">Channel URLs</option>
			<option value="8">Channel Names</option>
			<option value="9">Video Positions</option>
			<option value="10">Video Publish Dates</option>
			<option value="11">Thumbnails (Default)</option>
			<option value="12">Thumbnails (Medium)</option>
			<option value="13">Thumbnails (High)</option>
			<option value="14">Thumbnails (Standard)</option>
			<option value="15">Thumbnails (Max)</option>
		</select>
	</div>
	<div id="divresultNumber" style="float: left; width: 85%; padding-top: 8px;">
		Result Number:<br>
		<select id="resultNumber" class="round">
			<option value="0">1st Result</option>
			<option value="1">2nd Result</option>
			<option value="2">3rd Result</option>
			<option value="3">4th Result</option>
			<option value="4">5th Result</option>
			<option value="5">6th Result</option>
			<option value="6">7th Result</option>
			<option value="7">8th Result</option>
			<option value="8">9th Result</option>
			<option value="9">10th Result</option>
		</select>
	</div>
	<div id="divapikey" style="float: left; width: 95%; padding-top: 8px;">
		API Key:<br>
		<input id="apikey" class="round" type="text" placeholder="Insert your YouTube Data V3 API Key...">
	</div>
	<div id="divresults" style="float: left; width: 95%; padding-top: 8px;">
		Playlist Video Results:<br>
		<input id="results" class="round" type="text" placeholder="Leave blank for max. 100">
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
			const results = document.getElementById('results');
			const resultsDiv = document.getElementById('divresults');
			let result = '';
			switch(id) {//Show: [Source Video Info] Hide: [Source Playlist Info], [Max Results]
				case 0:
					result = 'Video';
					video.style.display = null;
					videoDiv.style.display = null;
					playlist.style.display = 'none';
					playlistDiv.style.display = 'none';
					results.style.display = 'none';
					resultsDiv.style.display = 'none';
					break;
				case 1://Show: [Source Playlist Info], [Max Results] Hide: [Source Video Info]
					result = 'Playlist';
					video.style.display = 'none';
					videoDiv.style.display = 'none';
					playlist.style.display = null;
					playlistDiv.style.display = null;
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
		const input = this.evalMessage(data.input, cache);
		const WrexMODS = this.getWrexMods(); // as always.


		
		if(parseInt(data.type) == 1) {//Playlist section (by ZockerNico)



			const info = parseInt(data.info1);
			const ypi = WrexMODS.require('youtube-playlist-info');
			const search = WrexMODS.require('youtube-search');
			var _this = this; //This is needed sometimes.
			const resultNumber = _this.evalMessage(data.resultNumber);

			//Check input
			if(!input) {
				return console.log('Please insert a playlist url or keywords to search for!');
			};
			if(!data.apikey) {
				return console.log('Please insert a api key!');
			};
			
			//Load playlist
			var apikey = "";
			if(data.apikey) {
				apikey = _this.evalMessage(data.apikey, cache);
			};

			var searchOptions = {
				maxResults: 10,
				key: apikey,
				type: "playlist"
			};
			
			search(`${input}`, searchOptions, function (err, results) {
				if (err) return console.log(err);
				var result = results[resultNumber].link;
				var playlist = result.slice(38);
				
				var playlistResults = 100;
				if(data.results) {
					playlistResults = parseInt(_this.evalMessage(data.results, cache));
				};
				const ypiOptions = {
					maxResults: `${playlistResults}`
				};
				ypi(apikey, playlist, ypiOptions).then(items => {
					var urlList = [];
					switch(info) {
						case 0://Playlist ID
							urlList.push(results[resultNumber].id);
							break;
						case 1://Playlist URL
							urlList.push(results[resultNumber].link);
							break;
						case 2://Playlist Name
							urlList.push(results[resultNumber].title);
							break;
						case 3://Video ID
							items.forEach(item=> {
								urlList.push(item.resourceId.videoId);
							});
							break;
						case 4://Video URL
							items.forEach(item=> {
								urlList.push(`https://www.youtube.com/watch?v=${item.resourceId.videoId}`);
							});
							break;
						case 5://Video Title
							items.forEach(item=> {
								urlList.push(item.title);
							});
							break;
						case 6://Channel ID
							items.forEach(item=> {
								urlList.push(item.channelId);
							});
							break;
						case 7://Channel URL
							items.forEach(item=> {
								urlList.push(`https://www.youtube.com/channel/${item.channelId}`);
							});
							break;
						case 8://Channel Name
							items.forEach(item=> {
								urlList.push(item.channelTitle);
							});
							break;
						case 9://Video Position
							items.forEach(item=> {
								urlList.push(item.position);
							});
							break;
						case 10://Video Publish Date
							items.forEach(item=> {
								urlList.push(item.publishedAt);
							});
							break;
						case 11://Thumbnail (Default)
							items.forEach(item=> {
								urlList.push(item.thumbnails.default);
							});
							break;
						case 12://Thumbnail (Medium)
							items.forEach(item=> {
								urlList.push(item.thumbnails.medium);
							});
							break;
						case 13://Thumbnail (High)
							items.forEach(item=> {
								urlList.push(item.thumbnails.high);
							});
							break;
						case 14://Thumbnail (Standard)
							items.forEach(item=> {
								urlList.push(item.thumbnails.standard);
							});
							break;
						case 15://Thumbnail (Maxres)
							items.forEach(item=> {
								urlList.push(item.thumbnails.maxres);
							});
							break;
						default:
							break;
					};
					//Store list
					const varName = _this.evalMessage(data.varName, cache);
					const storage = parseInt(data.storage);
					if(info > 3) {
						_this.storeValue(urlList, storage, varName, cache);
					} else {
						var listInfo = urlList[0];
						_this.storeValue(listInfo, storage, varName, cache);
					};
					_this.callNextAction(cache);
				}).catch(console.error);
			});




		} else {//Video section (by Aamon)



			var _this = this; //This is needed sometimes.
			const info = parseInt(data.info0);
			const resultNumber = _this.evalMessage(data.resultNumber);
			const fetchVideoInfo = WrexMODS.require('youtube-info');
			const TimeFormat = WrexMODS.require("hh-mm-ss");
			const search = WrexMODS.require('youtube-search');

			//Check input
			if (!input) return console.log('Please insert a video url or keywords to search for!');

			var apikey = "";
			if(data.apikey) {
				apikey = this.evalMessage(data.apikey, cache);
			};

			var searchOptions = {
				maxResults: 10,
				key: `${apikey}`,
				type: "video"
			};
			
			//Load Video Info
			search(`${input}`, searchOptions, function (err, results) {
				if (err) return console.log(err);
				var result = results[resultNumber].link;
				var video = result.slice(32);
				
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
				  	};
				  	//Store Output
				  	if (result !== undefined) {
					 	const storage = parseInt(data.storage);
						const varName = _this.evalMessage(data.varName, cache);
						_this.storeValue(result, storage, varName, cache);
						_this.callNextAction(cache);
				  	};
			  	});
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

}; // End of module

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
		const videoInfo = ['Video ID', 'Video URL', 'Video Title', 'Video Description', 'Video Channel ID', 'Video Channel URL', 'Video Channel Name', 'Video Channel Thumbnail URL (Default)', 'Video Channel Thumbnail URL (Medium)', 'Video Channel Thumbnail URL (High)', 'Video Thumbnail URL (Default)', 'Video Thumbnail URL (Medium)', 'Video Thumbnail URL (High)', 'Video Genre', 'Paid Video?', 'Unlisted Video?', 'Is Video Family Friendly?', 'Video Duration', 'Video Publish Data', 'Video Views', 'Allowed Video Regions', 'Video Comment Count', 'Video Like Count', 'Video Dislike Count'];
		const playlistInfo = ['Playlist ID', 'Playlist URL', 'Playlist Name', 'Playlist Description', 'Playlist Thumbnail URL (Default)', 'Playlist Thumbnail URL (Medium)', 'Playlist Thumbnail URL (High)', 'Playlist Channel ID', 'Playlist Channel URL', 'Playlist Channel Name', 'Playlist Channel Thumbnail URL (Default)', 'Playlist Channel Thumbnail URL (Medium)', 'Playlist Channel Thumbnail URL (High)', 'Video IDs', 'Video URLs', 'Video Titles', 'Video Descriptions', 'Video Channel IDs', 'Video Channel URls', 'Video Channel Names', 'Video Channel Thumbnail URLs (Default)', 'Video Channel Thumbnail URLs (Medium)', 'Video Channel Thumbnail URLs (High)', 'Video Thumbnail URLs (Default)', 'Video Thumbnail URLs (Medium)', 'Video Thumbnail URLs (High)', 'Video Positions', 'Video Publish Dates'];
		if(parseInt(data.type) == 1) {
			return `${playlistInfo[parseInt(data.info1)]}`;
		} else {
			return `${videoInfo[parseInt(data.info0)]}`;
		};
	},

	//---------------------------------------------------------------------
	// DBM Mods Manager Variables (Optional but nice to have!)
	//
	// These are variables that DBM Mods Manager uses to show information
	// about the mods for people to see in the list.
	//---------------------------------------------------------------------

	// Who made the mod (If not set, defaults to "DBM Mods")
	author: "ZockerNico, Aamon & EGGSY",

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
		let dataType = 'Unknown Type';
		switch(parseInt(data.type)) {
			case 0://Video
				//----------------------------
				switch(parseInt(data.info0)) {
					case 0://Video ID
					case 2://Video Title
					case 3://Video Description
					case 4://Video Channel ID
					case 6://Video Channel Name
					case 13://Video Genre
					case 17://Video Duration
					case 18://Video Publish Date
						dataType = 'Text';
						break;
					case 1://Video URL
					case 5://Video Channel URL
						dataType = 'URL';
						break;
					case 7://Video Channel Thumbnail URL (Default)
					case 8://Video Channel Thumbnail URL (Medium)
					case 9://Video Channel Thumbnail URL (High)
					case 10://Video Thumbnail URL (Default)
					case 11://Video Thumbnail URL (Medium)
					case 12://Video Thumbnail URL (High)
						dataType = 'Image URL';
						break;
					case 14://Paid Video?
					case 15://Unlisted Video?
					case 16://Is Video Family Friendly?
						dataType = 'Boolean';
						break;
					case 19://Video Views
					case 21://Video Comment Count
					case 22://Video Like Count
					case 23://Video Dislike Count
						dataType = 'Number';
						break;
					case 20://Allowed Video Regions
						dataType = 'List';
				};
				break;
			case 1://Playlist
				//----------------------------
				switch(parseInt(data.info1)) {
					case 0://Playlist ID
					case 2://Playlist Name
					case 3://Playlist Description
					case 7://Playlist Channel ID
					case 9://Playlist Channel Name
						dataType = 'Text';
						break;
					case 1://Playlist URL
					case 8://Playlist Channel URL
						dataType = 'URL';
						break;
					case 4://Playlist Thumbnail URL (Default)
					case 5://Playlist Thumbnail URL (Medium)
					case 6://Playlist Thumbnail URL (High)
					case 10://Playlist Channel Thumbnail URL (Default)
					case 11://Playlist Channel Thumbnail URL (Medium)
					case 12://Playlist Channel Thumbnail URL (High)
						dataType = 'Image URL';
						break;
					case 13://Video IDs
					case 14://Video URLs
					case 15://Video Titles
					case 16://Video Descriptions
					case 17://Video Channel IDs
					case 18://Video Channel URLs
					case 19://Video Channel Names
					case 20://Video Channel Thumbnail URLs (Default)
					case 21://Video Channel Thumbnail URLs (Medium)
					case 22://Video Channel Thumbnail URLs (High)
					case 23://Video Thumbnail URLs (Default)
					case 24://Video Thumbnail URLs (Medium)
					case 25://Video Thumbnail URLs (High)
					case 26://Video Positions
					case 27://Video Publish Dates
						dataType = 'List';
						break;
				};
				break;
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

	fields: ["type", "input", "info0", "info1", "apikey", "results", "storage", "varName"],

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
			Created by <b>ZockerNico</b>, <b>Aamon</b> and <b>EGGSY</b>!
		</p>
	</div>
	<div style="float: left; width: 30%; padding-top: 8px;">
		Source Type:<br>
		<select id="type" class="round" onchange="glob.onChange1(this)">
			<option value="0" selected>YouTube Video</option>
			<option value="1">YouTube Playlist</option>
		</select>
	</div>
	<div style="float: left; width: 99%; padding-top: 8px;">
		<span id="tempName">Video</span> to search:<br>
		<textarea id="input" rows="2" placeholder="Insert your url or keywords in here..." style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	</div>
	<div id="divinfo0"; style="float: left; width: 94%; padding-top: 8px;">
		Source Video Info:<br>
		<select id="info0" class="round">
			<option value="0">Video ID</option>
			<option value="1" selected>Video URL</option>
			<option value="2">Video Title</option>
			<option value="3">Video Description</option>
			<option value="4">Video Channel ID</option>
			<option value="5">Video Channel URL</option>
			<option value="6">Video Channel Name</option>
			<option value="7">Video Channel Thumbnail URL (Default)</option>
			<option value="8">Video Channel Thumbnail URL (Medium)</option>
			<option value="9">Video Channel Thumbnail URL (High)</option>
			<option value="10">Video Thumbnail URL (Default)</option>
			<option value="11">Video Thumbnail URL (Medium)</option>
			<option value="12">Video Thumbnail URL (High)</option>
			<option value="13">Video Genre</option>
			<option value="14">Paid Video?</option>
			<option value="15">Unlisted Video?</option>
			<option value="16">Is Video Family Friendly?</option>
			<option value="17">Video Duration</option>
			<option value="18">Video Publish Date</option>
			<option value="19">Video Views</option>
			<option value="20">Allowed Video Regions</option>
			<option value="21">Video Comment Count</option>
			<option value="22">Video Like Count</option>
			<option value="23">Video Dislike Count</option>
		</select>
	</div>
	<div id="divinfo1"; style="float: left; width: 94%; padding-top: 8px;">
		Source Playlist Info:<br>
		<select id="info1" class="round">
			<option value="0">Playlist ID</option>
			<option value="1" selected>Playlist URL</option>
			<option value="2">Playlist Name</option>
			<option value="3">Playlist Description</option>
			<option value="4">Playlist Thumbnail URL (Default)</option>
			<option value="5">Playlist Thumbnail URL (Medium)</option>
			<option value="6">Playlist Thumbnail URL (High)</option>
			<option value="7">Playlist Channel ID</option>
			<option value="8">Playlist Channel URL</option>
			<option value="9">Playlist Channel Name</option>
			<option value="10">Playlist Channel Thumbnail URL (Default)</option>
			<option value="11">Playlist Channel Thumbnail URL (Medium)</option>
			<option value="12">Playlist Channel Thumbnail URL (High)</option>
			<option value="13">Video IDs</option>
			<option value="14">Video URLs</option>
			<option value="15">Video Titles</option>
			<option value="16">Video Descriptions</option>
			<option value="17">Video Channel IDs</option>
			<option value="18">Video Channel URLs</option>
			<option value="19">Video Channel Names</option>
			<option value="20">Video Channel Thumbnail URLs (Default)</option>
			<option value="21">Video Channel Thumbnail URLs (Medium)</option>
			<option value="22">Video Channel Thumbnail URLs (High)</option>
			<option value="23">Video Thumbnail URLs (Default)</option>
			<option value="24">Video Thumbnail URLs (Medium)</option>
			<option value="25">Video Thumbnail URLs (High)</option>
			<option value="26">Video Positions</option>
			<option value="27">Video Publish Dates</option>
		</select>
	</div>
	<div id="divresults" style="float: left; width: 94%; padding-top: 8px;">
		Result Number:<br>
		<select id="results" class="round">
			<option value="1">1st Result</option>
			<option value="2">2nd Result</option>
			<option value="3">3rd Result</option>
			<option value="4">4th Result</option>
			<option value="5">5th Result</option>
			<option value="6">6th Result</option>
			<option value="7">7th Result</option>
			<option value="8">8th Result</option>
			<option value="9">9th Result</option>
			<option value="10">10th Result</option>
			<option value="11">11th Result</option>
			<option value="12">12th Result</option>
			<option value="13">13th Result</option>
			<option value="14">14th Result</option>
			<option value="15">15th Result</option>
			<option value="16">16th Result</option>
			<option value="17">17th Result</option>
			<option value="18">18th Result</option>
			<option value="19">19th Result</option>
			<option value="20">20th Result</option>
		</select>
	</div>
	<div id="divapikey" style="float: left; width: 104%; padding-top: 8px;">
		API Key:<br>
		<input id="apikey" class="round" type="text" placeholder="Insert your YouTube Data V3 API Key...">
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
			let result = '';
			switch(id) {//Show: [Source Video Info] Hide: [Source Playlist Info], [Max Results]
				case 0:
					result = 'Video';
					video.style.display = null;
					videoDiv.style.display = null;
					playlist.style.display = 'none';
					playlistDiv.style.display = 'none';
					break;
				case 1://Show: [Source Playlist Info], [Max Results] Hide: [Source Video Info]
					result = 'Playlist';
					video.style.display = 'none';
					videoDiv.style.display = 'none';
					playlist.style.display = null;
					playlistDiv.style.display = null;
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
		const _this = this; //This is needed sometimes.
		const WrexMods = this.getWrexMods(); //As always.
		const input = this.evalMessage(data.input, cache);//URL or Keywords
		const apikey = this.evalMessage(data.apikey, cache);//Api Key
		const type = parseInt(data.type);//0: Video | 1: Playlist
		const info0 = parseInt(data.info0);//Video
		const info1 = parseInt(data.info1);//Playlist
		const results = parseInt(data.results);//Number within 1 to 10
		const ytapi = WrexMods.require('simple-youtube-api');
		const ytinfo = WrexMods.require('youtube-info');
		const TimeFormat = WrexMods.require('hh-mm-ss');

		if(input === undefined || input === '') {
			return console.log('Please provide a url or some keywords to search for.');
		};
		if(apikey === undefined || apikey === '') {
			return console.log('Please provide a valid api key.');
		};

		const YouTube = new ytapi(`${apikey}`);

		switch(type) {
			case 0://Video
				YouTube.searchVideos(`${input}`, results).then(videos => {
					var result;
					var video = videos[results-1];
					switch(info0) {
						case 0://Video ID
							result = video.id;
							break;
						case 1://Video URL
							result = `https://www.youtube.com/watch?v=${video.id}`;
							break;
						case 2://Video Title
							result = video.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, '\'');
							break;
						case 3://Video Description
							result = video.description.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, '\'');
							break;
						case 4://Video Channel ID
							result = video.channel.id;
							break;
						case 5://Video Channel URL
							result = `https://www.youtube.com/channel/${video.channel.id}`;
							break;
						case 6://Video Channel Name
							result = video.channel.title;
							break;
						case 7://Video Channel Thumbnail URL (Default)
							result = video.channel.raw.snippet.thumbnails.default.url;
							break;
						case 8://Video Channel Thumbnail URL (Medium)
							result = video.channel.raw.snippet.thumbnails.medium.url;
							break;
						case 9://Video Channel Thumbnail URL (High)
							result = video.channel.raw.snippet.thumbnails.high.url;
							break;
						case 10://Thumbnail URL (Default)
							result = video.thumbnails.default.url;
							break;
						case 11://Thumbnail URL (Medium)
							result = video.thumbnails.medium.url;
							break;
						case 12://Thumbnail URL (High)
							result = video.thumbnails.high.url;
							break;
						case 18://Video Publish Date
							result = video.publishedAt;
							break;
						default:
							ytinfo(`${video.id}`, function(error, videoInfo) {
								var result2;
								if(error) {console.error(error)};
								switch(info0) {
									case 13://Video Genre
										result2 = videoInfo.genre;
										break;
									case 14://Paid Video?
										result2 = videoInfo.paid;
										break;
									case 15://Unlisted Video?
										result2 = videoInfo.unlisted;
										break;
									case 16://Is Video Family Friendly?
										result2 = videoInfo.isFamilyFriendly;
										break;
									case 17://Video Duration
										result2 = TimeFormat.fromS(parseInt(videoInfo.duration));
										break;
									case 19://Video Views
										result2 = parseInt(videoInfo.views);
										break;
									case 20://Allowed Video Regions
										result2 = videoInfo.regionsAllowed;
										break;
									case 21://Video Comment Count
										result2 = parseInt(videoInfo.commentCount);
										break;
									case 22://Video Like Count
										result2 = parseInt(videoInfo.likeCount);
										break;
									case 23://Video Dislike Count
										result2 = parseInt(videoInfo.dislikeCount);
										break;
									default:
										return console.log('Please check your YouTube Search action... There is something wrong.');
								};
								if(result2 !== undefined) {
									const storage = parseInt(data.storage);
									const varName = _this.evalMessage(data.varName, cache);
									_this.storeValue(result2, storage, varName, cache);
									_this.callNextAction(cache);
								};
							});
							break;
					};
					if(result !== undefined) {
						const storage = parseInt(data.storage);
						const varName = _this.evalMessage(data.varName, cache);
						_this.storeValue(result, storage, varName, cache);
						_this.callNextAction(cache);
					};
				});
				break;
			case 1://Playlist
				YouTube.searchPlaylists(`${input}`, results).then(playlists => {
					var result;
					var playlist = playlists[results-1];
					switch(info1) {
						case 0://Playlist ID
							result = playlist.id;
							break;
						case 1://Playlist URL
							result = `https://www.youtube.com/playlist?list=${playlist.id}`;
							break;
						case 2://Playlist Name
							result = playlist.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, '\'');
							break;
						case 3://Playlist Description
							result = playlist.description.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, '\'');
							break;
						case 4://Playlist Thumbnail URL (Default)
							result = playlist.thumbnails.default.url;
							break;
						case 5://Playlist Thumbnail URL (Medium)
							result = playlist.thumbnails.default.medium;
							break;
						case 6://Playlist Thumbnail URL (High)
							result = playlist.thumbnails.default.high;
							break;
						case 7://Playlist Channel ID
							result = playlist.channel.id;
							break;
						case 8://Playlist Channel URL
							result = `https://www.youtube.com/channel/${playlist.channel.id}`;
							break;
						case 9://Playlist Channel Name
							result = playlist.channel.title;
							break;
						case 10://Playlist Channel Thumbnail URL (Default)
							result = playlist.channel.raw.snippet.thumbnails.default.url;
							break;
						case 11://Playlist Channel Thumbnail URL (Medium)
							result = playlist.channel.raw.snippet.thumbnails.medium.url;
							break;
						case 12://Playlist Channel Thumbnail URL (High)
							result = playlist.channel.raw.snippet.thumbnails.high.url;
							break;
						default:
							playlist.getVideos().then(videos => {
								var result2 = [];
								videos.forEach((video, pos) => {
									switch(info1) {
										case 13://Video IDs
											result2.push(video.id);
											break;
										case 14://Video URLs
											result2.push(`https://www.youtube.com/watch?v=${video.id}`);
											break;
										case 15://Video Titles
											result2.push(video.title.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, '\''));
											break;
										case 16://Video Descriptions
											result2.push(video.description.replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&#39;/g, '\''));
											break;
										case 17://Video Channel IDs
											result2.push(video.channel.id);
											break;
										case 18://Video Channel URLs
											result2.push(`https://www.youtube.com/channel/${video.channel.id}`);
											break;
										case 19://Video Channel Names
											result2.push(video.channel.title);
											break;
										case 20://Video Channel Thumbnail URLs (Default)
											result2.push(video.channel.raw.snippet.thumbnails.default.url);
											break;
										case 21://Video Channel Thumbnail URLs (Medium)
											result2.push(video.channel.raw.snippet.thumbnails.medium.url);
											break;
										case 22://Video Channel Thumbnail URLs (High)
											result2.push(video.channel.raw.snippet.thumbnails.high.url);
											break;
										case 23://Video Thumbnail URLs (Default)
											result2.push(video.thumbnails.default.url);
											break;
										case 24://Video Thumbnail URLs (Medium)
											result2.push(video.thumbnails.medium.url);
											break;
										case 25://Video Thumbnail URLs (High)
											result2.push(video.thumbnails.high.url);
											break;
										case 26://Video Positions
											result2.push(pos+1);
											break;
										case 27://Video Publish Dates
											result2.push(video.publishedAt);
											break;
										default:
											return console.log('Please check your YouTube Search action... There is something wrong.');
										};
								});
								if(result2.length > 0) {
									const storage = parseInt(data.storage);
									const varName = _this.evalMessage(data.varName, cache);
									_this.storeValue(result2, storage, varName, cache);
									_this.callNextAction(cache);
								};
							});
							break;
					};
					if(result !== undefined) {
						const storage = parseInt(data.storage);
						const varName = _this.evalMessage(data.varName, cache);
						_this.storeValue(result, storage, varName, cache);
						_this.callNextAction(cache);
					};
				});
				break;
			default:
				return console.log('Please check your YouTube Search action... There is something wrong.');
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
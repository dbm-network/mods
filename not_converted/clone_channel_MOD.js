module.exports = {
	name: "Clone Channel MOD",
	section: "Channel Control",

	subtitle: function(data) {
		const names = ["Same Channel", "Mentioned Channel", "Default Channel", "Temp Variable", "Server Variable", "Global Variable"];
		const index = parseInt(data.storage);
		return index < 3 ? `Clone Channel : ${names[index]}` : `Clone Channel : ${names[index]} - ${data.varName}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage2);
		if(type !== varType) return;
		return ([data.varName2, "Channel"]);
	},

	fields: ["storage", "varName", "categoryID", "position", "permission", "info", "topic", "slowmode", "nsfw", "bitrate", "userLimit", "storage2", "varName2", ],

	html: function(isEvent, data) {
		return `
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Source Channel:<br>
		<select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
			${data.channels[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; padding-left: 5%; float: left; width: 65%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 50%;">
		Category ID:<br>
		<input id="categoryID" class="round" type="text"><br>
	</div>
	<div style="float: right; width: 50%;">
		Position:<br>
		<input id="position" class="round" type="text"><br>
	</div>
</div><br><br><br>
<div>
	<div style="float: left; width: 45%;">
		Clone Permission:<br>
		<select id="permission" class="round">
			<option value="0">False</option>
			<option value="1">True</option>
		</select><br>
	</div>
	<div style="padding-left: 5%; float: left; width: 50%;">
		Channel Type:<br>
		<select id="info" class="round" onchange="glob.channeltype(this, 'option')">
			<option value="0">Automatic (Clone Everything)</option>
			<option value="1">Text Channel</option>
			<option value="2">Voice Channel</option>
		</select><br>
	</div>
</div><br><br><br>
<div id="text" style="display: none">
	<div style="float: left; width: 28%;">
		Clone Topic:<br>
		<select id="topic" class="round">
			<option value="0">False</option>
			<option value="1">True</option>
		</select><br>
	</div>
	<div style="padding-left: 5%; float: left; width: 33%;">
		Clone NSFW:<br>
		<select id="nsfw" class="round">
			<option value="0">False</option>
			<option value="1">True</option>
		</select><br>
	</div>
	<div style="padding-left: 5%; float: left; width: 34%;">
		Clone Slow Mode:<br>
		<select id="slowmode" class="round">
			<option value="0">False</option>
			<option value="1">True</option>
		</select><br>
	</div>
</div>
<div id="voice" style="display: none;">
	<div style="float: left; width: 45%;">
		Clone User Limit:<br>
		<select id="userLimit" class="round">
			<option value="0">False</option>
			<option value="1">True</option>
		</select><br>
	</div>
	<div style="padding-left: 5%; float: left; width: 50%;">
		Clone Bitrate:<br>
		<select id="bitrate" class="round">
			<option value="0">False</option>
			<option value="1">True</option>
		</select><br>
	</div>
</div>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; padding-left: 5%; float: left; width: 65%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text">
	</div>
</div>`;
	},
	init: function() {
		const { glob, document } = this;

		glob.channelChange(document.getElementById("storage"), "varNameContainer");
		glob.variableChange(document.getElementById("storage2"), "varNameContainer2");

		glob.channeltype = function(event) {
			if (event.value === "0") {
				document.getElementById("text").style.display = "none";
				document.getElementById("voice").style.display = "none";
			} else if (event.value === "1") {
				document.getElementById("text").style.display = null;
				document.getElementById("voice").style.display = "none";
			} else if (event.value === "2") {
				document.getElementById("text").style.display = "none";
				document.getElementById("voice").style.display = null;
			}
		};
		glob.channeltype(document.getElementById("info"));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const server = cache.server;
		const storage = parseInt(data.storage);
		const info = parseInt(data.info);
		const varName = this.evalMessage(data.varName, cache);
		const channel = this.getChannel(storage, varName, cache);
		if (server && server.createChannel) {
			const name = channel.name;
			const catid = this.evalMessage(data.categoryID, cache);
			const type = channel.type;
			server.createChannel(name, type, "", "").then(function(newchannel) {
				if (catid) {
					newchannel.setParent(catid);
				}
				const channelData = {};
				if (data.position) {
					channelData.position = parseInt(data.position);
				}
				const permission = parseInt(data.permission);
				if (channel.permissionOverwrites != "Collection [Map] {}") {
					channelData.permissionOverwrites = channel.permissionOverwrites;
				}
				if (type == "text") {
					const topic = parseInt(data.topic);
					const slowmode = parseInt(data.slowmode);
					const nsfw = parseInt(data.nsfw);
					if (info == 0) {
						if (channel.topic !== "") {
							channelData.topic = channel.topic;
						}
						if (channel.rateLimitPerUser != 0) {
							channelData.rateLimitPerUser = channel.rateLimitPerUser;
						}
						if (channel.nsfw) {
							channelData.nsfw = true;
						}
					} else {
						if ((topic == 1 && channel.topic !== "") == true) {
							channelData.topic = channel.topic;
						}
						if ((slowmode == 1 && channel.rateLimitPerUser != 0) == true) {
							channelData.rateLimitPerUser = channel.rateLimitPerUser;
						}
						if ((nsfw == 1 && channel.nsfw) == true) {
							channelData.nsfw = true;
						}
					}
				} else if (type == "voice") {
					const bitrate = parseInt(data.bitrate);
					const userLimit = parseInt(data.userLimit);
					if (info == 0) {
						if (channel.bitrate != 64) {
							const bitrate = parseInt(channel.bitrate)*1000;
							channelData.bitrate = bitrate;
						}
						if (channel.userLimit != 0) {
							channelData.userLimit = channel.userLimit;
						}
					} else {
						if ((bitrate == 1 && channel.bitrate != 64) == true) {
							const bitrate = parseInt(channel.bitrate)*1000;
							channelData.bitrate = bitrate;
						}
						if ((userLimit == 1 && channel.userLimit != 0) == true) {
							channelData.userLimit = channel.userLimit;
						}
					}
				}
				if (channelData != {}) {
					newchannel.edit(channelData);
				}
				const storage2 = parseInt(data.storage2);
				const varName2 = this.evalMessage(data.varName2, cache);
				this.storeValue(newchannel, storage2, varName2, cache);
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function() {}
};

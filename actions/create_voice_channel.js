module.exports = {
	name: "Create Voice Channel",  
	section: "Channel Control",  

	subtitle: function(data) {
		return `${data.channelName}`;
	},  

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, "Voice Channel"]);
	},  

	fields: ["channelName", "categoryID", "bitrate", "userLimit", "storage", "varName"],  

	html: function(isEvent, data) {
		return `
Name:<br>
<input id="channelName" class="round" type="text" style="width: 95%"><br>

Category ID:<br>
<input id= "categoryID" class="round" type="text" placeholder="Keep this empty if you don't want to put it into a category" style="width: 95%"><br>

<div style="float: left; width: 50%;">
	Bitrate:<br>
	<input id="bitrate" class="round" type="text" placeholder="Leave blank for default!" style="width: 90%;"><br>
</div>

<div style="float: right; width: 50%;">
	User Limit:<br>
	<input id="userLimit" class="round" type="text" placeholder="Leave blank for default!" style="width: 90%;"><br>
</div>

<div>
	<div style="float: left; width: 45%;">
		Store In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 50%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" style="width: 90%"><br>
	</div>
</div>`;
	},  

	init: function() {
		const { glob, document } = this;

		glob.variableChange(document.getElementById("storage"), "varNameContainer");
	},  

	action: function(cache) {
		const data = cache.actions[cache.index];
		const server = cache.server;
		const catid = this.evalMessage(data.categoryID, cache);
		const bitrate = parseInt(this.evalMessage(data.bitrate, cache));
		const userLimit = parseInt(this.evalMessage(data.userLimit, cache));
		if(server && server.createChannel) {
			const name = this.evalMessage(data.channelName, cache);
			const storage = parseInt(data.storage);
			if (!catid) {
				server.createChannel(name, { type: "voice", bitrate: bitrate, userLimit: userLimit }).then(function(channel) {
					const varName = this.evalMessage(data.varName, cache);
					this.storeValue(channel, storage, varName, cache);
					this.callNextAction(cache);
				}.bind(this)).catch(this.displayError.bind(this, data, cache));
			} else {
				server.createChannel(name, { type: "voice", bitrate: bitrate, userLimit: userLimit, parent: catid }).then(function(channel) {
					const varName = this.evalMessage(data.varName, cache);
					this.storeValue(channel, storage, varName, cache);
					this.callNextAction(cache);
				}.bind(this)).catch(this.displayError.bind(this, data, cache));
			}
		} else {
			this.callNextAction(cache);
		}
	},  

	mod: function() {}
}; 

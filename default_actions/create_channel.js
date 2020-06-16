module.exports = {
	name: "Create Text Channel",
	section: "Channel Control",

	subtitle: function(data) {
		return `${data.channelName}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, "Channel"]);
	},

	fields: ["channelName", "categoryID", "topic", "position", "storage", "varName", ],

	html: function(isEvent, data) {
		return `
	Name:<br>
<input id="channelName" class="round" type="text" style="width: 95%"><br>

Category ID:<br>
<input id= "categoryID" class="round" type="text" placeholder="Keep this empty if you don't want to put it into a category" style="width: 95%"><br>

<div style="float: left; width: 50%;">
	Topic:<br>
	<input id="topic" class="round" type="text"><br>
</div>

<div style="float: right; width: 50%;">
	Position:<br>
	<input id="position" class="round" type="text" placeholder="Leave blank for default!" style="width: 90%;"><br>
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
		if(server && server.createChannel) {
			const name = this.evalMessage(data.channelName, cache);
			const catid = this.evalMessage(data.categoryID, cache);
			const topic = this.evalMessage(data.topic, cache);
			const position = parseInt(data.position);
			const storage = parseInt(data.storage);
			if (!catid) {
				server.createChannel(name, { type: "text", topic: topic, position: position }).then(function(channel) {
					const varName = this.evalMessage(data.varName, cache);
					this.storeValue(channel, storage, varName, cache);
					this.callNextAction(cache);
				}.bind(this)).catch(this.displayError.bind(this, data, cache));
			} else {
				server.createChannel(name, { type: "text", topic: topic, position: position, parent: catid }).then(function(channel) {
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

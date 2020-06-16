module.exports = {
	name: "Send Message",
	section: "Messaging",

	subtitle: function(data) {
		const channels = ["Same Channel", "Command Author", "Mentioned User", "Mentioned Channel", "Default Channel (Top Channel)", "Temp Variable", "Server Variable", "Global Variable"];
		return `${channels[parseInt(data.channel)]}: "${data.message.replace(/[\n\r]+/, "")}"`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName2, "Message"]);
	},

	fields: ["channel", "varName", "message", "storage", "varName2", "iffalse", "iffalseVal"],

	html: function(isEvent, data) {
		return `
	<div style="width: 550px; height: 350px; overflow-y: scroll;">
	<div><p>This action has been modified by DBM Mods.</p></div><br>
<div>
	<div style="float: left; width: 35%;">
		Send To:<br>
		<select id="channel" class="round" onchange="glob.sendTargetChange(this, 'varNameContainer')">
			${data.sendTargets[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	Message:<br>
	<textarea id="message" rows="9" placeholder="Insert message here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div><br>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text">
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
        <div style="float: left; width: 35%;">
            If Message Delivery Fails:<br>
            <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
				<option value="0" selected>Continue Actions</option>
				<option value="1">Stop Action Sequence</option>
				<option value="2">Jump To Action</option>
				<option value="3">Skip Next Actions</option>
		 </select>
		</div>
		<div id="iffalseContainer" style="display: none; float: right; width: 60%;"><span id="iffalseName">Action Number</span>:<br><input id="iffalseVal" class="round" type="text"></div>`;
	},

	init: function() {
		const { glob, document } = this;

		glob.sendTargetChange(document.getElementById("channel"), "varNameContainer");
		glob.variableChange(document.getElementById("storage"), "varNameContainer2");
		glob.onChangeFalse(document.getElementById("iffalse"));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const server = cache.server;
		const msg = cache.msg;
		const channel = parseInt(data.channel);
		const message = data.message;
		if(channel === undefined || message === undefined) return;
		const varName = this.evalMessage(data.varName, cache);
		const target = this.getSendTarget(channel, varName, cache);
		if(Array.isArray(target)) {
			this.callListFunc(target, "send", [this.evalMessage(message, cache)]).then(function(resultMsg) {
				const varName2 = this.evalMessage(data.varName2, cache);
				const storage = parseInt(data.storage);
				this.storeValue(resultMsg, storage, varName2, cache);
				this.callNextAction(cache);
			}.bind(this));
		} else if(target && target.send) {
			target.send(this.evalMessage(message, cache)).then(function(resultMsg) {
				const varName2 = this.evalMessage(data.varName2, cache);
				const storage = parseInt(data.storage);
				this.storeValue(resultMsg, storage, varName2, cache);
				this.callNextAction(cache);
			}.bind(this)).catch(err => {
				if(err.message == ("Cannot send messages to this user")) {
					this.executeResults(false, data, cache);
				} else {
					this.displayError.bind(this, data, cache);
				}
			});
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function() {}
};

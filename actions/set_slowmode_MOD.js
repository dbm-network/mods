module.exports = {
	name: "Set slowmode MOD",
	section: "Channel Control",

	subtitle: function(data) {
		const names = ["Same Channel", "Mentioned Channel", "Default Channel", "Temp Variable", "Server Variable", "Global Variable"];
		const index = parseInt(data.storage);
		return index < 3 ? `Set slowmode : ${names[index]}` : `Set slowmode : ${names[index]} - ${data.varName}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage2);
		if(type !== varType) return;
		return ([data.varName2, "Channel"]);
	},

	fields: ["storage", "varName", "varName2", "amount", "reason"],

	html: function(isEvent, data) {
		return `
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;" padding-top: 16px;">
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
	<div style="float: left; width: 50%;" padding-top: 16px;">
		Amount:<br>
		<input id="amount" class="round" type="text" steps="5" placeholder="In seconds..."><br>
		Reason:<br>
		<input id="reason" class="round" type="text" placeholder="Optional"><br>
	</div>
</div>
	<div id="varNameContainer2" style="display: none; padding-left: 5%; float: left; width: 65%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text">
	</div>`;
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const server = cache.server;
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const channel = this.getChannel(storage, varName, cache);
		const name = channel.name;
		const amount = this.evalMessage(data.amount, cache);
		const reason = this.evalMessage(data.reason, cache);
		const type = channel.type;
		if (type == "text") {
			if (/5|10|15|30|60|120|300|600|900|1800|3600|21600/g.test(amount)) {
				if (reason !== null) {
					channel.setRateLimitPerUser(amount, reason);
				} else {
					channel.setRateLimitPerUser(amount);
				}
			} else {
				console.log("The amount is not valid.");
			}
		} else {
			this.callNextAction(cache);
			console.log("This channel isn't a channel.");
		}
	},

	mod: function() {}
};

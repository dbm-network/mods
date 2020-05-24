module.exports = {
	name: "Set Time Restriction",
	section: "Other Stuff",

	subtitle: function (data) {
		const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions", "Jump to Anchor"];
		return `Cooldown | If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
	},

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		return ([data.varName, "Number"]);
	},

	fields: ["measurement", "value", "save", "restrict", "iftrue", "iftrueVal", "iffalse", "iffalseVal", "storage", "varName"],

	html: function (isEvent, data) {
		return `
	<div>
		<div style="padding-top: 8px;">
			<div style="float: left; width: 35%;">
				Time Measurement:<br>
				<select id="measurement" class="round" onchange="glob.onChange(this)">
					<option value="0">Miliseconds</option>
					<option value="1" selected>Seconds</option>
					<option value="2">Minutes</option>
					<option value="3">Hours</option>
				</select>
			</div>
			<div style="padding-left: 5%; float: left; width: 65%;">
				Cooldown Time:<br>
				<input id="value" class="round" type="text" placeholder="1 = 1 second"><br>
			</div>
		</div><br><br><br>
		<div style="padding-top: 8px;">
			<div style="float: left; width: 35%;">
				Reset After Restart:<br>
				<select id="save" class="round"><br>
					<option value="0" selected>false</option>
					<option value="1">true</option>
				</select>
			</div>
			<div style="padding-left: 5%; float: left; width: 59%;">
				Restrict By:<br>
				<select id="restrict" class="round"><br>
					<option value="0" selected>Global</option>
					<option value="1">Server</option>
				</select>
			</div>
		<div><br><br><br>
		<div style="padding-top: 8px;">
			${data.conditions[0]}
		</div><br><br><br>
		<div style="padding-top: 8px;">
			<div style="float: left; width: 35%;">
				Store Left Time In (s):<br>
				<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
					${data.variables[0]}
				</select>
			</div>
			<div id="varNameContainer" style="float: right; width: 60%; display: none;">
				Variable Name:<br>
				<input id="varName" class="round" type="text"><br>
			</div>
		</div>
	</div>`;
	},

	init: function () {
		const { glob, document } = this;
		const value = document.getElementById("value");
		glob.onChange = function(Measurement) {
			switch(parseInt(Measurement.value)) {
				case 0:
					value.placeholder = "1000 = 1 second";
					break;
				case 1:
					value.placeholder = "1 = 1 second";
					break;
				case 2:
					value.placeholder = "1 = 60000 seconds";
					break;
				case 3:
					value.placeholder = "1 = 3600000 seconds";
					break;
			}
		};

		glob.variableChange(document.getElementById("storage"), "varNameContainer");
		glob.onChangeTrue(document.getElementById("iftrue"));
		glob.onChangeFalse(document.getElementById("iffalse"));
		glob.onChange(document.getElementById("Measurement"));
	},

	action: function (cache) {
		const data = cache.actions[cache.index];
		const Files = this.getDBM().Files;
		const value = parseInt(this.evalMessage(data.value, cache));
		const msg = this.getMessage(0, "", cache);
		if (isNaN(value)) {
			console.error(value+" is not a valid number.");
			return;
		}

		const Actions = cache.actions;
		let cmd;
		const allData = Files.data.commands;
		Object.keys(allData).forEach(function(command) {
			if (allData[command]) {
				if (JSON.stringify(allData[command].actions) === JSON.stringify(Actions)) {
					cmd = allData[command];
				}
			}
		});
		const timeLeft = this.TimeRestriction(msg, cmd, cache);

		let result;
		if (!timeLeft) {
			result = false;
		} else {
			const storage = parseInt(data.storage);
			const varName2 = this.evalMessage(data.varName, cache);
			this.storeValue(timeLeft, storage, varName2, cache);
			result = true;
		}
		this.executeResults(result, data, cache);
	},

	mod: function (DBM) {

		const Files = DBM.Files;
		let Cooldown;
		DBM.Actions.TimeRestriction = function (msg, cmd, cache) {

			let value = parseInt(this.evalMessage(cache.actions[cache.index].value, cache));
			let measurement = parseInt(cache.actions[cache.index].measurement);
			let restrict = parseInt(cache.actions[cache.index].restrict);
			switch (measurement) {
				case 1:
					value = value * 1000;
					break;
				case 2:
					value = value * 60000;
					break;
				case 3:
					value = value * 3600000;
			}
			let save = cache.actions[cache.index].save;
			if (typeof Cooldown == "undefined" && save == 0) {
				Cooldown = DBM.Actions.getVariable(3, "DBMCooldown", cache);
			} else if (save == 1) {
				this.storeValue(undefined, 3, "DBMCooldown", cache);
				Files.saveGlobalVariable("DBMCooldown", undefined);
			}
			if (typeof Cooldown == "undefined") {
				Cooldown = {};
			} else if (typeof Cooldown == "string") {
				Cooldown = JSON.parse(Cooldown);
			}
			if (!Cooldown[cmd.name]) {
				Cooldown[cmd.name] = {};
			}
			let now = new Date().getTime();

			let Command = Cooldown[cmd.name];
			let cooldownAmount;
			if (cmd.cooldown) {
				cooldownAmount = cmd.cooldown;
			} else {
				cooldownAmount = value;
				cmd.cooldown = value;
			}
			switch (restrict) {
				case 0:
					if (typeof Command[msg.author.id] != "number") {
						delete Command[msg.author.id];
					}
					if (Command[msg.author.id]) {
						let expirationTime = Command[msg.author.id] + cooldownAmount;
						if (now < expirationTime) {
							return Math.ceil((expirationTime - now) / 1000);
						} else {
							Command[msg.author.id] = now;
							if (save == 0) Files.saveGlobalVariable("DBMCooldown", JSON.stringify(Cooldown));
							return false;
						}
					} else {
						Command[msg.author.id] = now;
						if (save == 0) Files.saveGlobalVariable("DBMCooldown", JSON.stringify(Cooldown));
						return false;
					}
				case 1:
					let channelId;
					if (typeof msg.channel.guild !== "undefined") {
						channelId = msg.channel.guild.id;
					} else {
						channelId = msg.channel.id;
					}
					if (typeof Command[msg.author.id] != "object") {
						Command[msg.author.id] = {};
					}
					if (Command[msg.author.id][channelId]) {
						let expirationTime = Command[msg.author.id][channelId] + cooldownAmount;
						if (now < expirationTime) {
							return Math.ceil((expirationTime - now) / 1000);
						} else {
							Command[msg.author.id][channelId] = now;
							if (save == 0) Files.saveGlobalVariable("DBMCooldown", JSON.stringify(Cooldown));
							return false;
						}
					} else {
						Command[msg.author.id][channelId] = now;
						if (save == 0) Files.saveGlobalVariable("DBMCooldown", JSON.stringify(Cooldown));
						return false;
					}
			}
		};
	}

};

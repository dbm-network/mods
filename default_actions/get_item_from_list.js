module.exports = {
	name: "Get Item from List",
	section: "Lists and Loops",

	subtitle: function(data) {
		const list = ["Server Members", "Server Channels", "Server Roles", "Server Emojis", "All Bot Servers", "Mentioned User Roles", "Command Author Roles", "Temp Variable", "Server Variable", "Global Variable"];
		return `Get Item from ${list[parseInt(data.list)]}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		const list = parseInt(data.list);
		let dataType = "Unknown Type";
		switch(list) {
			case 0:
				dataType = "Server Member";
				break;
			case 1:
				dataType = "Channel";
				break;
			case 2:
			case 5:
			case 6:
				dataType = "Role";
				break;
			case 3:
				dataType = "Emoji";
				break;
			case 4:
				dataType = "Server";
				break;
		}
		return ([data.varName2, dataType]);
	},

	fields: ["list", "varName", "getType", "position", "storage", "varName2"],

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 35%;">
		Source List:<br>
		<select id="list" class="round" onchange="glob.listChange(this, 'varNameContainer')">
			${data.lists[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 45%;">
		Item to Store:<br>
		<select id="getType" class="round" onchange="glob.onChange1(this)">
			<option value="0" selected>First Item</option>
			<option value="1">Last Item</option>
			<option value="2">Random Item</option>
			<option value="3">Item at Position</option>
		</select>
	</div>
	<div id="positionHolder" style="float: right; width: 50%; display: none;">
		Position:<br>
		<input id="position" class="round" type="text"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text">
	</div>
</div>`;
	},

	init: function() {
		const { glob, document } = this;

		glob.onChange1 = function(event) {
			const value = parseInt(event.value);
			const dom = document.getElementById("positionHolder");
			if(value < 3) {
				dom.style.display = "none";
			} else {
				dom.style.display = null;
			}
		};

		glob.listChange(document.getElementById("list"), "varNameContainer");
		glob.onChange1(document.getElementById("getType"));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.list);
		const varName = this.evalMessage(data.varName, cache);
		const list = this.getList(storage, varName, cache);

		const type = parseInt(data.getType);
		let result;
		switch (type) {
			case 0:
				result = list[0];
				break;
			case 1:
				result = list[list.length - 1];
				break;
			case 2:
				result = list[Math.floor(Math.random() * list.length)];
				break;
			case 3:
				const posout = this.evalMessage(data.position, cache);

				let position;
				if (typeof posout === "string") {
					position = parseInt(posout);
				} else {
					position = posout;
				}

				if (position < 0) {
					result = list[0];
				} else if (position >= list.length) {
					result = list[list.length - 1];
				} else {
					result = list[position];
				}
				break;
		}

		if (result) {
			const varName2 = this.evalMessage(data.varName2, cache);
			const storage2 = parseInt(data.storage);
			this.storeValue(result, storage2, varName2, cache);
		}

		this.callNextAction(cache);
	},

	mod: function() {}
};

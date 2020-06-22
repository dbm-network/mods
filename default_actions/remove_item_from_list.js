module.exports = {
	name: "Remove Item from List",
	section: "Lists and Loops",

	subtitle: function(data) {
		const storage = ["", "Temp Variable", "Server Variable", "Global Variable"];
		return `Remove Item from ${storage[parseInt(data.storage)]} (${data.varName})`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage2);
		if (type !== varType) return;
		return ([data.varName2, "Unknown Type"]);
	},

	fields: ["storage", "varName", "removeType", "position", "storage2", "varName2"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Source List:<br>
			<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round varSearcher" type="text" list="variableList">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 45%;">
			Remove Type:<br>
			<select id="removeType" class="round" onchange="glob.onChange1(this)">
				<option value="0" selected>Remove from End</option>
				<option value="1">Remove from Front</option>
				<option value="2">Remove from Specific Position</option>
			</select>
		</div>
		<div id="positionHolder" style="float: right; width: 50%; display: none;">
			Position:<br>
			<input id="position" class="round" type="text">
		</div>
	</div><br><br><br>
	<div style="padding-top: 8px;">
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName2" class="round" type="text">
		</div>
	</div>`;
	},

	init: function() {
		const {
			glob,
			document
		} = this;

		glob.onChange1 = function(event) {
			const value = parseInt(event.value);
			const dom = document.getElementById("positionHolder");
			if (value < 2) {
				dom.style.display = "none";
			} else {
				dom.style.display = null;
			}
		};

		glob.refreshVariableList(document.getElementById("storage"));
		glob.onChange1(document.getElementById("removeType"));
		glob.variableChange(document.getElementById("storage2"), "varNameContainer2");
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const list = this.getVariable(storage, varName, cache);

		const type = parseInt(data.removeType);

		let result = null;
		switch (type) {
			case 0:
				result = list.pop();
				break;
			case 1:
				result = list.shift();
				break;
			case 2:
				const position = parseInt(this.evalMessage(data.position, cache));
				if (position < 0) {
					result = list.shift();
				} else if (position >= list.length) {
					result = list.pop();
				} else {
					result = list[position];
					list.splice(position, 1);
				}
				break;
		}

		if (result) {
			const varName2 = this.evalMessage(data.varName2, cache);
			const storage2 = parseInt(data.storage2);
			this.storeValue(result, storage2, varName2, cache);
			return this.callNextAction(cache);
		}
		console.log("Problem with remove item from list");
		return this.callNextAction(cache);
	},

	mod: function() {}

};

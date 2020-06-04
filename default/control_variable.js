module.exports = {
	name: "Control Variable",
	section: "Variable Things",

	subtitle: function(data) {
		const storage = ["", "Temp Variable", "Server Variable", "Global Variable"];
		return `${storage[parseInt(data.storage)]} (${data.varName}) ${data.changeType === "1" ? "+=" : "="} ${data.value}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, "Unknown Type"]);
	},

	fields: ["changeType", "value", "storage", "varName"],

	html: function(isEvent, data) {
		return `
<div><p>This action has been modified by DBM Mods</p></div>
<div>
	<div style="padding-top: 12px; width: 35%;">
		Control Type:<br>
		<select id="changeType" class="round">
			<option value="0" selected>Set Value</option>
			<option value="1">Add Value</option>
		</select>
	</div>
</div><br>
<div>
	Value:<br>
	<textarea id="value" rows="7" placeholder="Insert what you want here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div><br>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div>
</div>`;
	},

	init: function() {},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const type = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const storage = this.getVariable(type, varName, cache);
		const isAdd = Boolean(data.changeType === "1");
		let val = this.evalMessage(data.value, cache);
		try {
			val = this.eval(val, cache);
		} catch(e) {
			this.displayError(data, cache, e);
		}
		if(val !== undefined) {
			if(isAdd) {
				let result;
				if(storage === undefined) {
					result = val;
				} else {
					result = storage + val;
				}
				this.storeValue(result, type, varName, cache);
			} else {
				this.storeValue(val, type, varName, cache);
			}
		}
		this.callNextAction(cache);
	},

	mod: function() {}
};

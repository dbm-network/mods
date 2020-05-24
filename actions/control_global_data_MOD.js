module.exports = {
	name: "Control Global Data",
	section: "Deprecated",

	subtitle: function(data) {
		return `(${data.dataName}) ${data.changeType === "1" ? "+=" : "="} ${data.value}`;
	},

	fields: ["dataName", "changeType", "value"],

	html: function(isEvent, data) {
		return `
<div style="padding-top: 8px;">
	<div style="float: left; width: 50%;">
		Data Name:<br>
		<input id="dataName" class="round" type="text">
	</div>
	<div style="float: left; width: 45%;">
		Control Type:<br>
		<select id="changeType" class="round">
			<option value="0" selected>Set Value</option>
			<option value="1">Add Value</option>
		</select>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	Value:<br>
	<input id="value" class="round" type="text" name="is-eval"><br>
</div>`;
	},

	init: function() {},

	action: function(cache) {
		const data = cache.actions[cache.index];

		const dataName = this.evalMessage(data.dataName, cache);
		const isAdd = Boolean(data.changeType === "1");
		let val = this.evalMessage(data.value, cache);
		try {
			val = this.eval(val, cache);
		} catch(e) {
			this.displayError(data, cache, e);
		}

		const fs = require("fs");
		const path = require("path");

		const filePath = path.join(process.cwd(), "data", "globals.json");

		if(!fs.existsSync(filePath)) {
			fs.writeFileSync(filePath, "{}");
		}

		const obj = JSON.parse(fs.readFileSync(filePath, "utf8"));

		if(dataName && val) {
			if(isAdd) {
				if(!obj[dataName]) {
					obj[dataName] = val;
				} else {
					obj[dataName] += val;
				}
			} else {
				obj[dataName] = val;
			}
			fs.writeFileSync(filePath, JSON.stringify(obj));
		} else if (dataName && !val) {
			delete obj[dataName];
			fs.writeFileSync(filePath, JSON.stringify(obj));
		}

		this.callNextAction(cache);
	},

	mod: function() {}
};

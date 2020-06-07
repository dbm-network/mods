module.exports = {
	name: "Check Global Data",
	section: "Deprecated",

	subtitle: function(data) {
		const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions"];
		return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
	},

	fields: ["dataName", "comparison", "value", "iftrue", "iftrueVal", "iffalse", "iffalseVal"],

	html: function(isEvent, data) {
		return `
<div style="padding-top: 8px;">
	<div style="float: left; width: 50%;">
		Data Name:<br>
		<input id="dataName" class="round" type="text">
	</div>
	<div style="float: left; width: 45%;">
		Comparison Type:<br>
		<select id="comparison" class="round">
			<option value="0">Exists</option>
			<option value="1" selected>Equals</option>
			<option value="2">Equals Exactly</option>
			<option value="3">Less Than</option>
			<option value="4">Greater Than</option>
			<option value="5">Includes</option>
			<option value="6">Matches Regex</option>
		</select>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	Value to Compare to:<br>
	<input id="value" class="round" type="text" name="is-eval">
</div>
<div style="padding-top: 16px;">
	${data.conditions[0]}
</div>`;
	},

	init: function() {
		const { glob, document } = this;

		glob.onChangeTrue(document.getElementById("iftrue"));
		glob.onChangeFalse(document.getElementById("iffalse"));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];

		let result = false;

		const dataName = this.evalMessage(data.dataName, cache);
		const compare = parseInt(data.comparison);

		const fs = require("fs");
		const path = require("path");

		const filePath = path.join(process.cwd(), "data", "globals.json");

		if(!fs.existsSync(filePath)) {
			console.log("ERROR: Globals JSON file does not exist!");
			this.callNextAction(cache);
			return;
		}

		const obj = JSON.parse(fs.readFileSync(filePath, "utf8"));

		const val1 = obj[dataName];

		let val2 = this.evalMessage(data.value, cache);
		if(compare !== 6) val2 = this.eval(val2, cache);
		if(val2 === false) val2 = this.evalMessage(data.value, cache);

		switch(compare) {
			case 0:
				result = Boolean(val1 !== undefined);
				break;
			case 1:
				result = Boolean(val1 == val2);
				break;
			case 2:
				result = Boolean(val1 === val2);
				break;
			case 3:
				result = Boolean(val1 < val2);
				break;
			case 4:
				result = Boolean(val1 > val2);
				break;
			case 5:
				if(typeof(val1.includes) === "function") {
					result = Boolean(val1.includes(val2));
				}
				break;
			case 6:
				result = Boolean(val1.match(new RegExp("^" + val2 + "$", "i")));
				break;
		}
		this.executeResults(result, data, cache);
	},

	mod: function() {}
};

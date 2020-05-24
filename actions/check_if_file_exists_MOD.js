module.exports = {
	name: "Check if File Exists",
	section: "File Stuff",

	subtitle: function(data) {
		const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions"];
		return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
	},

	fields: ["filename", "iftrue", "iftrueVal", "iffalse", "iffalseVal"],

	html: function(isEvent, data) {
		return `
    <div style="float: left; width: 60%">
        Path:
        <input id="filename" class="round" type="text">
    </div><br>
</div><br><br><br>
<div style="padding-top: 8px;">
	${data.conditions[0]};
</div>`;
	},

	init: function() {
		const { glob, document } = this;
		glob.onChangeTrue(document.getElementById("iftrue"));
		glob.onChangeFalse(document.getElementById("iffalse"));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const fs = require("fs");
		const path = this.evalMessage(data.filename, cache);
		let result;
		if (path) {
			result = Boolean(fs.existsSync(path));
		} else {
			console.log("Path is missing.");
		}
		this.executeResults(result, data, cache);
	},

	mod: function() {}
};

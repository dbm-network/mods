module.exports = {
	name: "Read File",
	section: "File Stuff",

	subtitle: function(data) {
		const info1 = data.filename;
		return `Read File "${data.filename}"`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		const filename = parseInt(data.filename);
		let dataType = "File";
		return ([data.varName2, dataType]);
	},

	fields: ["filename", "storage", "varName2"],

	html: function(isEvent, data) {
		return `
<div>
    <div style="float: left; width: 60%">
        Path:
        <input id="filename" class="round" type="text">
    </div><br>
</div><br><br><br>
<div>
    <div style="float: left; width: 35%;">
        Store In:<br>
        <select id="storage" class="round">
            ${data.variables[1]}
        </select>
    </div>
    <div id="varNameContainer2" style="float: right; width: 60%;">
        Variable Name:<br>
        <input id="varName2" class="round" type="text"><br>
    </div>
</div>`;
	},

	init: function() {},

	action: function(cache) {
		const
			data = cache.actions[cache.index],
			fs = require("fs"),
			FILENAME = this.evalMessage(data.filename, cache);
		try {
			if (FILENAME) {
				const output = fs.readFileSync(FILENAME, "utf8");
				this.storeValue(output, parseInt(data.storage), this.evalMessage(data.varName2, cache), cache);
			} else {
				console.log("File path is missing from read file mod!");
			}
		} catch (err) {
			console.error("ERROR!" + err.stack ? err.stack : err);
		}
		this.callNextAction(cache);
	},

	mod: function() {}

};

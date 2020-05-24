module.exports = {
	name: "Revise", 
	section: "Other Stuff",  

	subtitle: function(data) {
		return `Revise: "${data.reviser}"`;
	},  

	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		let dataType = "Revised Result";
		return ([data.varName2, dataType]);
	},  

	fields: ["reviser", "storage", "varName2"],  

	html: function(isEvent, data) {
		return `
<div>
    <div style="width: 70%;">
        Message to Revise:<br>
        <input id="reviser" type="text" class="round">
    </div><br>
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

	action: function (cache) {
		const data = cache.actions[cache.index];
		const reviseText = this.evalMessage(data.reviser, cache);
		try {
			let array = reviseText.split(" ");

			for (let i = array.length - 1; i > 0; i--) {
				let j = Math.floor(Math.random() * (i + 1));
				[array[i], array[j]] = [array[j], array[i]];
			}
			const storage = parseInt(data.storage);
			const varName2 = this.evalMessage(data.varName2, cache);
			var out = array.join(" ").trim();
			this.storeValue(out.substr(0, 1).toUpperCase() + out.substr(1), storage, varName2, cache);
		} catch (err) {
			console.log("ERROR!" + err.stack ? err.stack : err);
		}
		this.callNextAction(cache);
	},  

	mod: function() {}
}; 

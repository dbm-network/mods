module.exports = {
	name: "Generate Random Hex Color",
	section: "Other Stuff",

	subtitle: function(data) {
		return "Generates random hex color code";
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, "Color Code"]);
	},

	fields: ["storage", "varName"],

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text">
	</div>
</div>`;
	},

	init: function() {
		const { glob, document } = this;

		glob.variableChange(document.getElementById("storage"), "varNameContainer");
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const type = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const code = "000000".replace(/0/g, function(){return (~~(Math.random()*16)).toString(16);});
		this.storeValue("#" + code, type, varName, cache);
		this.callNextAction(cache);
	},
	mod: function() {}

};

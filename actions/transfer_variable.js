module.exports = {
	name: "Transfer Variable",  
	section: "Variable Things",  

	subtitle: function(data) {
		const storeTypes = ["", "Temp Variable", "Server Variable", "Global Variable"];
		return `${storeTypes[parseInt(data.storage)]} (${data.varName}) -> ${storeTypes[parseInt(data.storage2)]} (${data.varName2})`;
	},  

	fields: ["storage", "varName", "storage2", "varName2"],  

	html: function(isEvent, data) {
		return `
<div><p>This action has been modified by DBM Mods</p></div><br>
<div>
	<div style="float: left; width: 35%;">
		Transfer Value From:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Transfer Value To:<br>
		<select id="storage2" name="second-list" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text" list="variableList2"><br>
	</div>
</div>`;
	},  

	init: function() {
		const { glob, document } = this;

		glob.variableChange(document.getElementById("storage"), "varNameContainer");
		glob.variableChange(document.getElementById("storage2"), "varNameContainer2");
	},  

	action: function(cache) {
		const data = cache.actions[cache.index];

		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const var1 = this.getVariable(storage, varName, cache);
		if(!var1) {
			this.callNextAction(cache);
			return;
		}

		const storage2 = parseInt(data.storage2);
		const varName2 = this.evalMessage(data.varName2, cache);
		const var2 = this.getVariable(storage2, varName2, cache);
		if(!var2) {
			this.callNextAction(cache);
			return;
		}

		this.storeValue(var1, storage2, varName2, cache);
		this.callNextAction(cache);
	},  

	mod: function() {}
}; 

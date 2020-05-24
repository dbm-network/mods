module.exports = {
	name: "Set Embed Footer",  
	section: "Embed Message",  

	subtitle: function(data) {
		return `${data.message}`;
	},  

	fields: ["storage", "varName", "message", "footerIcon"],  

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 35%;">
		Source Embed Object:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	Footer:<br>
	<textarea id="message" rows="3" placeholder="Insert footer here..." style="width: 93.6%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div><br>
<div style="float: left; width: 104.1%;">
	Footer Icon URL:<br>
	<input id="footerIcon" class="round" type="text" placeholder="Leave blank for none!"><br>
</div>`;
	},  

	init: function() {
		const { glob, document } = this;

		glob.refreshVariableList(document.getElementById("storage"));
	},  

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const embed = this.getVariable(storage, varName, cache);
		const message = parseInt(data.message);
		const footerIcon = parseInt(data.footerIcon);
		if(embed && embed.setFooter) {
			embed.setFooter(this.evalMessage(data.message, cache), this.evalMessage(data.footerIcon, cache));
		}
		this.callNextAction(cache);
	},  

	mod: function() {}
}; 

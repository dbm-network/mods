module.exports = {
	name: "Remove Reaction",  
	section: "Reaction Control",  

	subtitle: function(data) {
		const names = ["Mentioned User", "Command Author", "Temp Variable", "Server Variable", "Global Variable"];
		return `${names[parseInt(data.member)]}`;
	},  

	depends_on_mods: [
		{ name:"WrexMods", path:"aaa_wrexmods_dependencies_MOD.js" }
	],  

	fields: ["reaction", "varName", "member", "varName2"],  

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 35%;">
		Source Reaction:<br>
		<select id="reaction" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br><br>
<div>
	<div style="float: left; width: 35%;">
		Source Member:<br>
		<select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer2')">
			${data.members[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text" list="variableList"><br>
	</div>
</div>`;
	},  

	init: function() {
		const { glob, document } = this;

		glob.refreshVariableList(document.getElementById("reaction"));
		glob.memberChange(document.getElementById("member"), "varNameContainer2");
	},  

	action: function(cache) {
		const data = cache.actions[cache.index];

		const reaction = parseInt(data.reaction);
		const varName = this.evalMessage(data.varName, cache);
		var WrexMods = this.getWrexMods();
		const rea = WrexMods.getReaction(reaction, varName, cache);

		const type = parseInt(data.member);
		const varName2 = this.evalMessage(data.varName2, cache);
		const member = this.getMember(type, varName2, cache);

		if(!WrexMods) return;
		if(!rea) {
			console.log("This is not a reaction"); //Variable is not a reaction -> Error
			this.callNextAction(cache);
		}

		if(member) {
			rea.remove(member);
		}
		this.callNextAction(cache);
	},  

	mod: function() {}
}; 

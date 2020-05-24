module.exports = {
	name: "Check If User Reacted",  
	section: "Conditions",  

	subtitle: function (data) {
		const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions"];
		return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
	},  

	depends_on_mods: [{
		name: "WrexMods",  
		path: "aaa_wrexmods_dependencies_MOD.js"
	}],  

	fields: ["member", "varName", "reaction", "varName2", "iftrue", "iftrueVal", "iffalse", "iffalseVal"],  

	html: function (isEvent, data) {
		return `
<div>
	<div style="float: left; width: 35%;">
		Source Member:<br>
		<select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
			${data.members[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br><br>
<div>
	<div style="float: left; width: 35%;">
		Source Reaction:<br>
		<select id="reaction" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	${data.conditions[0]}
</div>`;
	},  

	init: function () {
		const {
			glob,  
			document
		} = this;

		glob.memberChange(document.getElementById("member"), "varNameContainer");
		glob.refreshVariableList(document.getElementById("reaction"));
		glob.onChangeTrue(document.getElementById("iftrue"));
		glob.onChangeFalse(document.getElementById("iffalse"));
	},  

	action: function (cache) {
		const data = cache.actions[cache.index];

		const type = parseInt(data.member);
		const varName = this.evalMessage(data.varName, cache);
		const member = this.getMember(type, varName, cache);

		const type2 = parseInt(data.reaction);
		const varName2 = this.evalMessage(data.varName2, cache);
		const reaction = this.getWrexMods()
			.getReaction(type2, varName2, cache);

		let result = false;
		if (member && reaction.users) {
			const member22 = String(member)
				.replace(/!/g, "");
			const ar = reaction.users.array();
			const ar22 = String(ar);
			result = ar22.includes(member22);
		}

		if (reaction) {
			if (Array.isArray(member)) {
				result = member.every(function (mem) {
					if (mem && reaction.users) {
						const member2 = String(mem)
							.replace(/!/g, "");
						const ar1 = reaction.users.array();
						const ar12 = String(ar1);
						return ar12.includes(member2);
					} else {
						return false;
					}
				});
			} else if (member && reaction.users) {
				const member22 = String(member)
					.replace(/!/g, "");
				const ar2 = reaction.users.array();
				const ar22 = String(ar2);
				result = ar22.includes(member22);
			}
		}

		this.executeResults(result, data, cache);
	},  

	mod: function (DBM) {}

}; 

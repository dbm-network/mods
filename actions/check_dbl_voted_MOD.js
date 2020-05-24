module.exports = {
	name: "Check DBL Voted",  
	section: "Conditions",  

	subtitle: function(data) {
		const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions"];
		return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
	},  

	fields: ["member", "apitoken", "varName", "iftrue", "iftrueVal", "iffalse", "iffalseVal"],  

	html: function(isEvent, data) {
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
	</div><br><br><br>
<div>
	<div style="float: left; width: 89%;">
		DBL API Token:<br>
		<input id="apitoken" class="round" type="text">
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	${data.conditions[0]}
</div>`;
	},  

	init: function() {
		const { glob, document } = this;

		glob.memberChange(document.getElementById("member"), "varNameContainer");
		glob.onChangeTrue(document.getElementById("iftrue"));
		glob.onChangeFalse(document.getElementById("iffalse"));
	},  

	action: function(cache) {
		const data = cache.actions[cache.index];
		const userid = this.evalMessage(data.userid, cache);
		const apitoken = this.evalMessage(data.apitoken, cache);
		const type = parseInt(data.member);
		const varName = this.evalMessage(data.varName, cache);
		const member = this.getMember(type, varName, cache);

		const WrexMODS = this.getWrexMods();
		const DBL = WrexMODS.require("dblapi.js");
		const dbl = new DBL(apitoken);

		if(!apitoken) {
			console.log("ERROR! Please provide an API token for DBL!");
		}

		dbl.hasVoted(member.user.id).then(voted => {
			this.executeResults(voted, data, cache);
		});
	},  

	mod: function() {}
}; 

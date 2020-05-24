module.exports = {
	name: "Check If Member",
	section: "Conditions",

	subtitle: function(data) {
		const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions"];
		return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
	},

	fields: ["member", "varName", "info", "varName2", "iftrue", "iftrueVal", "iffalse", "iffalseVal"],

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 35%; padding-top: 12px;">
		Source Member:<br>
		<select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
			${data.members[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%; padding-top: 12px;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 20px;">
	<div style="float: left; width: 35%;">
		Check if Member:<br>
		<select id="info" class="round">
			<option value="0" selected>Is Bot?</option>
			<option value="1">Is Bannable?</option>
			<option value="2">Is Kickable?</option>
			<!-- option value="3">Is Speaking?</option --!>
			<option value="4">Is In Voice Channel?</option>
			<option value="5">Is User Manageable?</option>
      		<option value="6">Is Bot Owner?</option>
			<option value="7">Is Muted?</option>
			<option value="8">Is Deafened?</option>
			${ !isEvent && "<option value=\"9\">Is Command Author?</option>"}
			${ !isEvent && "<option value=\"10\">Is Current Server Owner?</option>"}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text" list="variableList2"><br>
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
		const type = parseInt(data.member);
		const varName = this.evalMessage(data.varName, cache);
		//const type2 = parseInt(data.role);
		//const varName2 = this.evalMessage(data.varName2, cache); //Why is this still in here? xD ~ZockerNico
		const member = this.getMember(type, varName, cache);
		const info = parseInt(data.info);
		const Files = this.getDBM().Files;
		const msg = cache.msg;

		let result = false;
		switch(info) {
			case 0:
				if(member.user !== undefined && member.user !== null) {
					result = Boolean(member.user.bot);
				} else {
					result = Boolean(member.bot);
				}
				break;
			case 1:
				result = Boolean(member.bannable);
				break;
			case 2:
				result = Boolean(member.kickable);
				break;
				// case 3:
				// 	result = Boolean(member.speaking);
				// 	break; //Do not ask me why this is not working... ~Lasse
			case 4:
				if(member.voiceChannelID !== undefined && member.voiceChannelID !== null) {
					result = true;
				} else {
					result = false;
				}
				break;
			case 5:
				result = Boolean(member.manageable);
				break;
			case 6:
				if(member.id == Files.data.settings.ownerId) {
					result = true;
				} else {
					result = false;
				}
				break;
			case 7:
				result = Boolean(member.mute);
				break;
			case 8:
				result = Boolean(member.deaf);
				break;
			case 9:
				result = Boolean(member.user.id === msg.author.id);
				break;
			case 10:
				result = Boolean(member.user.id === msg.guild.owner.id);
				break;
			default:
				console.log("Please check your \"Check if Member\" action! There is something wrong...");
				break;
		}
		this.executeResults(result, data, cache);
	},

	mod: function() {}
};

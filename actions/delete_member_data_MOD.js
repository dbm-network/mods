module.exports = {
	name: "Delete Member Data MOD",
	section: "Deprecated",

	subtitle: function(data) {
		const members = ["Mentioned User", "Command Author", "Temp Variable", "Server Variable", "Global Variable"];
		return `${members[parseInt(data.member)]} - ${data.dataName}`;
	},

	fields: ["member", "varName", "dataName"],

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 35%;">
		Member:<br>
		<select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
			${data.members[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList">
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 80%;">
		Data Name:<br>
		<input id="dataName" class="round" placeholder="Leave it blank to delete all data" type="text">
	</div>
</div>`;
	},

	init: function() {
		const { glob, document } = this;

		glob.memberChange(document.getElementById("member"), "varNameContainer");
	},

	action: function(cache) {
		const Files = this.getDBM().Files;
		const data = cache.actions[cache.index];
		const type = parseInt(data.member);
		const varName = this.evalMessage(data.varName, cache);
		const member = this.getMember(type, varName, cache);
		const id = member.id;
		if(member && member.data) {
			const dataName = this.evalMessage(data.dataName, cache);
			if(dataName === undefined) {
				Files.data.players[id] = {};
			} else {
				const memberData = Files.data.players[id];
				delete memberData[dataName];
				Files.data.players[id] = memberData;
			}
			Files.saveData("players");
		}
		this.callNextAction(cache);
	},

	mod: function() {}
};

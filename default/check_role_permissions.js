module.exports = {
	name: "Check Role Permissions",
	section: "Conditions",

	subtitle: function(data) {
		const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions"];
		return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
	},

	fields: ["role", "varName", "permission", "iftrue", "iftrueVal", "iffalse", "iffalseVal"],

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 35%;">
		Source Role:<br>
		<select id="role" class="round" onchange="glob.roleChange(this, 'varNameContainer')">
			${data.roles[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px; width: 80%;">
	Permission:<br>
	<select id="permission" class="round">
		${data.permissions[2]}
	</select>
</div><br>
<div>
	${data.conditions[0]}
</div>`;
	},

	init: function() {
		const { glob, document } = this;

		glob.roleChange(document.getElementById("role"), "varNameContainer");
		glob.onChangeTrue(document.getElementById("iftrue"));
		glob.onChangeFalse(document.getElementById("iffalse"));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.role);
		const varName = this.evalMessage(data.varName, cache);
		const role = this.getRole(storage, varName, cache);
		const info = parseInt(data.permission);
		const reason = this.evalMessage(data.reason, cache);
		let result;
		if(role) {
			result = role.hasPermission([(data.permission)]);
		}
		this.executeResults(result, data, cache);
	},

	mod: function() {}
};

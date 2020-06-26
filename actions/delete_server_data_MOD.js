module.exports = {

	name: "Delete Server Data",

	section: "Deprecated",

	subtitle: function(data) {
		const servers = ['Current Server', 'Temp Variable', 'Server Variable', 'Global Variable'];
		return `${servers[parseInt(data.server)]} - ${data.dataName}`;
	},

	github: "LeonZ2019",
	author: "LeonZ",
	version: "1.1.1",

	fields: ["server", "varName", "dataName"],

	html: function(isEvent, data) {
		return `
	<div>
		<div style="float: left; width: 35%;">
			Server:<br>
			<select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
				${data.servers[isEvent ? 1 : 0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: none; float: right; width: 60%;">
			Variable Name:<br>
			<input id="varName" class="round" type="text" list="variableList">
		</div>
	</div><br><br><br
	<div style="padding-top: 8px;">
		<div style="float: left; width: 80%;">
			Data Name:<br>
			<input id="dataName" class="round" placeholder="Leave it blank to delete all data" type="text">
		</div>
	</div>`
	},

	init: function() {
		const {glob, document} = this;

		glob.serverChange(document.getElementById('server'), 'varNameContainer');
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const type = parseInt(data.server);
		const varName = this.evalMessage(data.varName, cache);
		const server = this.getServer(type, varName, cache);
		const dataName = this.evalMessage(data.dataName, cache);
		if(server) {
			this.callNextAction(cache);
			return;
		}
		server.delData(dataName)
		this.callNextAction(cache);
	},

	mod: function(DBM) {
		DBM.Actions["Delete Server Data MOD"] = DBM.Actions["Delete Server Data"];
		DBM.DiscordJS.Structures.extend("Guild", (Guild) => class extends Guild {
			delData(name) {
				let servers = DBM.Files.data.servers;
				if (servers[this.id] && name && servers[this.id][name]) {
					delete servers[this.id][name];
					DBM.Files.saveData("servers");
				} else if (!name) {
					delete servers[this.id];
					DBM.Files.saveData("servers");
				};
			};
		});
	}

};
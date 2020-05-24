module.exports = {
	name: "Leave Server",  
	section: "Bot Client Control",  

	subtitle: function(data) {
		return "Leaves a server";
	},  

	fields: ["server", "varName"],  

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
</div>`;
	},  

	init: function() {
		const { glob, document } = this;

		glob.serverChange(document.getElementById("server"), "varNameContainer");
	},  

	action: function(cache) {
		const data = cache.actions[cache.index];
		const type = parseInt(data.server);
		const varName = this.evalMessage(data.varName, cache);
		const server = this.getServer(type, varName, cache);
		if(Array.isArray(server)) {
			this.callListFunc(server, "leave").then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else if(server && server.leave) {
			server.leave().then(function() {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},  

	mod: function() {}
}; 

module.exports = {
	name: "Change Global Prefix",
	section: "Bot Client Control",

	subtitle: function(data) {
		return "Change Prefix";
	},

	fields: ["pprefix"],

	html: function(isEvent, data) {
		return `
<div>
	Change Prefix to:<br>
	<textarea id="pprefix" class="round" style="width: 40%; resize: none;" type="textarea" rows="1" cols="20"></textarea><br><br>
</div>`;
	},

	init: function() {},

	action: function(cache) {
		const data = cache.actions[cache.index];

		try {

			var prefix = this.evalMessage(data.pprefix, cache);
			if (prefix) {
				this.getDBM().Files.data.settings.tag = prefix;
				this.getDBM().Files.saveData("settings", function() { console.log("Prefix changed to " + prefix); });
			} else {
				console.log(prefix + " is not valid! Try again!");
			}
		} catch (err) {
			console.log("ERROR!" + err.stack ? err.stack : err);
		}
		this.callNextAction(cache);
	},

	mod: function() {}
};

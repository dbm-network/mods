module.exports = {
	name: "Auto Help",
	section: "Other Stuff",

	subtitle: function(data) {
		return "Included? " + data.Include + " | " + data.Category + ": " + data.Description;
	},

	fields: ["Category", "Description", "Include"],

	html: function(isEvent, data) {
		return `
		<a href="https://www.silversunset.net/paste/raw/230" target="_blank">This RAW DATA</a> is <b>required</b> to use this mod.<br>
		</p>
		<div style="float: left; width: 99%;">
		Category: <input id="Category" class="round" type="text" style="width:99%"><br>
		Description: <textarea id="Description" rows="3" placeholder="Insert description here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea><br>
		Include in Auto Help: <select style="width:33%;" id="Include" class="round">
								<option value="No">No</option>
								<option value="Yes">Yes</option>
							  </select.


	</div>`;
	},

	init: function() {
		const { glob, document } = this;

		glob.sendTargetChange(document.getElementById("Category"), "varNameContainer");
		glob.sendTargetChange(document.getElementById("Description"), "varNameContainer");
		glob.sendTargetChange(document.getElementById("Include"), "varNameContainer");

	},


	action: function(cache) {
		this.callNextAction(cache);
	},

	mod: function() {}
};

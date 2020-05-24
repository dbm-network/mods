module.exports = {
	name: "Jump to Anchor",  
	section: "Other Stuff",  

	subtitle: function(data) {
		return data.description ? `<font color="${data.color}">${data.description}</font>` : `Jump to ${data.jump_to_anchor ? `the "<font color="${data.color}">${data.jump_to_anchor}</font>" anchor in your command if it exists!` : "an anchor!"}`;
	},  

	fields: ["description", "jump_to_anchor", "color"],  

	html: function(isEvent, data) {
		return `
	<div>
		<p>
			<u>Mod Info:</u><br>
			This mod will jump to the specified anchor point<br>
			without requiring you to edit any other skips or jumps.<br>
			<b>This is sensitive and must be exactly the same as your anchor name.</b>
		</p>
	</div><br>
	<div style="float: left; width: 74%;">
		Jump to Anchor ID:<br>
		<input type="text" class="round" id="jump_to_anchor"><br>
	</div>
	<div style="float: left; width: 24%;">
		Anchor Color:<br>
		<input type="color" id="color"><br>
	</div>
	<div style="float: left; width: 98%;">
		Description:<br>
		<input type="text" class="round" id="description"><br>
	</div>
	`;
	},  

	init: function() {},  

	action: function(cache) {
		const errors = { "404": "There was not an anchor found with that exact anchor ID!" };
		const actions = cache.actions;
		const id = cache.actions[cache.index].jump_to_anchor;
		const anchorIndex = actions.findIndex((a) => a.name === "Create Anchor" &&
			a.anchor_id === id);
		if (anchorIndex === -1) throw new Error(errors["404"]);
		cache.index = anchorIndex - 1;
		this.callNextAction(cache);
	},  

	mod: function() {}
}; 

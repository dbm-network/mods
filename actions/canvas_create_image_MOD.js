module.exports = {
	name: "Canvas Create Image",
	section: "Image Editing",

	subtitle: function(data) {
		return `${data.url}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, "Image"]);
	},

	fields: ["url", "storage", "varName"],

	html: function(isEvent, data) {
		return `
<div>
	Local/Web URL:<br>
	<input id="url" class="round" type="text" value="resources/"><br>
</div>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text"><br>
	</div>
</div>`;
	},

	init: function() {
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const Canvas = require("canvas");
		const Discord = require("discord.js");
		Canvas.loadImage(this.evalMessage(data.url, cache)).then((image) => {
			const canvas = Canvas.createCanvas(image.width, image.height);
			const ctx = canvas.getContext("2d");
			ctx.drawImage(image, 0, 0, image.width, image.height);
			const result = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
			const varName = this.evalMessage(data.varName, cache);
			const storage = parseInt(data.storage);
			this.storeValue(result, storage, varName, cache);
			this.callNextAction(cache);
		});
	},

	mod: function() {}
};

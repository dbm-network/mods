module.exports = {
	name: "Custom Image Effects",
	section: "Image Editing",

	subtitle: function(data) {
		const storeTypes = ["", "Temp Variable", "Server Variable", "Global Variable"];
		const effect = ["Custom Blur", "Custom Pixelate"];
		return `${storeTypes[parseInt(data.storage)]} (${data.varName}) -> ${effect[parseInt(data.effect)]} ${data.intensity}`;
	},

	fields: ["storage", "varName", "effect", "intensity"],

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 45%;">
		Base Image:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 50%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 90%;">
		Effect:<br>
		<select id="effect" class="round">
			<option value="0" selected>Custom Blur</option>
			<option value="1">Custom Pixelate</option>
		</select><br>
	</div>
	<div id="intensityContainer" style="float: left; width: 50%;">
		Intensity:<br>
		<input id="intensity" class="round" type="text"><br>
	</div>
</div>`;
	},

	init: function() {
		const { glob, document } = this;

		glob.refreshVariableList(document.getElementById("storage"));
	},

	action: function(cache) {
		var _this = this;
		const data = cache.actions[cache.index];

		var storage = parseInt(data.storage);
		var varName = this.evalMessage(data.varName, cache);
		const image = this.getVariable(storage, varName, cache);
		const intensity= parseInt(data.intensity);

		var Jimp = require("jimp");

		if(!image) {
			this.callNextAction(cache);
			return;
		}
		Jimp.read(image, function(err, image1) {
			const effect = parseInt(data.effect);
			switch(effect) {
				case 0:
					image1.blur(intensity);

					image1.getBuffer(Jimp.MIME_PNG, (error, image2) => {
						_this.storeValue(image2, storage, varName, cache);
						_this.callNextAction(cache);
					});

					break;
				case 1:
					image1.pixelate(intensity);
					image1.getBuffer(Jimp.MIME_PNG, (error, image2) => {
						_this.storeValue(image2, storage, varName, cache);
						_this.callNextAction(cache);
					});
					break;
			}

		});
	},

	mod: function() {}
};

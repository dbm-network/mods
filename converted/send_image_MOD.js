module.exports = {
	name: "Send Image MOD",
	section: "Image Editing",

	subtitle: function(data) {
		const channels = ["Same Channel", "Command Author", "Mentioned User", "Mentioned Channel", "Default Channel (Top Channel)", "Temp Variable", "Server Variable", "Global Variable"];
		return `${channels[parseInt(data.channel)]}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage2);
		if(type !== varType) return;
		return ([data.varName3, "Message"]);
	},

	fields: ["storage", "varName", "channel", "varName2", "message", "imageName", "imageFormat", "storage2", "varName3"],

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 35%;">
		Source Image:<br>
		<select id="storage" class="round" onchange="glob.refreshVariableList(this)">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Send To:<br>
		<select id="channel" class="round" onchange="glob.sendTargetChange(this, 'varNameContainer2')">
			${data.sendTargets[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	Message:
	<textarea id="message" rows="3" placeholder="Insert message here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div><br>
	<div id="imageFormatField" style="float: left; width: 35%;">
		Image Format:<br>
		<select id="imageFormat" class="round">
			<option value=".jpg">JPG</option>
			<option value=".png">PNG</option>
		</select>
	</div>
	<div id="imageNameField" style="float: right; width: 60%;">
		Image Name:<br>
		<input id="imageName" class="round" type="text">
	</div><br><br><br>


<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer3')">
			${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer3" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName3" class="round" type="text">
	</div>
</div>
	`;
	},

	init: function() {
		const { glob, document } = this;

		glob.refreshVariableList(document.getElementById("storage"));
		glob.variableChange(document.getElementById("storage2"), "varNameContainer3"); //Fix the varname container poofing ~TheMonDon
		glob.sendTargetChange(document.getElementById("channel"), "varNameContainer2");
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const server = cache.server;
		const msg = cache.msg;
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const image = this.getVariable(storage, varName, cache);
		if(!image) {
			this.callNextAction(cache);
			return;
		}
		const channel = parseInt(data.channel);
		const varName2 = this.evalMessage(data.varName2, cache);
		const target = this.getSendTarget(channel, varName2, cache);
		const fileName = this.evalMessage(data.imageName, cache);
		if(Array.isArray(target)) {
			const Images = this.getDBM().Images;
			Images.createBuffer(image).then(function(buffer) {
				this.callListFunc(target, "send", [this.evalMessage(data.message, cache), {
					files: [
						{
							attachment: buffer,
							name: `${fileName}${data.imageFormat}`
						}
					]
				}]).then(function(resultMsg) {
					const varName3 = this.evalMessage(data.varName3, cache);
					const storage2 = parseInt(data.storage2);
					this.storeValue(resultMsg, storage2, varName3, cache);
					this.callNextAction(cache);
				}.bind(this));
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else if(target && target.send) {
			const Images = this.getDBM().Images;
			Images.createBuffer(image).then(function(buffer) {
				const varName3 = this.evalMessage(data.varName3, cache);
				const storage2 = parseInt(data.storage2);
				target.send(this.evalMessage(data.message, cache), {
					files: [
						{
							attachment: buffer,
							name: `${fileName}${data.imageFormat}`
						}
					]
				}).then(function(resultMsg) {
					this.storeValue(resultMsg, storage2, varName3, cache);
					this.callNextAction(cache);
				}.bind(this)).catch(this.displayError.bind(this, data, cache));
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function() {}
};

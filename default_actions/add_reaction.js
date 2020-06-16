module.exports = {
	name: "Add Reaction",
	section: "Reaction Control",

	subtitle: function(data) {
		const names = ["Command Message", "Temp Variable", "Server Variable", "Global Variable"];
		const index = parseInt(data.storage);
		return data.storage === "0" ? `Add Reaction to ${names[index]}` : `Add Reaction to ${names[index]} (${data.varName})`;
	},

	fields: ["storage", "varName", "emoji", "varName2", "varName3"],

	html: function(isEvent, data) {
		return `
<div>
	<div style="float: left; width: 35%;">
		Source Message:<br>
		<select id="storage" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
			${data.messages[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		Source Emoji:<br>
		<select id="emoji" name="second-list" class="round" onchange="glob.onChange1(this)">
			<option value="4" selected>Direct Emoji</option>
			<option value="0">Custom Emoji</option>
			<option value="1">Temp Variable</option>
			<option value="2">Server Variable</option>
			<option value="3">Global Variable</option>
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%;">
		<span id="extName">Emoji  (right-click -> Insert Emoji)</span>:<br>
		<input id="varName2" class="round" type="text">
	</div>
	<div id="varNameContainer3" style="float: right; width: 60%; display: none;">
		Variable Name:<br>
		<input id="varName3" class="round" type="text" list="variableList2">
	</div>
</div>`;
	},

	init: function() {
		const { glob, document } = this;

		glob.onChange1 = function(event) {
			const value = parseInt(event.value);
			const varNameInput = document.getElementById("extName");
			if(value === 0) {
				varNameInput.innerHTML = "Emoji Name";
				document.getElementById("varNameContainer3").style.display = "none";
				document.getElementById("varNameContainer2").style.display = null;
			} else if(value === 4) {
				varNameInput.innerHTML = "Emoji  (right-click -> Insert Emoji)";
				document.getElementById("varNameContainer3").style.display = "none";
				document.getElementById("varNameContainer2").style.display = null;
			} else {
				glob.onChangeBasic(event, "varNameContainer3");
				document.getElementById("varNameContainer3").style.display = null;
				document.getElementById("varNameContainer2").style.display = "none";
			}
		};

		glob.onChange1(document.getElementById("emoji"));
		glob.messageChange(document.getElementById("storage"), "varNameContainer");
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const storage = parseInt(data.storage);
		const varName = this.evalMessage(data.varName, cache);
		const message = this.getMessage(storage, varName, cache);

		const type = parseInt(data.emoji);
		let emoji;
		if(type === 4) {
			emoji = this.evalMessage(data.varName2, cache);
		} else if(type === 0) {
			emoji = this.getDBM().Bot.bot.emojis.find(element => element.name === this.evalMessage(data.varName2, cache));
		} else {
			emoji = this.getVariable(type, this.evalMessage(data.varName3, cache), cache);
		}

		if(Array.isArray(message)) {
			this.callListFunc(message, "react", [emoji]).then(function() {
				this.callNextAction(cache);
			}.bind(this));
		} else if(emoji && message && message.react) {
			message.react(emoji).then(function() {
				this.callNextAction(cache);
			}.bind(this)).catch(this.displayError.bind(this, data, cache));
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function() {}
};

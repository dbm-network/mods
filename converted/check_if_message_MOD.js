module.exports = {
	name: "Check If Message",
	section: "Conditions",

	subtitle: function(data) {
		const results = ["Continue Actions", "Stop Action Sequence", "Jump To Action", "Jump Forward Actions"];
		return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`;
	},

	fields: ["message", "varName", "info", "varName2", "iftrue", "iftrueVal", "iffalse", "iffalseVal"],

	html: function(isEvent, data) {
		return `
        <div style="float: left; width: 35%; padding-top: 15px;">
            Source Message:<br>
            <select id="message" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
                ${data.messages[isEvent ? 1 : 0]}
            </select>
        </div>
        <div id="varNameContainer" style="display: none; float: right; width: 60%; padding-top: 12px;">
            Variable Name:<br>
            <input id="varName" class="round" type="text" list="variableList"><br>
        </div>
    </div><br><br><br>
    <div style="padding-top: 20px;">
        <div style="float: left; width: 40%;">
            Check If Message:<br>
            <select id="info" class="round">
                <option value="0">Is Pinnable?</option>
                <option value="1">Is Pinned?</option>
                <option value="2">Is Deletable?</option>
                <option value="3">Is Deleted?</option>
                <option value="4">Is TTS?</option>
                <option value="5">Is Of Discord?</option>
                <option value="6">Includes @everyone Mention?</option>
            </select>
        </div>
        <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
		    Variable Name:<br>
            <input id="varName2" class="round" type="text" list="variableList2"><br>
        </div>
        </div><br><br><br>
    <div style="padding-top: 8px;">
        ${data.conditions[0]}
    </div>`;
	},

	init: function() {
		const { glob, document } = this;

		glob.messageChange(document.getElementById("message"), "varNameContainer");
		glob.onChangeTrue(document.getElementById("iftrue"));
		glob.onChangeFalse(document.getElementById("iffalse"));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const message = parseInt(data.message);
		const varName = this.evalMessage(data.varName, cache);
		const msg = this.getMessage(message, varName, cache);
		const info = parseInt(data.info);
		let result = false;
		switch(info) {
			case 0:
				result = msg.pinnable;
				break;
			case 1:
				result = msg.pinned;
				break;
			case 2:
				result = msg.deletable;
				break;
			case 3:
				result = msg.deleted;
				break;
			case 4:
				result = msg.tts;
				break;
			case 5:
				result = msg.system;
				break;
			case 6:
				result = msg.mentions.everyone;
				break;
			default:
				console.log("Err! Check if the action \"Check If Message\" is set correctly! ~~Cap");
				break;
		}
		this.executeResults(result, data, cache);
	},

	mod: function() {}
};

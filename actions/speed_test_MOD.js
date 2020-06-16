module.exports = {
	name: "Speed Test",
	section: "Other Stuff",

	subtitle: function(data) {
		if (data.info === "downloadspeed") {
			return "Speed Test - Download Speed";
		} else if (data.info === "uploadspeed") {
			return "Speed Test - Upload Speed";
		} else {
			return "Error in subtitles.";
		}
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		let dataType;
		if (data.info === "downloadspeed") {
			dataType = "Download Speed";
		} else if (data.info === "uploadspeed") {
			dataType = "Upload Speed";
		} else {
			dataType = "Unknown Data Type";
		}
		return ([data.varName, dataType]);
	},

	fields: ["info", "type", "storage", "varName"],

	html: function(isEvent, data) {
		return `
	<div style="float: left; width: 50%; padding-top: 8px;">
		Speed:<br>
		<select id="info" class="round">
			<option value="downloadspeed" selected>Download Speed</option>
			<option value="uploadspeed">Upload Speed</option>
		</select>
	</div>
		<div style="float: left; width: 50%; padding-left: 10px; padding-top: 8px;">
		Bit Type:<br>
		<select id="type" class="round">
			<option value="0" selected>MB/s</option>
			<option value="1">KB/s</option>
		</select>
        </div><br><br><br>
	<div>
		<div style="float: left; width: 35%; padding-top: 8px;">
			Store In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%; padding-top: 8px;">
			Variable Name:<br>
			<input id="varName" class="round" type="text"><br>
		</div>
	</div>

        <style>
        /* START OF EMBED CSS */
        div.embed { /* <div class="embed"></div> */
            position: relative;
        }
            embedleftline { /* <embedleftline></embedleftline> OR if you wan't to change the Color: <embedleftline style="background-color: #HEXCODE;"></embedleftline> */
                background-color: #eee;
                width: 4px;
                border-radius: 3px 0 0 3px;
                border: 0;
                height: 100%;
                margin-left: 4px;
                position: absolute;
            }
            div.embedinfo { /* <div class="embedinfo"></div> */
                background: rgba(46,48,54,.45) fixed;
                border: 1px solid hsla(0,0%,80%,.3);
                padding: 10px;
                margin:0 4px 0 7px;
                border-radius: 0 3px 3px 0;
            }
                span.embed-auth { /* <span class="embed-auth"></span> (Title thing) */
                    color: rgb(255, 255, 255);
                }
                span.embed-desc { /* <span class="embed-desc"></span> (Description thing) */
                    color: rgb(128, 128, 128);
                }

                span { /* Only making the text look, nice! */
                    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                }
                </style>`;
	},

	init: function() {
		const { glob, document } = this;
		glob.variableChange(document.getElementById("storage"), "varNameContainer");
	},

	action: function(cache) {
		const _this = this; //This is needed sometimes
		const data = cache.actions[cache.index];
		const info = _this.evalMessage(data.info);
		const type = parseInt(data.type);

		// Main code:
		const Mods = _this.getMods(); // as always.
		Mods.CheckAndInstallNodeModule("speedtest-net"); //To install module automatically
		const speedTest = Mods.require("speedtest-net");
		const test = speedTest({ maxTime: 5000 });

		let result;
		test.on(`${info}`, (speed) => {
			switch (type) {
				case 0:
					result = speed;
					break;
				case 1:
					result = (speed * 125).toFixed(2);
					break;
				default:
					break;
			}

			if (result !== undefined) {
				const storage = parseInt(data.storage);
				const varName2 = _this.evalMessage(data.varName, cache);
				_this.storeValue(result, storage, varName2, cache);
			}
			_this.callNextAction(cache);

		});

		test.on("error", (error) => {
			console.log("Error in Speed Test MOD: " + error);
			_this.callNextAction(cache);
		});
	},

	mod: function() {}

};

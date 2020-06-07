module.exports = {
	name: "Download File",
	section: "File Stuff",

	subtitle: function(data) {
		return `${data.url}`;
	},

	fields: ["url", "fileName", "fileFormat", "filePath"],

	html: function(isEvent, data) {
		return `
<div style="float: left;">
	Web URL:<br>
	<input id="url" class="round" type="text" style="width: 522px" oninput="glob.onInput1(this)"><br>
</div><br><br><br>
<div style="float: left;">
  <div style="float: left; width: 60%;">
	File Name:<br>
	<input id="fileName" class="round" type="text" style="width: 400px"><br>
  </div>
  <div style="float: left; width: 35%; padding-left: 100px;">
  File Format:<br>
	<input id="fileFormat" class="round" type="text" style="width: 100px"><br>
  </div>
</div><br><br><br><br>
<div style="float: left;">
	File Path:<br>
	<input id="filePath" class="round" type="text" style="width: 522px" value="./downloads"><br>
</div><br><br><br><br>
<p>
  <u><b><span style="color: white;">NOTE:</span></b></u><br>
  In File Path, "./" represents the path to your bot folder<br>
  File Name and File Format are automatic but you can change them
</p>
`;
	},

	init: function() {
		const { glob, document } = this;

		glob.onInput1 = function() {
			var x = document.getElementById("url").value.replace(/(\/|\\)+$/, "").split("/");
			var y = x[x.length-1];

			let arrayy = [];
			var regex = new RegExp(/\./, "g");
			let rE;
			while (rE = regex.exec(y)) {
				arrayy.push(rE);
			}

			if(arrayy.length == 0 || !y.substring(arrayy[arrayy.length-1].index+1)) {
				document.getElementById("fileName").placeholder = "";
				document.getElementById("fileFormat").placeholder = "";
			} else {
				var fN = y.substring(0, arrayy[arrayy.length-1].index);
				var fF = y.substring(arrayy[arrayy.length-1].index+1);

				document.getElementById("fileName").placeholder = fN;
				document.getElementById("fileFormat").placeholder = fF;
			}
		};

		glob.onInput1(document.getElementById("url"));
	},

	action: function(cache) {
		const data = cache.actions[cache.index];

		var url = this.evalMessage(data.url, cache);
		var fileName = this.evalMessage(data.fileName, cache);
		var fileFormat = this.evalMessage(data.fileFormat, cache);
		var filePath = this.evalMessage(data.filePath, cache);

		if(!url) {
			console.log(`Action: #${cache.index + 1} | Download File ERROR: Web URL has nothing`);
			this.callNextAction(cache);
			return;
		}

		if(!fileName || !fileFormat) {
			var x = url.replace(/(\/|\\)+$/, "").split("/");
			var y = x[x.length-1];

			let arrayy = [];
			var regex = new RegExp(/\./, "g");
			let rE;
			while (rE = regex.exec(y)) {
				arrayy.push(rE);
			}

			if(arrayy.length == 0 || !y.substring(arrayy[arrayy.length-1].index+1)) {
				if(!fileName && !fileFormat) {
					console.log(`Action: #${cache.index + 1} | Download File ERROR: File Name and File Format has nothing`);
					this.callNextAction(cache);
					return;
				} else if(!fileName) {
					console.log(`Action: #${cache.index + 1} | Download File ERROR: File Name has nothing`);
					this.callNextAction(cache);
					return;
				} else if(!fileFormat) {
					console.log(`Action: #${cache.index + 1} | Download File ERROR: File Format has nothing`);
					this.callNextAction(cache);
					return;
				}
			} else {
				var fN = y.substring(0, arrayy[arrayy.length-1].index);
				var fF = y.substring(arrayy[arrayy.length-1].index+1);

				if(!fileName && !fileFormat) {
					fileName = fN;
					fileFormat = fF;
				} else if(!fileName) {
					fileName = fN;
				} else if(!fileFormat) {
					fileFormat = fF;
				}
			}
		}

		if(!filePath) {
			console.log(`Action: #${cache.index + 1} | Download File ERROR: File Path has nothing`);
			this.callNextAction(cache);
			return;
		}

		function gR(input) {
			var illegalRe = /[\/\?<>\\:\*\|":]/g;
			var controlRe = /[\x00-\x1f\x80-\x9f]/g;
			var reservedRe = /^\.+$/;
			var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
			var windowsTrailingRe = /[\. ]+$/;
			var rG = input
				.replace(illegalRe, "")
				.replace(controlRe, "")
				.replace(reservedRe, "")
				.replace(windowsReservedRe, "")
				.replace(windowsTrailingRe, "");
			return rG;
		}
		fileName = gR(fileName);
		fileFormat = gR(fileFormat);

		var WrexMODS = this.getWrexMods();
		var request = WrexMODS.require("request");
		var path = require("path");
		var fs = require("fs");

		if (!fs.existsSync(filePath)){
			fs.mkdirSync(filePath);
		}

		request.get(url).on("error", function(err) {console.log(`Action: #${cache.index + 1} | Download File ERROR: Web URL not found...`);}).pipe(fs.createWriteStream(path.resolve(filePath, fileName + "." + fileFormat)));
		this.callNextAction(cache);
	},

	mod: function() {}
};

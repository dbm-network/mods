module.exports = {
	name: "Store HTML From Webpage",
	section: "HTML/XML Things",

	subtitle: function(data) {
		return `URL: ${data.url}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		return ([data.varName, "HTML Webpage"]);
	},

	fields: ["url", "storage", "varName"],

	html: function(isEvent, data) {
		return `

		<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
		<div>
			<p>
				<u>Instructions:</u><br>
					1. Input a url into the Webpage URL textarea<br>
					2. Click valid URL to check if the url is valid!
			</p>
		</div>
		<div style="float: left; width: 95%;">
			Webpage URL: <br>
			<textarea id="url" class="round" style="width: 99%; resize: none;" type="textarea" rows="4" cols="20"></textarea><br>
		</div>
	  <div>
		<button class="tiny compact ui labeled icon button" onclick="glob.checkURL(this)"><i class="plus icon"></i>Check URL</button><br>
		Valid: <text id="valid" style="color: red">Input A Url</text>
	  </div><br>
		<div style="float: left; width: 35%;">
			Store In:<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer" style="display: ; float: right; width: 60%;">
			Storage Variable Name:<br>
			<input id="varName" class="round" type="text">
		</div>
	</div>
	`;
	},

	init: function() {
		const { glob, document } = this;


		function evalMessage(content) {
			if(!content) return "";
			if(!content.match(/\$\{.*\}/im)) return content;
			return content.replace(/\$\{.*\}/im, "CUSTOMVALUE");
		}

		try {

			var WrexMODS = require(require("path").join(__dirname, "aaa_wrexmods_dependencies_MOD.js")).getWrexMods();

			var valid = document.getElementById("valid");
			var url = document.getElementById("url");

			glob.checkURL = function(element){

				const pUrl = url.value;

				const checkedUrl = WrexMODS.checkURL(encodeURI(evalMessage(pUrl)));

				if(checkedUrl && pUrl){
					valid.innerHTML = "Valid URL Format!";
					valid.style.color = "green";
				}else{
					valid.innerHTML = "Invalid URL Format!";
					valid.style.color = "red";
				}

			};


		} catch (error) {
			// write any init errors to errors.txt in dbm's main directory
			require("fs").appendFile("errors.txt", error.stack ? error.stack : error + "\r\n");
		}

		glob.variableChange(document.getElementById("storage"), "varNameContainer");

	},

	action: function(cache) {

		try {

			var WrexMODS = this.getWrexMods();

			const data = cache.actions[cache.index];

			const varName = this.evalMessage(data.varName, cache);
			const storage = parseInt(data.storage);

			var url = this.evalMessage(data.url, cache);

			if(!WrexMODS.checkURL(url)){
				url = encodeURI(url);
			}

			if(WrexMODS.checkURL(url)){

				// making sure all the required node modules are installed
				var request = WrexMODS.require("request");

				request(url, function(err, res, html) {

					if(err) throw err;

					this.storeValue(html.trim(), storage, varName, cache)	;
					this.callNextAction(cache);

				}.bind(this));

			}else{
				throw Error("HTML Parser - URL ["+url+"] Is Not Valid");
			}

		} catch (error) {
			console.error("API Things:  Error: " + error.stack ? error.stack : error);
		}

	},

	mod: function() {}
};

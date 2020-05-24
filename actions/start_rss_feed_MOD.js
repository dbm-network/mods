module.exports = {
	name: "RSS Feed Watcher",  
	section: "Other Stuff",  

	subtitle: function (data) {
		return `${data.url}`;
	},  


	variableStorage: function (data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		return ([data.varName, "RSS Feed"]);
	},  

	fields: ["path", "url", "storage", "varName"],  

	html: function (isEvent, data) {
		return `
	<div style="padding-top: 8px;">
	<div style="float:left"><u>Note:</u><b>This action will not stop watching the feed until bot restarts or using Stop RSS Feed Watcher action!</b></div><br>
<br>
<div style="float:left"><b>The next actions will be called on feed update!</b></div><br>

<div>
	Local/Web URL:<br>
	<input id="url" class="round" type="text" placeholder="eg. https://github.com/dbm-mods.atom"><br>
</div>
<div>
	Json Path:<br>
	<input id="path" class="round" type="text" placeholder="Leave Blank if not needed."><br>
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

	init: function () {},  

	action: function (cache) {
		const data = cache.actions[cache.index];
		const url = this.evalMessage(data.url, cache);
		const varName = this.evalMessage(data.varName, cache);
		const storage = parseInt(data.storage);
		const path = parseInt(data.path);
		var _this = this;
		var stor = storage + varName;
		console.log(stor);
		const WrexMODS = this.getWrexMods();
		const { JSONPath } = WrexMODS.require("jsonpath-plus");
		var Watcher = WrexMODS.require("feed-watcher"),  
			feed = url,  
			interval = 10; // seconds

		// if not interval is passed, 60s would be set as default interval.
		var watcher = new Watcher(feed, interval);
		this.storeValue(watcher, storage, stor, cache);

		// Check for new entries every n seconds.
		watcher.on("new entries", function (entries) {
			entries.forEach(function (entry) {

				if(path){
					var res = JSONPath({
						path: path,  
						json: entry
					});
					_this.storeValue(res, storage, varName, cache);
				} else if (!path){
					_this.storeValue(entry, storage, varName, cache);
				}



				_this.callNextAction(cache);
			});
		});

		// Start watching the feed.
		watcher
			.start()
			.then(function (entries) {
				console.log("Starting watching...");
			})
			.catch(function (error) {
				console.error(error);
			});



	},  

	mod: function (DBM) {}

}; 

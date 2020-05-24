module.exports = {
	name: "Store Time Info",  
	section: "Other Stuff",  

	subtitle: function(data) {
		const time = ["Year", "Month (Number)", "Day of the Month", "Hour", "Minute", "Second", "Milisecond", "Month (text)"];
		return `${time[parseInt(data.type)]}`;
	},  

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if(type !== varType) return;
		let result = "Number";
		if(data.type === "7") {
			result = "Text";
		}
		return ([data.varName, result]);
	},  

	fields: ["type", "storage", "varName"],  

	html: function(isEvent, data) {
		return `
<div>
	<div style="padding-top: 8px; width: 70%;">
		Time Info:<br>
		<select id="type" class="round">
			<option value="0" selected>Year</option>
			<option value="1">Month (Number)</option>
			<option value="7">Month (Text)</option>
			<option value="2">Day of the Month</option>
			<option value="3">Hour</option>
			<option value="4">Minute</option>
			<option value="5">Second</option>
			<option value="6">Milisecond</option>
		</select>
	</div>
</div><br>
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

	init: function() {},  

	action: function(cache) {
		const data = cache.actions[cache.index];
		const type = parseInt(data.type);
		let result;
		switch(type) {
			case 0:
				result = new Date().getFullYear();
				break;
			case 1:
				result = new Date().getMonth() + 1;
				break;
			case 2:
				result = new Date().getDate();
				break;
			case 3:
				result = new Date().getHours();
				break;
			case 4:
				result = new Date().getMinutes();
				break;
			case 5:
				result = new Date().getSeconds();
				break;
			case 6:
				result = new Date().getMiliseconds();
				break;
			case 7:
				const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
				result = months[(new Date().getMonth())];
			default:
				break;
		}
		//console.log((new Date()).year)
		if(result !== undefined) {
			const storage = parseInt(data.storage);
			const varName = this.evalMessage(data.varName, cache);
			this.storeValue(result, storage, varName, cache);
		}
		this.callNextAction(cache);
	},  

	mod: function() {}
}; 

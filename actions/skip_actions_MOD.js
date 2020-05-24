module.exports = {
	name: "Skip Actions",  
	section: "Other Stuff",  

	subtitle: function(data) {
		return `Skip ${data.count}`;
	},  

	fields: ["count"],  

	html: function(isEvent, data) {
		return `
<div>
	<div id="varNameContainer" style="float: left; width: 60%;">
		Actions To Skip:<br>
		<input id="count" class="round" type="number">
	</div>
</div><br><br><br>`;
	},  

	init: function() {},  

	action: function(cache) {
		const data = cache.actions[cache.index];

		const amnt = parseInt(this.evalMessage(data.count, cache));
		const index2 = cache.index + amnt + 1;

		if(cache.actions[index2]) {
			cache.index = index2 - 1;
			this.callNextAction(cache);
		}
	},  

	mod: function() {}
}; 

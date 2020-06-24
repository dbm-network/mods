module.exports = {
	name: "Loop Through All Servers",
	section: "Lists and Loops",

	subtitle: function(data) {
		return `Loop Servers through Event ID "${data.source}"`;
	},

	fields: ["source", "type"],

	html: function(isEvent, data) {
		return `
	<div><p>This action has been modified by DBM Mods.</p></div><br>
	<div style="width: 85%;">
		Event:<br>
		<select id="source" class="round">
		</select>
	</div><br>
	<div style="width: 85%;">
		Call Type:<br>
		<select id="type" class="round">
			<option value="true" selected>Synchronous</option>
			<option value="false">Asynchronous</option>
		</select>
	</div>`;
	},

	init: function() {
		const { glob, document } = this;

		const $evts = glob.$evts;
		const source = document.getElementById("source");
		source.innerHTML = "";
		for(let i = 0; i < $evts.length; i++) {
			if($evts[i]) {
				source.innerHTML += `<option value="${i}">${$evts[i].name}</option>\n`;
			}
		}
	},

	action: function(cache) {
		const data = cache.actions[cache.index];
		const Files = this.getDBM().Files;
		const bot = this.getDBM().Bot.bot;

		const id = data.source;
		let actions;
		const allData = Files.data.events;
		for(let i = 0; i < allData.length; i++) {
			if(allData[i] && allData[i]._id === id) {
				actions = allData[i].actions;
				break;
			}
		}
		if(!actions) {
			this.callNextAction(cache);
			return;
		}

		const servers = bot.guilds.cache.array();
		const act = actions[0];
		if(act && this.exists(act.name)) {
			const looper = function(i) {
				if(!servers[i]) {
					if(data.type === "true") this.callNextAction(cache);
					return;
				}
				const cache2 = {
					actions: actions,
					index: 0,
					temp: cache.temp,
					server: servers[i],
					msg: (cache.msg || null)
				};
				cache2.callback = function() {
					looper(i + 1);
				}.bind(this);
				this[act.name](cache2);
			}.bind(this);
			looper(0);
			if(data.type === "false") this.callNextAction(cache);
		} else {
			this.callNextAction(cache);
		}
	},

	mod: function() {}
};

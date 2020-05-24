module.exports = {
	name: "Find Member",
	section: "Member Control",

	subtitle: function(data) {
		const op1 = ["Member", "User"];
		const info = [" ID", " Username", " Display Name", " Tag", " Color"];
		return `Find ${op1[parseInt(data.find2)]} by ${op1[parseInt(data.find2)]}${info[parseInt(data.info)]}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		const op1 = ["Member", "User"];
		if(type !== varType) return;
		return ([data.varName, `Server ${op1[parseInt(data.find2)]}`]);
	},

	fields: ["info", "find", "storage", "varName", "find2", "iffalse", "iffalseVal"],

	html: function(isEvent, data) {
		return `
		<div><p>This action has been modified by DBM Mods.</p></div><br>
		<div style="float: left;">
		<select id="find2" onchange="glob.change()">
		<option value="0" selected>Find Member (current server only)</option>
		<option value="1">Find User (all servers)</option>
		</select></div><br><br>
		<div>
			<div style="float: left; width: 40%;">
				Source Field:<br>
				<select id="info" class="round">
					<option value="0" selected>Member ID</option>
					<option value="1">Member Username</option>
					<option value="3">Member Tag</option>
					<option value="2">Member Display Name</option>
					<option value="4">Member Color</option>
				</select>
			</div>
			<div style="float: right; width: 55%;">
				Search Value:<br>
				<input id="find" class="round" type="text">
			</div>
		</div><br><br><br>
		<div style="padding-top: 8px;">
			<div style="float: left; width: 35%;">
				Store In:<br>
				<select id="storage" class="round">
					${data.variables[1]}
				</select>
			</div>
			<div id="varNameContainer" style="float: right; width: 60%;">
				Variable Name:<br>
				<input id="varName" class="round" type="text">
			</div>
			<div style="float: left; width: 35%; padding-top: 10px;">
            If Member Wasn't Found:<br>
            <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
				<option value="0" selected>Continue Actions</option>
				<option value="1">Stop Action Sequence</option>
				<option value="2">Jump To Action</option>
				<option value="3">Skip Next Actions</option>
		 </select>
		</div>
        <div id="iffalseContainer" style="display: none; float: right; width: 60%; padding-top: 10px;">
            <span id="iffalseName">Action Number</span>:<br><input id="iffalseVal" class="round" type="text">
        </div>
		</div>
	`;
	},

	init: function() {
		const { glob, document } = this;
		glob.change = function(event){
			try{
				var sel = document.getElementById("find2");
				var option = document.getElementById("info");
				var x = document.getElementById("info");
				if(sel.value == "0"){
					for(let i = 0; i < option.length; i++){
						option[i].disabled = false;
						option[i].innerHTML = option[i].innerHTML.replace(/[^\s]*/, "Member");
					}
				}else if(sel.value == "1"){
					option[3].disabled = true;
					option[4].disabled = true;
					for(let i = 0; i < option.length; i++){
						option[i].innerHTML = option[i].innerHTML.replace(/[^\s]*/, "User");
					}
				}
			}catch(err){alert(err);}
		};
		glob.change(document.getElementById("find"));
		glob.change();
		glob.onChangeFalse(document.getElementById("iffalse"));
	},

	action: function(cache) {
		const server = cache.server;
		if(!server || !server.members) {
			this.callNextAction(cache);
			return;
		}
		const data = cache.actions[cache.index];
		const info = parseInt(data.info);
		const find = this.evalMessage(data.find, cache);
		const find2 = parseInt(data.find2);

		//Checks if server is large and caches all users to verify that offline users are tracked.
		if(server.large == true) {
			server.fetchMembers();
		}
		//End

		let result;
		switch(info) {
			case 0:

				result = find2 == 0 ? server.members.find(element => element.id === find) : this.getDBM().Bot.bot.users.find(element => element.id === find);

				break;
			case 1:
				result = find2 == 0 ? server.members.find(function(mem) {
					return mem.user ? mem.user.username === find : false;
				}) : this.getDBM().Bot.bot.users.find(function(mem) {
					return mem ? mem.username === find : false;
				});
				break;
			case 2:
				result = find2 == 0 ? server.members.find(element => element.displayName === find) : this.getDBM().Bot.bot.users.find(element => element.displayName === find);
				break;
			case 3:
				result = find2 == 0 ? server.members.find(function(mem) {
					return mem.user ? mem.user.tag === find : false;
				}) : this.getDBM().Bot.bot.users.find(function(mem) {
					return mem ? mem.tag === find : false;
				});
				break;
			case 4:
				result = find2 == 0 ? server.members.find(element => element.displayColor === find) : this.getDBM().Bot.bot.users.find(element => element.displayColor === find);
				break;
			default:
				break;
		}

		if(result !== null || result !== undefined) {
			const storage = parseInt(data.storage);
			const varName = this.evalMessage(data.varName, cache);
			this.storeValue(result, storage, varName, cache);
			this.callNextAction(cache);
		} else {
			this.executeResults(false, data, cache);
		}
	},

	mod: function() {}
};


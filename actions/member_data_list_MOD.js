module.exports = {
	name: "Store Member Data List",
	section: "Member Control",

	subtitle: function(data) {
		return `${[(data.dataName)]}`;
	},

	variableStorage: function(data, varType) {
		const type = parseInt(data.storage);
		if (type !== varType) return;
		return ([data.varName2, "Array"]);
	},

	fields: ["debu", "numbefst2", "numbefst", "numbefstselect", "sort", "start", "middle", "end", "getresults", "dataName", "varName2", "storage"],

	html: function(isEvent, data) {
		return `
	<html>
	<div id="wrexdiv2" style="width: 550px; height: 350px; overflow-y: scroll;">
<div>
<div style="padding-top: 8px;">
	<div style="float: left; width: 50%;">
		Data Name:<br>
		<input id="dataName" class="round" type="text">
	</div>
	<span>

</div>
      Number before start
<select id="numbefstselect" class="round" style="width:33%" onchange="glob.onChange1(this)">
<option value="1" >No</option>
<option value="2"selected>Yes</option>
</select>
<br>


<div id="numbefst" style=" width: 80%; display: none;">
Char after Number:<br>
<input id="numbefst2" class="round" type="text" value=")">
</div>
<br>

	Start:

	<select id="start" class="round" style="width:33%">
	<option value="result" >Result</option>
	<option value="username"selected>Username</option>
	</select>
    <br>

    	<div style="display: table-cell;">
		Middle:


		<input id="middle" style="width:80%"  class="round" type="text" value="-">
		</input>
			<br>

	End:


	<select id="end" class="round" style="width:100%">

	<option value="result" selected>Result</option>
	<option value="username">Username</option>
	</select><br>


   </span>
   </div>
   <select id="sort" class="round" style="width: 90%;">
   <option value="0" selected>Don't Sort</option>
   <option value="1" selected>Sort from Descending</option>
   <option value="2">Sort from Ascending</option>
</select><br>



	<div style="float: left; width: 50%; font-family: monospace; white-space: nowrap; resize: none;">
	Result Limit:
	<input id="getresults" class="round" type="text" placeholder="If blank it gets all results.">
</div><br><br><br>
	<div style="float: left; width: 35%; font-family: monospace; white-space: nowrap; resize: none;"">
	Store In:<br>
	<select id="storage" class="round">
		${data.variables[1]}
	</select>
</div>
<div id="varNameContainer2" style="float: right; width: 60%;">
	Variable Name:<br>
	<input id="varName2" class="round" type="text"><br>
</div>
</div>
<select id="debu" class="round" style="width: 90%;">
<option value="0" selected>Debug</option>
<option value="1" selected>Don't Debug</option>

</select><br>
</div>
</html>`;
	},

	init: function() {
		const {
			glob,
			document
		} = this;
		glob.onChange1 = function(event) {
			const value = parseInt(event.value);
			const dom = document.getElementById("numbefst");


			if(value == 1) {
				dom.style.display = "none";

			} else if(value == 2) {

				dom.style.display = null;
			}

		};
		glob.onChange1(document.getElementById("numbefstselect"));
	},

	action: function(cache) {
		var _this = this;
		const data = cache.actions[cache.index];
		var msg = cache.msg;
		const type = parseInt(data.member);
		const varName = this.evalMessage(data.varName, cache);
		const storage = parseInt(data.storage);
		const varName2 = this.evalMessage(data.varName2, cache);
		const st = this.evalMessage(data.start, cache);
		const mid = this.evalMessage(data.middle, cache);
		const selectionsnum = parseInt(data.numbefstselect);

		const en = this.evalMessage(data.end, cache);
		const sort = parseInt(data.sort);
		const debug = parseInt(data.debu);
		const Mods = this.getMods();

		var Discord = Mods.require("discord.js");
		var fastsort = Mods.require("fast-sort");
		var client = new Discord.Client();
		const { JSONPath } = Mods.require("jsonpath-plus");
		const fs = require("fs");
		var file = fs.readFileSync("./data/players.json", "utf8");

		if (file) {
			var dataName = this.evalMessage(data.dataName, cache);
			dataName = "[" + "'" + dataName + "'" + "]";

			const isAdd = Boolean(data.changeType === "1");
			let val = this.evalMessage(data.value, cache);
			var list2 = [];
			var list = [];
			var list4 = [];
			var list5 = [];

			if (val !== undefined) {
				const file = JSON.parse(file);
				try {
					const list = [];
					var result = JSONPath({
						path: "$.[?(@" + dataName + " || @" + dataName + " > -9999999999999999999999999999999999999999999999999999999)]*~",
						json: file
					});
					var pull = result;

					for (var i = 0; i < result.length; i++) {

						var result2 = JSONPath({
							path: "$." + result[i] + dataName,
							json: file
						});

						try {
							var user = msg.guild.members.get(result[i]);
							let tag = user.user.tag;

							var name2 = "'" + "name" + "'";
							var id = "'" + "id" + "'";
							var tag2 = "" + tag + "";
							var res2 = "" + result2 + "";

							list.push({
								id: tag2,
								name2: res2
							});
						} catch (err) {
							if (debug === 0) console.log(err);
						}
					}
					switch (sort) {
						case 1:
							result = fastsort(list).desc((u) => parseInt(u.name2));
							break;
						case 2:

							result = fastsort(list).asc((u) => parseInt(u.name2));
							break;
						case 0:
							result = list;
							break;
					}

					var result2 = JSON.stringify(result);
					var getres = parseInt(this.evalMessage(data.getresults, cache));

					if (!getres) {
						getres = result.length;
					}

					for (var i = 0; i < getres; i++) {
						var result2 = JSON.stringify(list[i]);

						try {
							const file = JSON.parse(result2);

							var res = JSONPath({
								path: "$..name2",
								json: file
							});

							const res2 = JSONPath({
								path: "$..id",
								json: file
							});

							var username = res2;
							var result = res;

							eval(" " + st + " ");
							var middle = " " + mid + " ";
							eval(" " + en + " ");
							var username = res2;
							var result = res;
							var en2 = eval(en);
							var st2 = eval(st);
							list5.push("easter egg :eyes:");
							switch (selectionsnum) {
								case 1:
									list2.push(st2 + middle + en2 + "\n");
									break;
								case 2:
									var num = list5.length;
									var numbef = this.evalMessage(data.numbefst2, cache);
									list2.push(num + numbef + " " + st2 + middle + en2 + "\n");
									break;
							}
						} catch (err) {
							if (debug === 0) console.log(err);
						}

						list4 = list2.join("");
					}

					_this.storeValue(list4, storage, varName2, cache);
					_this.callNextAction(cache);
				} catch (err) {
					if (debug === 0) console.log(err);
				}
			}
		}
	},

	mod: function() {}
};

module.exports = {
  name: 'Classificar lista',
  section: 'Lists and Loops',
  short_description: 'Classifica uma lista',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data) {
    const list = ['', 'Temporal Variable', 'Server Variable', 'Global Variable'];
    const classic = [
      'Ascending order [0-9]',
      'Descending order [9-0]',
      'Alphabetical order [A-Z]',
      'Reverse alphabetical order [Z-A]',
      'Length [ascending order]',
      'Length [descending order]',
    ];
    return `(${classic[parseInt(data.sorte, 10)]}) ${list[parseInt(data.list, 10)]} (${data.varName}) to ${
      list[parseInt(data.storage, 10)]
    } (${data.varName2})`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, 'List'];
  },

  fields: ['list', 'varName', 'storage', 'varName2', 'sorte'],

  html(isEvent, data) {
    return `
	
	<div>
		<div style="float: left; width: 35%;">
		<span class="dbminputlabel">List source:</span><br>
			<select id="list" class="round" onchange="glob.refreshVariableList(this)">
				${data.variables[1]}
			</select><br>
		</div>
		<div id="varNameContainer" style=" float: right; width: 60%;">
		<span class="dbminputlabel">Variable name:</span><br>
			<input id="varName" class="round" type="text" list="variableList"><br>
		</div><br><br><br>
		<div style=" float: right; width: 100%;">
		<span class="dbminputlabel">Sort list:</span><br>
			<select id="sorte" class="round" style="width: 100%;">
			<option value="0" selected>Sort numbers in ascending order [0-9]</option>
			<option value="1">Sort numbers in descending order [9-0]</option>
				<option value="2">Sort alphabetically [A-Z]</option>
				<option value="3">Sort by reverse alphabetical order [Z-A]</option>
				<option value="4">Sort by length [ascending order]</option>
				<option value="5">Sort by length [descending order]</option>
			</select>
		</div>
	</div><br><br><br><br>
	<div>
		<div style="float: left; width: 35%;">
		<span class="dbminputlabel">Store in:</span><br>
			<select id="storage" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer2" style="float: right; width: 60%;">
		<span class="dbminputlabel">Variable name:</span><br>
			<input id="varName2" class="round" type="text">
		</div>
	</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.refreshVariableList(document.getElementById('list'));
  },

  action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const list = this.getVariable(storage, varName, cache);
    const sorte = parseInt(data.sorte, 10);

    let result;

    switch (sorte) {
      case 0:
        result = list.sort((a, b) => a - b);
        break;
      case 1:
        result = list.sort((a, b) => b - a);
        break;
      case 2:
        result = list.sort();
        break;
      case 3:
        result = list.sort().reverse();
        break;
      case 4:
        result = list.sort(function (a, b) {
          return a.length - b.length;
        });
        break;
      case 5:
        result = list.sort(function (a, b) {
          return b.length - a.length;
        });
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
    }

    this.callNextAction(cache);
  },

  mod() {},
};

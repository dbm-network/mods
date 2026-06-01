module.exports = {
  name: 'Search a list item',
  section: 'Lists and Loops',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data) {
    const info = [
      'exactly equal to',
      'include',
      'matches regex',
      'less than',
      'less than or equal to',
      'greater than',
      'greater than or equal to',
      'length greater than',
      'length less than',
      'length equal to',
      'begins with',
      'ends with',
    ];
    return `Search ${info[parseInt(data.fetchedxin, 10)]} "${data.item}" in "${data.varName}"`;
  },

  variableStorage(data, varType) {
    const prse2 = parseInt(data.fetchedxin, 10);
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, 'Number'[prse2]];
  },

  fields: ['list', 'varName', 'fetchedxin', 'item', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
<div style="float: left; width: 35%;">
<span class="dbminputlabel">List source:</span><br>
  <select id="list" class="round" onchange="glob.listChange(this, 'varNameContainer')">
    ${data.lists[isEvent ? 1 : 0]}
  </select>
</div>
<div id="varNameContainer" style="display: none; float: right; width: 60%;">
<span class="dbminputlabel">Variable name:</span><br>
  <input id="varName" class="round" type="text" list="variableList"><br>
</div>
</div><br><br><br>
<div style="padding-top: 8px; width: 100%;">
<span class="dbminputlabel">Search:</span><br>
		   <select id="fetchedxin" class="round">
		 <option value="0" selected>Exactly equal to</option>
		 <option value="1">That includes</option>
         <option value="2">Matches Regex</option>
         <option value="7">Length is greater than</option>
         <option value="8">Length is less than</option>
         <option value="9">Length is equal to</option>
         <option value="10">Starts with</option>
         <option value="11">Ends with</option>
         <option value="3">Less than [Requires only numbers in list]</option>
         <option value="4">Less than or equal to [Requires only numbers in list]</option>
         <option value="5">Greater than [Requires only numbers in list]</option>
         <option value="6">Greater than or equal to [Requires only numbers in list]</option>
			</select>
		</div>
<div style="padding-top: 8px;">
    <textarea id="item" rows="4" placeholder="Enter a variable or some text. Those '' are not necessary!" style="width: 100%; font-family: monospace; white-space: nowrap;"></textarea>
</div><br>
<div style="padding-top: 8px;">
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
</div><br><br><br>
<div><p>This action searches for an item in a list and returns the position.<br>
Note that every list in JavaScript starts at 0<br>
If not found, it will always return -1</p></div>`;
  },

  init() {
    const { glob, document } = this;

    glob.onChange1 = function onChange1(event) {
      const value = parseInt(event.value, 10);
      const dom = document.getElementById('positionHolder');
      if (value < 3) {
        dom.style.display = 'none';
      } else {
        dom.style.display = null;
      }
    };

    glob.listChange(document.getElementById('list'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.list, 10);
    const varName = this.evalMessage(data.varName, cache);
    const list = await this.getList(storage, varName, cache);
    const fetchedxin = parseInt(data.fetchedxin, 10);
    const item = this.evalMessage(data.item, cache);

    let result;

    switch (fetchedxin) {
      case 0:
        result = list.findIndex((i) => i === item);
        break;
      case 1:
        result = list.findIndex((i) => i.includes(item));
        break;
      case 2:
        result = list.findIndex((i) => Boolean(i.match(new RegExp(`^${item}$`, 'i'))));
        break;
      case 3:
        result = list.findIndex((i) => i < item);
        break;
      case 4:
        result = list.findIndex((i) => i <= item);
        break;
      case 5:
        result = list.findIndex((i) => i > item);
        break;
      case 6:
        result = list.findIndex((i) => i >= item);
        break;
      case 7:
        result = list.findIndex((i) => Boolean(i.length > item));
        break;
      case 8:
        result = list.findIndex((i) => Boolean(i.length < item));
        break;
      case 9:
        result = list.findIndex((i) => Boolean(i.length === item));
        break;
      case 10:
        result = list.findIndex((i) => i.startsWith(item));
        break;
      case 11:
        result = list.findIndex((i) => i.endsWith(item));
        break;
    }

    if (result !== undefined) {
      const varName2 = this.evalMessage(data.varName2, cache);
      const storage2 = parseInt(data.storage, 10);
      this.storeValue(result, storage2, varName2, cache);
    }

    this.callNextAction(cache);
  },

  mod() {},
};

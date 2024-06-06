module.exports = {
  name: 'Get List Length MOD',
  section: 'Lists and Loops',

  subtitle(data, presets) {
    const list = presets.lists;
    return `Get ${list[parseInt(data.list, 10)]} Length`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, 'Number'];
  },

  meta: { version: '2.1.7', preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },

  fields: ['list', 'varName', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Source List:<br>
		<select id="list" class="round" onchange="glob.listChange(this, 'varNameContainer')">
			${data.lists[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div>

<br><br><br>

<store-in-variable style="padding-top: 8px;" dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
  },

  init() {
    const { glob, document } = this;
    glob.listChange(document.getElementById('list'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const list = await this.getListFromData(data.list, data.varName, cache);
    const varName2 = this.evalMessage(data.varName2, cache);
    const storage2 = parseInt(data.storage, 10);

    if (Array.isArray(list)) {
      const length = list.length > 0 ? list.length : 'undefined';
      this.storeValue(length, storage2, varName2, cache);
    } else {
      this.storeValue('undefined', storage2, varName2, cache);
    }

    this.callNextAction(cache);
  },

  mod() {},
};

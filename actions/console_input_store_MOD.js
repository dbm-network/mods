module.exports = {
  name: 'Store Console Input Parts',
  section: 'Other Stuff',
  subtitle(data) {
    return `Store part ${data.partIndex} of console input`;
  },
  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Text'];
  },
  fields: ['consoleInputVar', 'separator', 'partIndex', 'storage', 'varName'],
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
  },
  html() {
    return `
<div>
  <div style="float: left; width: 35%;">
    <span class="dbminputlabel">Console Input Variable</span><br>
    <input id="consoleInputVar" class="round" type="text">
  </div>
  <div style="float: right; width: 60%;">
    <span class="dbminputlabel">Separator</span><br>
    <input id="separator" class="round" type="text" value="/">
  </div>
</div>
<br><br><br>
<div>
  <div style="float: left; width: 35%;">
    <span class="dbminputlabel">Part Index</span><br>
    <input id="partIndex" class="round" type="text" value="1">
  </div>
  <div style="float: right; width: 60%;">
    <store-in-variable style="padding-top: 8px;" dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
  </div>
</div>`;
  },
  init() {},
  action(cache) {
    const data = cache.actions[cache.index];
    const consoleInputVar = this.evalMessage(data.consoleInputVar, cache);
    const separator = this.evalMessage(data.separator, cache);
    const partIndex = parseInt(this.evalMessage(data.partIndex, cache), 10) - 1;
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);

    const consoleInput = this.getVariable(1, consoleInputVar, cache);
    if (!consoleInput) {
      this.callNextAction(cache);
      return;
    }

    const parts = consoleInput.split(separator);
    const result = parts[partIndex] ? parts[partIndex].trim() : '';

    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },
  mod() {},
};

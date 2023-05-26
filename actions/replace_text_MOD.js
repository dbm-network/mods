module.exports = {
  name: 'Replace Text',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/replace_text_MOD.js',
  },

  subtitle(data) {
    const info = ['Replace the first result', 'Replace all results'];
    return `${info[data.info]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'String'];
  },

  fields: ['text', 'text2', 'text3', 'info', 'storage', 'varName'],

  html() {
    return `
<div style="padding-top: 8px;">
  <span class="dbminputlabel">Source Text</span>
  <textarea id="text" rows="3" placeholder="Insert source text here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>
<div>
  <div style="float: left; padding-top: 8px; width: 50%;">
    <span class="dbminputlabel">Replace this</span>
    <input id="text2" class="round" type="text">
  </div>
  <div style="float: right; padding-top: 8px; width: 50%;">
    <span class="dbminputlabel">To this</span>
    <input id="text3" class="round" type="text">
  </div>
  <br><br><br><br>
</div>

<div style="width: 40%;">
  <span class="dbminputlabel">Type</span>
<select id="info" class="round">
  <option value="0" selected>Replace the first result</option>
  <option value="1">Replace all results</option>
</select>
</div>
<br>

<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const text = this.evalMessage(data.text, cache);
    const oldValue = this.evalMessage(data.text2, cache);
    const newValue = this.evalMessage(data.text3, cache);
    const info = parseInt(data.info, 10);

    let result;
    switch (info) {
      case 0:
        result = text.replace(oldValue, newValue);
        break;
      case 1:
        result = text.split(oldValue).join(newValue);
        break;
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};

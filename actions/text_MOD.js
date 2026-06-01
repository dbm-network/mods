module.exports = {
  name: 'Text',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data) {
    return `<font color="${data.color}">${data.text}</font>`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'String'];
  },

  fields: ['text', 'color', 'storage', 'varName'],

  html(isEvent, data) {
    return `
    <div style="padding-top: 3px;">
<span class="dbminputlabel">Texto</span>
		  <textarea id="text"rows="6" placeholder="Insert the text here..." style="width: 99%; font-family: monospace; white-space: nowrap;"></textarea>
	  </div>
	  <div><br>
		  <div style="padding-top: 8px;">
      <div style="width: 24%">
      <span class="dbminputlabel">Color</span><br><input type="color" class="round" id="color">
      </div><br>
		  <div style="float: left; width: 35%;">
		  <span class="dbminputlabel">Store in</span><br>
			  <select id="storage" class="round">
				  ${data.variables[1]}
			  </select>
		  </div>
		  <div id="varNameContainer" style="float: right; width: 60%;">
      <span class="dbminputlabel">Variable name</span><br>
			  <input id="varName" class="round" type="text">
		  </div>
	  </div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const text = this.evalMessage(data.text, cache);

    if (text !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(text, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};

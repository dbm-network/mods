module.exports = {
  name: 'Create Animated Emoji',
  section: 'Emoji Control',
  meta: {
    version: '2.1.1',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/create_animated_emoji_MOD.js',
  },

  subtitle(data) {
    return `${data.emojiName}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName2, 'Animated Emoji'];
  },

  fields: ['emojiName', 'storage', 'varName', 'storage2', 'varName2'],

  html(_isEvent, data) {
    return `
<div style="width: 90%;">
  Animated Emoji Name:<br>
  <input id="emojiName" class="round" type="text">
</div><br>
<div>
  <div style="float: left; width: 35%;">
    Source GIF:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage2" class="round" onchange="glob.onChange1(this)">
      ${data.variables[0]}
    </select>
  </div>
  <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text">
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.onChange1 = function onChange1(event) {
      const value = parseInt(event.value, 10);
      const varNameInput = document.getElementById('varNameContainer2');
      if (value === 0) {
        varNameInput.style.display = 'none';
      } else {
        varNameInput.style.display = null;
      }
    };

    glob.refreshVariableList(document.getElementById('storage'));
    glob.onChange1(document.getElementById('storage2'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { server } = cache;

    if (!server?.emojis?.create) return this.callNextAction(cache);

    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const gif = this.getVariable(type, varName, cache);
    const name = this.evalMessage(data.emojiName, cache);

    server.emojis
      .create(gif, name)
      .then((emoji) => {
        const varName2 = this.evalMessage(data.varName2, cache);
        const storage = parseInt(data.storage2, 10);
        this.storeValue(emoji, storage, varName2, cache);
        this.callNextAction(cache);
      })
      .catch(this.displayError.bind(this, data, cache));
  },

  mod() {},
};

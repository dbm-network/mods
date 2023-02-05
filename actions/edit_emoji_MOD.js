/* eslint-disable no-unused-vars */
module.exports = {
  name: 'Edit Emoji',
  section: 'Emoji Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/edit_emoji_MOD.js',
  },

  subtitle(data) {
    const emoji = ['You cheater!', 'Temp Variable', 'Server Variable', 'Global Variable'];
    return `${emoji[parseInt(data.storage, 10)]}`;
  },

  fields: ['storage', 'varName', 'emojiName'],

  html(_isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Emoji:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Emoji Name:<br>
  <input id="emojiName" placeholder="Leave blank to not edit!" class="round" type="text">
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.emojiChange(document.getElementById('storage'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const emojiData = {};
    if (data.emojiName) emojiData.name = this.evalMessage(data.emojiName, cache);
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const Mods = this.getMods();
    const emoji = Mods.getEmoji(storage, varName, cache);

    if (Array.isArray(emoji)) {
      this.callListFunc(emoji, 'edit', [emojiData]).then(() => this.callNextAction(cache));
    } else if (emoji && emoji.edit) {
      emoji
        .edit(emojiData)
        .then(() => this.callNextAction(cache))
        .catch(this.displayError.bind(this, data, cache));
    }
  },

  mod() {},
};

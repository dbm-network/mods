module.exports = {
  name: 'Edit Emoji',
  section: 'Emoji Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/edit_emoji_MOD.js',
  },

  subtitle(data, presets) {
    return presets.getVariableText(data.storage, data.varName);
  },

  fields: ['storage', 'varName', 'emojiName'],

  html() {
    return `
<div>
  <store-in-variable dropdownLabel="Source Emoji" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Emoji Name</span>
  <input id="emojiName" placeholder="Leave blank to not edit!" class="round" type="text">
</div>`;
  },

  init() {},

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

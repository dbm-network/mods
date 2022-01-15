module.exports = {
  name: 'Clear reactions from message',
  section: 'Reaction Control',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/remove_message_reactions_MOD.js',
  },

  subtitle() {
    return 'Remove reactions from Message';
  },

  fields: ['storage', 'varName'],

  html(isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Message:<br>
    <select id="storage" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
      ${data.messages[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.messageChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const message = await this.getMessage(storage, varName, cache);

    if (Array.isArray(message)) {
      this.callListFunc(
        message.map((m) => m.reactions),
        'removeAll',
        [],
      ).then(() => {
        this.callNextAction(cache);
      });
    } else if (message?.reactions?.removeAll) {
      message.reactions
        .removeAll()
        .then(() => {
          this.callNextAction(cache);
        })
        .catch(this.displayError.bind(this, data, cache));
    }
    this.callNextAction(cache);
  },

  mod() {},
};

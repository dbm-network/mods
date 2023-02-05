module.exports = {
  name: 'Jump to Action',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/jump_to_action_MOD.js',
  },

  subtitle(data) {
    return `Jump to action ${typeof data.call === 'number' ? '#' : `${data.call}`}`;
  },

  fields: ['call'],

  html() {
    return `
<div>
  <div id="varNameContainer" style="float: left; width: 60%;">
    Jump to Action:<br>
    <input id="call" class="round" type="number">
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const val = parseInt(this.evalMessage(data.call, cache), 10);
    const index = Math.max(val - 1, 0);
    if (cache.actions[index]) {
      cache.index = index - 1;
      this.callNextAction(cache);
    }
  },

  mod() {},
};

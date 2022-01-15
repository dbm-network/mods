module.exports = {
  name: 'Skip Actions',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/skip_actions_MOD.js',
  },

  subtitle(data) {
    return `Skip ${data.count}`;
  },

  fields: ['count'],

  html() {
    return `
<div>
  <div id="varNameContainer" style="float: left; width: 60%;">
    Actions To Skip:<br>
    <input id="count" class="round" type="number">
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];

    const amnt = parseInt(this.evalMessage(data.count, cache), 10);
    const index2 = cache.index + amnt + 1;

    if (cache.actions[index2]) {
      cache.index = index2 - 1;
      this.callNextAction(cache);
    }
  },

  mod() {},
};

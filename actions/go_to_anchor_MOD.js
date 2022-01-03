module.exports = {
  name: 'Go To Action Anchor',
  section: 'Other Stuff',

  meta: {
    version: '2.0.9',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: null,
  },

  subtitle(data) {
    return data.anchorName
      ? `<font color="${data.color}">${data.anchorName}</font>`
      : `Jump to ${
          data.anchorName
            ? `the "<font color="${data.color}">${data.anchorName}</font>" anchor in your command if it exists!`
            : 'an anchor!'
        }`;
  },

  fields: ['anchorName', 'color'],

  html() {
    return `
<span class="dbminputlabel">Action Anchor Name</span>
<input id="anchorName" class="round" type="text">

<br>

<div style="float: left; width: calc(25%);">
<span class="dbminputlabel">Anchor Color</span><br>
<input id="color" class="round" type="color"><br>
</div>`;
  },

  init() {},

  action(cache) {
    const data = cache.actions[cache.index];
    const anchorName = this.evalMessage(data.anchorName, cache);
    cache.goToAnchor(anchorName);
  },

  mod() {},
};

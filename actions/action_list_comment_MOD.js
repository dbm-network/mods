module.exports = {
  name: 'Comment',
  section: 'Other Stuff',
  meta: {
    version: '2.0.9',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: null,
  },

  subtitle(data) {
    return `<font color="${data.color}">${data.comment}</font>`;
  },

  fields: ['comment', 'color'],

  html() {
    return `
<div style="float: left; width: 99%;">
  Text Color:<br>
  <input type="color" id="color"><br>
  Comment To Show: (Supports some HTML Tags)<br>
  <input id="comment" class="round" type="text"><br>
</div>`;
  },

  init() {},

  action(cache) {
    this.callNextAction(cache);
  },

  mod() {},
};

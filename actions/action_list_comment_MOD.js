module.exports = {
  name: 'Comment',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/action_list_comment_MOD.js',
  },

  subtitle(data) {
    return `<font color="${data.color}">${data.comment}</font>`;
  },

  fields: ['comment', 'color'],

  html() {
    return `
<div style="float: left; width: 99%;">
  <span class="dbminputlabel">Text Color</span>
  <input type="color" id="color">
  <br>
  
  <span class="dbminputlabel">Comment To Show: (Supports some HTML Tags)</span>
  <input id="comment" class="round" type="text"><br>
</div>`;
  },

  init() {},

  async action(cache) {
    this.callNextAction(cache);
  },

  mod() {},
};

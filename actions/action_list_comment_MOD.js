module.exports = {
  name: 'Comment',
  section: 'Other Stuff',
  meta: {
    version: '2.2.0',
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
<div style="float: left;">
  <span class="dbminputlabel">Text Color</span><br>
  <input type="color" id="color" style="width: 30%;">
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

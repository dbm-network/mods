import type { Action } from '../typings/globals';

const action: Action<'comment' | 'color'> = {
  name: 'Comment',
  section: 'Other Stuff',
  fields: ['comment', 'color'],

  subtitle(data) {
    return `<font color="${data.color}">${data.comment}</font>`;
  },

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

  action(this, cache) {
    this.callNextAction(cache);
  },

  mod() {},
};

module.exports = action;

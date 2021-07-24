import type { Action, Actions, ActionCache, SubtitleData } from '../typings/globals';

const action: Action = {
  name: 'Comment',
  section: 'Other Stuff',
  fields: ['comment', 'color'],
  subtitle(data: SubtitleData) {
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
  action(this: Actions, cache: ActionCache) {
    this.callNextAction(cache);
  },
  mod() {},
};

module.exports = action;

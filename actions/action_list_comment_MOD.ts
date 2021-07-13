import type { Action, Actions, ActionCache } from '../typings/globals';
interface SubtitleData {
  color: string;
  comment: string;
}

export class CommentAction implements Action {
  static section = 'Other Stuff';
  static fields = ['comment', 'color'];

  static subtitle(data: SubtitleData) {
    return `<font color="${data.color}">${data.comment}</font>`;
  }

  static html() {
    return `
      <div style="float: left; width: 99%;">
        Text Color:<br>
        <input type="color" id="color"><br>
        Comment To Show: (Supports some HTML Tags)<br>
        <input id="comment" class="round" type="text"><br>
      </div>`;
  }

  static init() {}

  static action(this: Actions, cache: ActionCache) {
    this.callNextAction(cache);
  }

  static mod() {}
}

Object.defineProperty(CommentAction, 'name', { value: 'Comment' });

/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { Action, ActionCache, Actions } from '../typings/globals';

interface SubtitleData {
  [key: string]: string;
}

export class CreateAnchor implements Action {
  static fields = ['anchor_id', 'color', 'description'];
  static section = 'Other Stuff';

  static subtitle(data: SubtitleData) {
    return data.description
      ? `<font color="${data.color}">${data.description}</font>`
      : `Create ${
          data.anchor_id
            ? `the "<font color="${data.color}">${data.anchor_id}</font>" anchor at the current position!`
            : 'an anchor!'
        }`;
  }

  static html() {
    return `
<div>
  <p>
    <u>Mod Info:</u><br>
    This mod creates an anchor point for you to jump to without<br>
    having to edit other jumps or skips.
  </p>
</div><br>
<div style="float: left; width: 74%;">
  Anchor ID:<br>
  <input type="text" class="round" id="anchor_id"><br>
</div>
<div style="float: left; width: 24%;">
  Anchor Color:<br>
  <input type="color" id="color"><br>
</div>
<div>
  <div style="float: left; width: 98%;">
    Description:<br>
    <input type="text" class="round" id="description">
  </div>
</div>`;
  }

  static init() {}

  static action(this: Actions, cache: ActionCache) {
    this.callNextAction(cache);
  }

  static mod() {}
}

Object.defineProperty(CreateAnchor, 'name', { value: 'Create Anchor' });

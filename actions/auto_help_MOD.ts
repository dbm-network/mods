import type { Action, ActionCache, Actions } from '../typings/globals';

interface SubtitleData {
  [key: string]: string;
}
export class AutoHelp implements Action {
  static section = 'Other Stuff';
  static fields = ['Category', 'Description', 'Include'];

  static subtitle(data: SubtitleData) {
    return `Included? ${data.Include} | ${data.Category}: ${data.Description}`;
  }

  static html() {
    return `
<div>
  <p>
    <u>Mod Info:</u><br>
    This will add an additional field to your raw data for use in an automatic help command<br>
    <a href="https://www.silversunset.net/paste/raw/230" target="_blank">This RAW DATA</a> is <b>required</b> to use this mod.<br>
  </p>
</div><br>
<div style="float: left; width: 99%;">
  Category:
  <input id="Category" class="round" type="text" style="width:99%"><br>
  Description:
  <textarea id="Description" rows="3" placeholder="Insert description here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea><br>
  Include in Auto Help:
  <select style="width:33%;" id="Include" class="round">
    <option value="Yes">Yes</option>
    <option value="No">No</option>
  </select>
</div>`;
  }

  static init(this: any) {
    const { glob, document } = this;

    glob.sendTargetChange(document.getElementById('Category'), 'varNameContainer');
    glob.sendTargetChange(document.getElementById('Description'), 'varNameContainer');
    glob.sendTargetChange(document.getElementById('Include'), 'varNameContainer');
  }

  static action(this: Actions, cache: ActionCache) {
    this.callNextAction(cache);
  }

  static mod() {}
}

Object.defineProperty(AutoHelp, 'name', { value: 'Auto Help' });

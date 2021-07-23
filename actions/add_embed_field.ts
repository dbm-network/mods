import type { Action, ActionCache, Actions } from '../typings/globals';

interface SubtitleData {
  [key: string]: string;
}

export class AddEmbedFieldAction implements Action {
  static section = 'Embed Message';
  static fields = ['storage', 'varName', 'fieldName', 'message', 'inline'];

  static subtitle(data: SubtitleData) {
    return `${data.fieldName} - ${data.message}`;
  }

  static html(_isEvent: any, data: any) {
    return `
<div><p>This action has been modified by DBM Mods. Use [Title](Link) to mask links here.</p></div><br>
<div>
  <div style="float: left; width: 35%;">
    Source Embed Object:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round varSearcher" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 50%;">
    Field Name:<br>
    <input id="fieldName" placeholder="Optional" class="round" type="text">
  </div>
  <div style="float: left; width: 50%;">
    Display Inline:<br>
    <select id="inline" class="round">
      <option value="true">Yes</option>
      <option value="false" selected>No</option>
    </select>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Field Description:<br>
  <textarea id="message" rows="7.5" placeholder="Insert message here... (Optional)" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`;
  }

  static init() {}

  static action(this: Actions, cache: ActionCache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const embed = this.getVariable(storage, varName, cache);
    const name = this.evalMessage(data.fieldName, cache);
    const message = this.evalMessage(data.message, cache);

    if (embed?.addField) {
      embed.addField(name || '\u200B', message || '\u200B', data.inline);
    }
    this.callNextAction(cache);
  }

  static mod() {}
}

Object.defineProperty(AddEmbedFieldAction, 'name', { value: 'Add Embed Field' });

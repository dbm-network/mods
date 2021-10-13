import type { Message } from 'discord.js';
import type { Action } from '../typings/globals';

const action: Action<'message' | 'storage' | 'varName' | 'varName2'> = {
  name: 'Crosspost Message',
  section: 'Messaging',
  fields: ['message', 'varName', 'storage', 'varName2'],

  subtitle(data) {
    const message = ['Command Message', 'Temp Variable', 'Server Variable', 'Global Variable'];
    return `${message[parseInt(data.message, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, 'Message'];
  },

  html(isEvent, data) {
    return `
<div>
 <div style="float: left; width: 35%;">
  Source Message:<br>
  <select id="message" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
   ${data.messages[isEvent ? 1 : 0]}
  </select>
 </div>
 <div id="varNameContainer" style="display: none; float: right; width: 60%;">
  Variable Name:<br>
  <input id="varName" class="round" type="text" list="variableList"><br>
 </div>
</div><br><br><br>
<div>
 <div style="float: left; width: 35%;">
  Store In:<br>
  <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
   ${data.variables[0]}
  </select>
 </div>
 <div id="varNameContainer2" style="float: right; width: 60%;">
  Variable Name:<br>
  <input id="varName2" class="round" type="text"><br>
 </div>
</div>`;
  },

  init(this: any) {
    const { glob, document } = this;

    glob.sendTargetChange(document.getElementById('message'), 'varNameContainer');
    glob.variableChange(document.getElementById('storage'), 'varNameContainer2');
  },

  action(cache) {
    const data = cache.actions[cache.index];
    const varName = this.evalMessage(data.varName, cache);
    const message = this.getMessage(parseInt(data.message, 10), varName, cache);

    const { version } = this.getDBM().DiscordJS;

    if (version < '12.0.0') throw new Error('You need at least Discord.js version 12.4.0 to use this mod.');

    message
      .crosspost()
      .then((msg: Message) => {
        const varName2 = this.evalMessage(data.varName2, cache);
        const storage = parseInt(data.storage, 10);
        this.storeValue(msg, storage, varName2, cache);
        this.callNextAction(cache);
      })
      .catch(console.error);
  },

  mod() {},
};

module.exports = action;

module.exports = {
  name: 'Send GIF',
  section: 'Image Editing',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/send_gif_MOD.js',
  },

  subtitle(data) {
    const channels = [
      'Same Channel',
      'Command Author',
      'Mentioned User',
      'Mentioned Channel',
      'Default Channel (Top Channel)',
      'Temp Variable',
      'Server Variable',
      'Global Variable',
    ];
    return `${channels[parseInt(data.channel, 10)]} ${data.channel < 5 ? '' : `- ${data.varName2}`}`;
  },

  fields: ['storage', 'varName', 'channel', 'varName2', 'message'],

  html(isEvent, data) {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
<div>
  <div style="float: left; width: 35%;">
    Source GIF:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Send To:<br>
    <select id="channel" class="round" onchange="glob.sendTargetChange(this, 'varNameContainer2')">
      ${data.sendTargets[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Message:<br>
  <textarea id="message" rows="8" placeholder="Insert message here... (optional)" style="width: 508px; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.refreshVariableList(document.getElementById('storage'));
    glob.sendTargetChange(document.getElementById('channel'), 'varNameContainer2');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(storage, varName, cache);

    if (!image) return this.callNextAction(cache);

    const channel = parseInt(data.channel, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    const target = this.getSendTarget(channel, varName2, cache);

    if (Array.isArray(target)) {
      this.callListFunc(target, 'send', [this.evalMessage(data.message, cache), { files: [image] }])
        .then(() => {
          this.callNextAction(cache);
        })
        .catch(this.displayError.bind(this, data, cache));
    } else if (target && target.send) {
      target
        .send(this.evalMessage(data.message, cache), { files: [image] })
        .then(() => {
          this.callNextAction(cache);
        })
        .catch(this.displayError.bind(this, data, cache));
    } else {
      this.callNextAction(cache);
    }
  },

  mod() {},
};

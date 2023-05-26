module.exports = {
  name: 'Send GIF',
  section: 'Image Editing',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/send_gif_MOD.js',
  },

  subtitle(data, presets) {
    return presets.getChannelText(data.channel, data.varName2);
  },

  fields: ['storage', 'varName', 'channel', 'varName2', 'message'],

  html() {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Source GIF" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainer2" variableInputId="varName2"></channel-input>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <span class="dbminputlabel">Message</span>
  <textarea id="message" rows="8" placeholder="Insert message here... (optional)" style="width: 508px; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(storage, varName, cache);

    if (!image) return this.callNextAction(cache);

    const channel = parseInt(data.channel, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    const target = await this.getSendTarget(channel, varName2, cache);
    const content = this.evalMessage(data.message, cache);
    const options = { files: [image] };
    if (content) options.content = content;

    if (Array.isArray(target)) {
      this.callListFunc(target, 'send', [options])
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else if (target?.send) {
      target
        .send(options)
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
  },

  mod() {},
};

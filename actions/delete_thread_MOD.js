module.exports = {
  name: 'Delete Thread',
  section: 'Channel Control',
  subtitle(data, presets) {
    return `Delete Thread: "${presets.getChannelText(data.thread, data.threadVarName)}"`;
  },
  meta: { version: '2.1.7', preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },
  fields: ['thread', 'threadVarName', 'reason'],
  html() {
    return `
<thread-channel-input dropdownLabel="Source Thread" selectId="thread" variableContainerId="varNameContainer" variableInputId="threadVarName"></thread-channel-input>
<br><br><br><br>
<div style="float: right; width: calc(102% - 12px);">
  <span class="dbminputlabel">Reason</span>
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>`;
  },
  init() {},
  async action(cache) {
    const data = cache.actions[cache.index];
    const thread = await this.getChannelFromData(data.thread, data.threadVarName, cache);
    const reason = this.evalMessage(data.reason, cache);
    if (Array.isArray(thread)) {
      this.callListFunc(thread, 'delete', [reason]).then(() => this.callNextAction(cache));
    } else if (thread?.delete) {
      thread
        .delete(reason)
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
  },
  mod() {},
};

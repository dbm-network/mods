module.exports = {
  name: 'Set Server Owner',
  section: 'Server Control',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/set_server_owner_MOD.js',
  },

  subtitle(data, presets) {
    return `${presets.getServerText(data.server, data.varName)} - ${presets.getMemberText(
      data.member,
      data.varName2,
    )} ${data.reason ? `with Reason: <i>${data.reason}<i>` : ''}`;
  },

  fields: ['server', 'varName', 'member', 'varName2', 'reason'],

  html() {
    return `
    <div style="padding-top: 8px;">
      <p>
        <u>Note:</u><br>
        This action will only work if the bot is the current owner of the server.
      </p>
    </div>
    <br>

    <div style="padding-top: 8px;">
      <server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>
    </div>
    <br><br><br>

    <div style="padding-top: 8px;">
      <member-input dropdownLabel="Source Member" selectId="member" variableContainerId="varNameContainer2" variableInputId="varName2"></member-input>
    </div>
    <br><br><br>

    <div style="padding-top: 8px;">
      <span class="dbminputlabel">Reason</span><br>
      <textarea id="reason" rows="2" placeholder="Insert reason here... (optional)"></textarea>
    </div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = await this.getServerFromData(data.server, data.varName, cache);
    const mem = await this.getMemberFromData(data.member, data.varName2, cache);
    const reason = this.evalMessage(data.reason, cache);

    if (Array.isArray(server)) {
      this.callListFunc(server, 'setOwner', [mem]).then(() => {
        this.callNextAction(cache);
      });
    } else if (server && server.setOwner) {
      server
        .setOwner(mem, reason)
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

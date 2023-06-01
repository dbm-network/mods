module.exports = {
  name: 'Check if Emoji Exists',
  section: 'Conditions',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/check_if_emoji_exists_MOD.js',
  },
  fields: ['server', 'varName', 'mode', 'type', 'find', 'branch'],

  subtitle(data, presets) {
    return presets.getConditionsText(data);
  },

  html() {
    return `
    <div id="divValue">
      <server-input dropdownLabel="Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>
      <br><br><br>
    </div>

    <dbm-checkbox id="mode" label="Search All Servers" onchange="glob.change(this)"></dbm-checkbox>
    <br>

    <div>
      <div style="float: left; width: 35%;">
        <span class="dbminputlabel">Search Type</span><br>
        <select id="type" class="round">
          <option value="0" selected>ID</option>
          <option value="1">Name</option>
        </select>
      </div>
      <div style="float: right; width: 60%;">
        <span class="dbminputlabel">Search Value</span><br>
        <input id="find" class="round" type="text">
      </div>
    </div>
    <br><br><br>

    <conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  init() {
    const { glob, document } = this;

    glob.change = function change(event) {
      if (event.value) {
        document.getElementById('divValue').style.display = 'none';
      } else {
        document.getElementById('divValue').style.display = 'block';
      }
    };

    glob.change(document.getElementById('mode'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const find = this.evalMessage(data.find, cache);
    const type = parseInt(data.type, 10);
    let emojis;
    let result;

    if (data.mode) {
      emojis = this.getDBM().Bot.bot.emojis.cache;
    } else {
      const server = await this.getServerFromData(data.server, data.varName, cache);

      if (!server) return this.callNextAction(cache);

      emojis = server.emojis.cache;
    }

    switch (type) {
      case 0:
        result = Boolean(emojis.get(find));
        break;
      case 1:
        result = Boolean(emojis.find((c) => c.name === find));
        break;
    }

    this.executeResults(result, data?.branch ?? data, cache);
  },

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  mod() {},
};

module.exports = {
  name: 'Create Category Channel',
  section: 'Channel Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/create_category_MOD.js',
  },

  subtitle(data) {
    return `${data.channelName}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Channel'];
  },

  fields: ['channelName', 'position', 'storage', 'varName'],

  html() {
    return `
  <div>
    <span class="dbminputlabel">Name</span>
    <input id="channelName" class="round" type="text"><br>
  </div>

<div style="float: left; width: 50%;">
  <span class="dbminputlabel">Position</span>
  <input id="position" class="round" type="text" placeholder="Leave blank for default!" style="width: 90%;"><br>
</div>
<br><br><br><br>

<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const { server } = cache;
    if (!server?.channels?.create) return this.callNextAction(cache);

    const name = this.evalMessage(data.channelName, cache);
    const position = this.evalMessage(data.position, cache);
    const storage = parseInt(data.storage, 10);
    server.channels
      .create(name, { type: 'GUILD_CATEGORY' })
      .then((channel) => {
        channel.setPosition(position);
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(channel, storage, varName, cache);
        this.callNextAction(cache);
      })
      .catch(this.displayError.bind(this, data, cache));
  },

  mod() {},
};

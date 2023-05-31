module.exports = {
  name: 'Store Shard Info',
  section: 'Bot Client Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_shard_info',
  },

  subtitle(data) {
    const info = [
      'Total Count of Servers (in All Shards)',
      'Total Count of Members (in All Shards)',
      "Shard's Ping (On The Current Server)",
      "Shard's ID (On The Current Server)",
      "Total Number of Servers (in Current Server's Shard)",
      "Total Count of Members (in Current Server's Shard)",
      "Total Server's List (On The Current Server's Shard)",
    ];
    return `Shard - ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, 'Number'];
  },

  fields: ['info', 'storage', 'varName2'],

  html() {
    return `
<div style="float: left; width: 80%; padding-top: 8px;">
  <span class="dbminputlabel">Source Info</span>
  <select id="info" class="round">
    <option value="0">Total Count of Servers (in All Shards)</option>
    <option value="1">Total Count of Members (in All Shards)</option>
    <option value="2">Shard's Ping (On The Current Server)</option>
    <option value="3">Shard's ID (On The Current Server)</option>
    <option value="4">Total Number of Servers (in Current Server's Shard)</option>
    <option value="5">Total Count of Members (in Current Server's Shard)</option>
    <option value="6">Total Server's List (On The Current Server's Shard)</option>
  </select>
</div>
<br><br><br>

<div style="float: left; width: 100%; padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const client = this.getDBM().Bot.bot;
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);

    client.shard.fetchClientValues('guilds.cache.size').then((r) => {
      const shardGuildCount = r.reduce((p, c) => p + c, 0);

      client.shard.broadcastEval('this.guilds.cache.reduce((p, g) => p + g.memberCount, 0)').then((r) => {
        const shardMemberCount = r.reduce((p, c) => p + c, 0);

        const shardIDs = client.shard.ids;
        const shardID = Number(shardIDs) + 1;

        if (!client) return this.callNextAction(cache);

        let result;
        switch (info) {
          case 0: // Total Count of Servers in All Shards
            result = shardGuildCount;
            break;
          case 1: // Total Count of Members in All Shards
            result = shardMemberCount;
            break;
          case 2: // Shard's Ping On The Current Server
            result = client.shard.client.ws.ping;
            break;
          case 3: // Shard's ID On The Current Server
            result = shardID;
            break;
          case 4: // Total Count of Servers in Current Server's Shard
            result = client.guilds.cache.size;
            break;
          case 5: // Total Count of Members in Current Server's Shard
            result = client.guilds.cache.array()[0].memberCount;
            break;
          case 6: // Total Server's List On The Current Server's Shard
            result = client.shard.client.guilds.cache.array();
            break;
          default:
            break;
        }

        if (result !== undefined) {
          const storage = parseInt(data.storage, 10);
          const varName2 = this.evalMessage(data.varName2, cache);
          this.storeValue(result, storage, varName2, cache);
        }
        this.callNextAction(cache);
      });
    });
  },

  mod() {},
};

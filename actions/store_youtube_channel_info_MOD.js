module.exports = {
  name: 'Store YouTube Channel Info',
  section: 'Audio Control',

  subtitle: function (data) {
    // Each item corresponds to each switch statement.
    // What user sees when previewing actions box on bottom.
    return 'Store information about a YouTube channel.'
  },

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataType = 'YouTube Channel Info'
    return ([data.varName, dataType])
  },

  fields: ['query', 'info', 'storage', 'varName'],

  html: function (isEvent, data) {
    return `
      <div style="width: 100%;">
        YouTube Channel URL:<br>
        <input id="query" class="round" type="text">
      </div><br>
      <div style="padding-top: 8px; width: 60%;">
        Options:
        <select id="info" class="round">
            <option value="0" selected>Channel ID</option>
        </select>
      </div><br>
      <div style="padding-top: 8px;">
        <div style="float: left; width: 35%;">
          Store In:<br>
          <select id="storage" class="round">
            ${data.variables[1]}
          </select>
        </div>
        <div id="varNameContainer" style="float: right; width: 60%;">
          Variable Name:<br>
          <input id="varName" class="round" type="text">
        </div>
      </div>`
  },

  init: function () {},

  action: async function (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache);
    const INFO = parseInt(data.info);
    const query = this.evalMessage(data.query, cache);
    const Mods = this.getMods()
    const getYoutubeChannelId = Mods.require('get-youtube-channel-id');
    var url = query
    var reezult = false
    reezult = await getYoutubeChannelId(url)
    console.log(reezult);
    if (reezult !== false) {
      if (reezult.error) {
        console.log(`An error occurred, something is wrong with your action.`);
      } else {
        console.log(`Channel ID: ${reezult.id}`);
      }
    } else {
      console.log('Invalid youtube channel URL');
    }

    switch (INFO) {
      case 0:
        result = reezult.id
        break;
    }

    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod: function () {},
};

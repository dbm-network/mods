module.exports = {

  name: 'Store YouTube Channel Info',
  section: 'Audio Control',

  subtitle: function (data) {
    // Each item corresponds to each switch statement.
    const info = ['Item 1', 'Item 2', 'Item 3'];
    // What user sees when previewing actions box on bottom.
    return `Store information about a YouTube channel.`;
  },

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    const dataType = 'YouTube Channel Info';
    return ([data.varName, dataType]);
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
            <option value="1">Channel Name</option>
            <option value="2">Channel Creation Date</option>
            <option value="3">Channel Location</option>
            <option value="4">Channel Description</option>
            <option value="5">Rounded Subscriber Count</option>
            <option value="6">Rounded View Count</option>
            <option value="7">Is Family Friendly?</option>
            <option value="7">Channel Keywords</option>
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
      </div>`;
  },

  init: function () { },
  
  action: async function (cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage);
    const INFO = parseInt(data.info);
    const varName = this.evalMessage(data.varName, cache);
    const query = this.evalMessage(data.query, cache);
    const Mods = this.getMods();
    const url = query
    const reezult = false
    const ytscrape = Mods.require('yt-scraper')
    const testresponse = await ytscrape.channelInfo(url)
	  console.log(testresponse.name)
    switch (INFO) {
      case 0:
        result = reezult.id;
        break;
      case 1:
         result = testresponse.name;
        break;
      case 2:
        result = testresponse.joined;
        break;
      case 3:
        result = testresponse.location;
        break;
      case 4:
        result = testresponse.description
        break;
      case 5:
        result = testresponse.approx.subscribers
        break;
      case 6:
        result = testresponse.approx.views
        break;
      case 7:
        result = testresponse.privacy.familySafe
        break;
      case 7:
        result = testresponse.keywords
        break;
    }

    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod: function (DBM) { },
};

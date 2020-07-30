module.exports = {

  name: 'Store YouTube Channel Info',
  section: 'Audio Control',

  subtitle: (data) {
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
        YouTube Channel Name:<br>
        <input id="query" class="round" type="text">
      </div><br>
      <div style="padding-top: 8px; width: 60%;">
        Options:
        <select id="info" class="round">
            <option value="0" selected>Channel ID</option>
            <option value="1">Channel URL</option>
            <option value="2">Channel Name</option>
            <option value="3">Channel Description</option>
            <option value="4">Video Count</option>
            <option value="5">Total Views Count</option>
            <option value="6">Subscriber Count</option>
            <option value="7">Channel Created at</option>
            <option value="8">Channel Banner</option>
            <option value="9">Channel Icon</option>
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

  init: function () { },

  action: async function (cache) {
    const data = cache.actions[cache.index];
    const Mods = this.getMods()
    const fetch = Mods.require('node-fetch')
    let result = false
    const storage = parseInt(data.storage);
    const INFO = parseInt(data.info);
    const varName = this.evalMessage(data.varName, cache);
    const query = this.evalMessage(data.query, cache);
    let base = "https://yt-scraper.eclipseapis.ga/api/v1/channel?q="
    const url = base + query;
    const final = fetch(url)
    const parse = final.json()
    switch (INFO) {
      case 0:
        result = parse.info.id
        break
      case 1:
         result = parse.info.url
        break
      case 2:
        result = parse.info.title
        break
      case 3:
        result = parse.info.description
        break
      case 4:
        result = parse.info.videoCount
        break
      case 5:
        result = parse.stats.views
        break
      case 6:
        result = parse.stats.subscribers
        break
      case 7:
        result = parse.stats.date
        break
      case 8:
        result = parse.banner
        break
      case 9:
        result = parse.photo_FIXED
        break
    }

    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod: function (DBM) { },
};

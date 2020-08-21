module.exports = {
  name: 'Find Category',
  section: 'Channel Control',

  subtitle (data) {
    const info = ['Category ID', 'Category Name', 'Category Topic']
    return `Find Category by ${info[parseInt(data.info)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Category'])
  },

  fields: ['info', 'find', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 40%;">
    Source Field:<br>
    <select id="info" class="round">
      <option value="0" selected>Category ID</option>
      <option value="1">Category Name</option>
    </select>
  </div>
  <div style="float: right; width: 55%;">
    Search Value:<br>
    <input id="find" class="round" type="text">
  </div>
</div><br><br><br>
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
</div><br><br><br>
<p>You can store and edit a category using the channel actions "Store Channel Info", "Edit Channel" or "Set Channel Permission".</p>

<!-- Don't forget to copy the style below with the html above!
This was made by EliteArtz!-->
<style>
  /* EliteArtz Embed CSS code */
  .embed {
    position: relative;
  }
  .embedinfo {
    background: rgba(46,48,54,.45) fixed;
    border: 1px solid hsla(0,0%,80%,.3);
    padding: 10px;
    margin:0 4px 0 7px;
    border-radius: 0 3px 3px 0;
  }
  embedleftline {
    background-color: #eee;
    width: 4px;
    border-radius: 3px 0 0 3px;
    border: 0;
    height: 100%;
    margin-left: 4px;
    position: absolute;
  }
  span {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }
  span.embed-auth {
    color: rgb(255, 255, 255);

  }
  span.embed-desc {
    color: rgb(128, 128, 128);
  }
  span.wrexlink {
    color: #99b3ff;
    text-decoration:underline;
    cursor:pointer;
  }
  span.wrexlink:hover {
    color:#4676b9;
  }
</style>`
  },

  init () {},

  action (cache) {
    const { server } = cache
    if (!server || !server.channels) {
      this.callNextAction(cache)
      return
    }
    const data = cache.actions[cache.index]
    const info = parseInt(data.info)
    const find = this.evalMessage(data.find, cache)
    const channels = server.channels.cache.filter((s) => s.type === 'category')
    let result
    switch (info) {
      case 0:
        result = channels.get(find)
        break
      case 1:
        result = channels.find((e) => e.name === find)
        break
      default:
        break
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage)
      const varName = this.evalMessage(data.varName, cache)
      this.storeValue(result, storage, varName, cache)
      this.callNextAction(cache)
    } else {
      this.callNextAction(cache)
    }
  },

  mod () {}
}

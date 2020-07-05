module.exports = {
  name: 'Store Category Info',
  section: 'Channel Control',

  subtitle (data) {
    const categories = ['You cheater!', 'Temp Variable', 'Server Variable', 'Global Variable']
    const info = ['Category ID', 'Category Name', 'Category Server', 'Category Position', 'Category Is Manageable?', 'Category Is Deleteable?', 'Category Channel List', 'Category Channel Count', 'Category Text Channel List', 'Category Text Channel Count', 'Category Voice Channel List', 'Category Voice Channel Count']
    return `${categories[parseInt(data.category)]} - ${info[parseInt(data.info)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const info = parseInt(data.info)
    let dataType = 'Unknown Type'
    switch (info) {
      case 0:
        dataType = 'Category ID'
        break
      case 1:
        dataType = 'Text'
        break
      case 2:
        dataType = 'Server'
        break
      case 3:
      case 7:
      case 9:
      case 11:
        dataType = 'Number'
        break
      case 4:
      case 5:
        dataType = 'Boolean'
        break
      case 6:
        dataType = 'Channel List'
        break
      case 8:
        dataType = 'Text Channel List'
        break
      case 10:
        dataType = 'Voice Channel List'
        break
    }
    return ([data.varName2, dataType])
  },

  fields: ['category', 'varName', 'info', 'storage', 'varName2'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Category:<br>
    <select id="category" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div>
  <div style="padding-top: 8px; width: 70%;">
    Source Info:<br>
    <select id="info" class="round">
      <optgroup label="Main">
      <option value="0">Category ID</option>
      <option value="1">Category Name</option>
      <option value="2">Category Server</option>
      <option value="3">Category Position</option>
      <option value="4">Category Is Manageable?</option>
      <option value="5">Category Is Deleteable?</option>
      </optgroup>
      <optgroup label="Channel Infos">
      <option value="6">Category Channel List</option>
      <option value="7">Category Channel Count</option>
      <option value="8">Category Text Channel List</option>
      <option value="9">Category Text Channel Count</option>
      <option value="10">Category Voice Channel List</option>
      <option value="11">Category Voice Channel Count</option>
    </select>
  </div>
</div><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text"><br>
  </div>
</div>
<style>
  div.embed { /* <div class="embed"></div> */
    position: relative;
  }

  embedleftline { /* <embedleftline></embedleftline> OR if you wan't to change the Color: <embedleftline style="background-color: #HEXCODE;"></embedleftline> */
    background-color: #eee;
    width: 4px;
    border-radius: 3px 0 0 3px;
    border: 0;
    height: 100%;
    margin-left: 4px;
    position: absolute;
  }

  div.embedinfo { /* <div class="embedinfo"></div> */
    background: rgba(46,48,54,.45) fixed;
    border: 1px solid hsla(0,0%,80%,.3);
    padding: 10px;
    margin:0 4px 0 7px;
    border-radius: 0 3px 3px 0;
  }

  span.embed-auth { /* <span class="embed-auth"></span> (Title thing) */
    color: rgb(255, 255, 255);
  }

  span.embed-desc { /* <span class="embed-desc"></span> (Description thing) */
    color: rgb(128, 128, 128);
  }

  span { /* Only making the text look, nice! */
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }
</style>`
  },

  init () {
    const { glob, document } = this

    glob.refreshVariableList(document.getElementById('category'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const category = parseInt(data.category)
    const varName = this.evalMessage(data.varName, cache)
    const info = parseInt(data.info)
    const targetCategory = this.getVariable(category, varName, cache)
    if (!targetCategory) {
      this.callNextAction(cache)
      return
    }
    let result
    switch (info) {
      case 0:
        result = targetCategory.id // Category ID
        break
      case 1:
        result = targetCategory.name // Category Name
        break
      case 2:
        result = targetCategory.guild // Category Server
        break
      case 3:
        result = targetCategory.position // Category Position
        break
      case 4:
        result = targetCategory.manageable // Category Is Manageable?
        break
      case 5:
        result = targetCategory.deletable // Category Is Deleteable?
        break
      case 6:
        result = targetCategory.children.array() // Category Channel List
        break
      case 7:
        result = targetCategory.children.size // Category Channel Count
        break
      case 8:
        result = targetCategory.children.filter((c) => ['text', 'news', 'store'].includes(c.type)).array() // Category Text Channel List
        break
      case 9:
        result = targetCategory.children.filter((c) => ['text', 'news', 'store'].includes(c.type)).size // Category Text Channel Count
        break
      case 10:
        result = targetCategory.children.filter((c) => c.type === 'voice').array() // Category Voice Channel List
        break
      case 11:
        result = targetCategory.children.filter((c) => c.type === 'voice').size // Category Voice Channel Count
        break
      default:
        break
    }
    if (result) {
      const storage = parseInt(data.storage)
      const varName2 = this.evalMessage(data.varName2, cache)
      this.storeValue(result, storage, varName2, cache)
    }
    this.callNextAction(cache)
  },

  mod () {}

}

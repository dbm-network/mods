module.exports = {
  name: 'Inspect List/Object',
  section: 'Lists and Loops',

  subtitle (data) {
    const storages = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `Inspect ${storages[parseInt(data.storage)]} "${data.varName}"`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage2)
    if (type !== varType) return
    const dataType = 'Text'
    return ([data.varName2, dataType])
  },

  fields: ['storage', 'varName', 'depth', 'storage2', 'varName2'],

  html (isEvent, data) {
    return `
<div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
  <div>
    <div style="float: left; width: 35%;">
      Source Variable:<br>
      <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
        ${data.variables[1]}
      </select>
    </div>
    <div id="varNameContainer" style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList">
    </div>
  </div><br><br><br>
  <div>
    <div style="float: left; width: 39%; padding-top: 8px;">
      Depth:<br>
      <input id="depth" class="round" type="text" placeholder="Optional">
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage2" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div id="varNameContainer2" style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName2" class="round" type="text"><br>
    </div>
  </div><br><br><br>
  <div>
    <div class="embed" style="width:98%; padding-top: 8px;">
      <embedleftline></embedleftline><div class="embedinfo">
        <span class="embed-auth"><u><b>Sample Result</b></u><br></span><br>
        <span class="embed-desc"><b>Client {<br><b style='color: #b58900'>_events</b>: [<b style='color: #dc322f'>Object</b>],<br><b style='color: #b58900'>_eventsCount</b>: <b style='color: #2a978f'>5</b>,<br><b style='color: #b58900'>_maxListeners</b>: <b style='color: #2a978f'>10</b>,<br><b style='color: #b58900'>options</b>: [<b style='color: #dc322f'>Object</b>],<br><b style='color: #b58900'>rest</b>: [RESTManager],<br><b style='color: #b58900'>dataManager</b>: [ClientDataManager],<br><b style='color: #b58900'>manager</b>: [ClientManager],<br><b style='color: #b58900'>ws</b>: [WebSocketManager],<br><b style='color: #b58900'>resolver</b>: [ClientDataResolver],<br><b style='color: #b58900'>actions</b>: [ActionsManager],<br><b style='color: #b58900'>voice</b>: [ClientVoiceManager],<br><b style='color: #b58900'>shard</b>: <b style='color: #2a978f'>null</b>,<br><b style='color: #b58900'>users</b>: [Collection],<br><b style='color: #b58900'>guilds</b>: [Collection],<br><b style='color: #b58900'>channels</b>: [Collection],<br><b style='color: #b58900'>presences</b>: [Collection],<br><b style='color: #b58900'>user</b>: [ClientUser],<br><b style='color: #b58900'>readyAt</b>: <b style='color: #2a978f'>2019-05-11</b>T11:<b style='color: #2a978f'>30</b>:<b style='color: #2a978f'>47.999</b>Z,<br><b style='color: #b58900'>broadcasts</b>: [],<br><b style='color: #b58900'>pings</b>: [<b style='color: #dc322f'>Array</b>],<br><b style='color: #b58900'>_timeouts</b>: [<b style='color: #dc322f'>Set</b>],<br><b style='color: #b58900'>_intervals</b>: [<b style='color: #dc322f'>Set</b>],<br><b style='color: #b58900'>config</b>: [<b style='color: #dc322f'>Object</b>],<br><b style='color: #b58900'>info</b>: [<b style='color: #dc322f'>Object</b>],<br><b style='color: #b58900'>audio</b>: [<b style='color: #dc322f'>Object</b>],<br><b style='color: #b58900'>warnings</b>: [<b style='color: #dc322f'>Object</b>],<br><b style='color: #b58900'>loadCommands</b>: [<b style='color: #dc322f'>Function</b>],<br><b style='color: #b58900'>commands</b>: [<b style='color: #dc322f'>Map</b>] }<b><br></span>
      </div>
    </div>
  </div><br>
</div>
<style>
  /* Embed CSS code by Mr.Gold */
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
</style>`
  },

  init () {
    const { glob, document } = this

    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
  },

  action (cache) {
    const data = cache.actions[cache.index]

    const Mods = this.getMods()
    const util = Mods.require('util')
    const depth = parseInt(data.depth)
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const variable = this.getVariable(storage, varName, cache)

    if (typeof variable !== 'object') {
      return console.log('Please choose a valid list or object to inspect!')
    }

    try {
      var result = util.inspect(variable, { depth: (depth > 0 ? depth : 0) })
    } catch (error) {
      if (error) {
        console.error(error)
      }
    }

    if (result !== undefined) {
      const storage2 = parseInt(data.storage2)
      const varName2 = this.evalMessage(data.varName2, cache)
      this.storeValue(result, storage2, varName2, cache)
    }
    this.callNextAction(cache)
  },

  mod () {}
}

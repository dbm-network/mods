module.exports = {
  name: 'Set AFK Timeout',
  section: 'Server Control',

  fields: ['server', 'varName', 'serverAfkTime'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Server:<br>
    <select id="server" class="round" onchange="glob.serverChange(this, 'varNameContainer')">
      ${data.servers[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList">
  </div>
</div><br><br><br>
<div style="padding-top: 8px; width: 90%;">
  Timeout:<br>
  <select id="serverAfkTime" class="round">
  <option value="60" selected>1 Minutes</option>
  <option value="300">5 Minutes</option>
  <option value="900">15 Minutes</option>
  <option value="1800">30 Minutes</option>
  <option value="3600">1 Hours</option>
  </select>
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

  span {
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  }
</style>`
  },

  init () {
    const { glob, document } = this

    glob.serverChange(document.getElementById('server'), 'varNameContainer')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const type = parseInt(data.server)
    const varName = this.evalMessage(data.varName, cache)
    const server = this.getServer(type, varName, cache)
    if (Array.isArray(server)) {
      this.callListFunc(server, 'setAFKTimeout', [this.evalMessage(data.serverAfkTime, cache)]).then(() => {
        this.callNextAction(cache)
      })
    } else if (server && server.setAFKTimeout) {
      server.setAFKTimeout(this.evalMessage(data.serverAfkTime, cache)).then(() => {
        this.callNextAction(cache)
      }).catch(this.displayError.bind(this, data, cache))
    } else {
      this.callNextAction(cache)
    }
  },

  subtitle (data) {
    if (data.serverAfkTime === '60') {
      return '1 Minutes'
    } if (data.serverAfkTime === '300') {
      return '5 Minutes'
    } if (data.serverAfkTime === '900') {
      return '15 Minutes'
    } if (data.serverAfkTime === '1800') {
      return '30 Minutes'
    } if (data.serverAfkTime === '3600') {
      return '1 Hours'
    }
    return `${data.serverAfkTime} Seconds`
  },

  mod () {}
}

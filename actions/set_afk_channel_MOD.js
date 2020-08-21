module.exports = {
  name: 'Set AFK Channel',
  section: 'Server Control',

  subtitle (data) {
    const channels = ["Command Author's Voice Ch.", "Mentioned User's Voice Ch.", 'Default Voice Channel', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${channels[parseInt(data.afkchannel)]}`
  },

  fields: ['server', 'varName', 'afkchannel', 'varNameChannel'],

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
<div>
  <div style="float: left; width: 35%;">
    Set AFK Channel To:<br>
    <select id="afkchannel" class="round" onchange="glob.channelChange(this, 'varNameContainerr')">
      ${data.voiceChannels[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainerr" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varNameChannel" class="round" type="text" list="variableList"><br>
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

    glob.serverChange(document.getElementById('server'), 'varNameContainer')
    glob.voiceChannelChange(document.getElementById('afkchannel'), 'varNameContainerr')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const type = parseInt(data.server)
    const afkchannel = parseInt(data.afkchannel)
    const varName2 = this.evalMessage(data.varNameChannel, cache)
    const varName = this.evalMessage(data.varName, cache)
    const server = this.getServer(type, varName, cache)
    const channel = this.getVoiceChannel(afkchannel, varName2, cache)
    if (!channel) {
      this.callNextAction(cache)
      return
    }
    if (Array.isArray(server)) {
      this.callListFunc(server, 'setAFKChannel', channel).then(() => {
        this.callNextAction(cache)
      })
    } else if (server && server.setAFKChannel) {
      server.setAFKChannel(channel).then(() => {
        this.callNextAction(cache)
      }).catch(this.displayError.bind(this, data, cache))
    } else {
      this.callNextAction(cache)
    }
  },

  mod () {}
}

module.exports = {
  name: 'Canvas Send Image',
  section: 'Image Editing',

  subtitle (data) {
    const channels = ['Same Channel', 'Command Author', 'Mentioned User', 'Mentioned Channel', 'Default Channel', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${channels[parseInt(data.channel)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage2)
    if (type !== varType) return
    return ([data.varName3, 'Message'])
  },

  fields: ['storage', 'varName', 'channel', 'varName2', 'message', 'compress', 'spoiler', 'storage2', 'varName3'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Image:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Send To:<br>
    <select id="channel" class="round" onchange="glob.sendTargetChange(this, 'varNameContainer2')">
      ${data.sendTargets[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Message:<br>
  <textarea id="message" rows="2" placeholder="Insert message here..." style="width: 94%"></textarea>
</div><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 44%;">
    Image Spoiler:<br>
    <select id="spoiler" class="round">
      <option value="0" selected>No</option>
      <option value="1">Yes</option>
    </select><br>
  </div>
  <div style="padding-left: 5%; float: left; width: 50%;">
    Compression Level:<br>
    <select id="compress" class="round">
      <option value="0">1</option>
      <option value="1">2</option>
      <option value="2">3</option>
      <option value="3">4</option>
      <option value="4">5</option>
      <option value="5">6</option>
      <option value="6">7</option>
      <option value="7">8</option>
      <option value="8">9</option>
      <option value="9" selected>10</option>
    </select><br>
  </div>
</div><br><br>
<div>
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer3')">
      ${data.variables[0]}
    </select>
  </div>
  <div id="varNameContainer3" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName3" class="round" type="text">
  </div>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.refreshVariableList(document.getElementById('storage'))
    glob.sendTargetChange(document.getElementById('channel'), 'varNameContainer2')
    glob.variableChange(document.getElementById('storage2'), 'varNameContainer3')
  },

  action (cache) {
    const { DiscordJS } = this.getDBM()
    const Canvas = require('canvas')
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const imagedata = this.getVariable(storage, varName, cache)
    if (!imagedata) {
      this.callNextAction(cache)
      return
    }
    const channel = parseInt(data.channel)
    const varName2 = this.evalMessage(data.varName2, cache)
    const target = this.getSendTarget(channel, varName2, cache)
    const compress = parseInt(data.compress)
    const image = new Canvas.Image()
    image.src = imagedata
    const canvas = Canvas.createCanvas(image.width, image.height)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(image, 0, 0, image.width, image.height)
    const name = `${parseInt(data.spoiler) === 1 ? 'SPOILER_' : ''}image.png`
    const buffer = canvas.toBuffer('image/png', { compressionLevel: compress })
    const attachment = new DiscordJS.MessageAttachment(buffer, name)
    if (target && target.send) {
      target.send(this.evalMessage(data.message, cache), attachment)
        .then((msgobject) => {
          const varName3 = this.evalMessage(data.varName3, cache)
          const storage2 = parseInt(data.storage2)
          this.storeValue(msgobject, storage2, varName3, cache)
          this.callNextAction(cache)
        })
    } else {
      this.callNextAction(cache)
    }
  },

  mod () {}
}

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
    return ([data.varName3, 'Message Object'])
  },

  fields: ['storage', 'varName', 'channel', 'varName2', 'sendOrReply', 'pingingAuthor', 'replyingMessage', 'replyingVarName', 'message', 'spoiler', 'storage2', 'varName3', 'imgName'],

  html (isEvent, data) {
    return `
  <div style="width: 550px; height: 350px; overflow-y: scroll;">
    <div>
      <div style="float: left; width: 35%;">
        Source Image:<br>
        <select id="storage" class="round">
          ${data.variables[1]}
        </select>
      </div>
      <div style="float: right; width: 60%;">
        Variable Name:<br>
        <input id="varName" class="round" type="text" list="variableList"><br>
      </div>
    </div><br><br><br>
    <div style="padding-top: 8px;">
      <div style="float: left; width: 35%;">
        Send To:<br>
        <select id="channel" class="round" onchange="glob.sendTargetChange(this, 'varNameContainer')">
          ${data.sendTargets[isEvent ? 1 : 0]}
        </select>
      </div>
      <div id="varNameContainer" style="display: none; float: right; width: 60%;">
        Variable Name:<br>
        <input id="varName2" class="round" type="text" list="variableList"><br>
      </div>
    </div><br><br><br>
    <div style="padding-top: 8px;">
      <div id="sendReply" style="float: left; width: 60%;">
        Action Type:<br>
        <select id="sendOrReply" class="round" onchange="glob.pingAuthor(this)">
          <option value="send" selected>Send</option>
          <option value="reply">Reply</option>
        </select>
      </div>
      <div id="pingAuthor" style="padding-left: 3%; float: left; width: 35%;">
        Ping Author:<br>
        <select id="pingingAuthor" class="round">
          <option value="1" selected>True</option>
          <option value="0">False</option>
        </select>
      </div>
    </div><br><br><br>
    <div id="replyMessage" style="padding-top: 8px;">
      <div style="float: left; width: 35%;">
        Replying Message:<br>
        <select id="replyingMessage" class="round" onchange="glob.messageChange(this, 'replyMsgContainer')">
          ${data.messages[isEvent ? 1 : 0]}
        </select>
      </div>
      <div id="replyMsgContainer" style="display: none; float: right; width: 60%;">
        Variable Name:<br>
        <input id="replyingVarName" class="round" type="text" list="variableList">
      </div><br><br><br>
    </div>
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
        Image Name (Without extension):<br>
        <input id="imgName" class="round" type="text" value="image"><br>
      </div>
    </div><br><br>
    <div>
      <div style="float: left; width: 35%;">
        Store In:<br>
        <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
          ${data.variables[0]}
        </select>
      </div>
      <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
        Variable Name:<br>
        <input id="varName3" class="round" type="text">
      </div>
    </div>
  </div>`
  },

  init () {
    const { glob, document } = this
    const pingAuthor = document.getElementById('pingAuthor')
    const replyMessage = document.getElementById('replyMessage')
    const sendOrReply = document.getElementById('sendOrReply')

    glob.checkDJS = function () {
      const { version } = require('discord.js')
      if (version.startsWith('12')) {
        const options = sendOrReply.getElementsByTagName('option')
        options[1].disabled = true
      }
    }
    glob.checkDJS()

    glob.pingAuthor = function (select) {
      if (select.value === 'send') {
        pingAuthor.style.display = 'none'
        replyMessage.style.display = 'none'
      } else {
        pingAuthor.style.display = null
        replyMessage.style.display = null
      }
    }
    glob.pingAuthor(sendOrReply)

    glob.variableChange(document.getElementById('storage2'), 'varNameContainer2')
    glob.messageChange(document.getElementById('replyingMessage'), 'replyMsgContainer')
    glob.variableChange(document.getElementById('storage2'), 'varNameContainer2')
  },

  async action (cache) {
    const data = cache.actions[cache.index]
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const sourceImage = this.getVariable(storage, varName, cache)
    if (!sourceImage) {
      this.Canvas.onError(data, cache, 'Image not exist!')
      this.callNextAction(cache)
      return
    }
    const content = this.evalMessage(data.message, cache)
    const channel = parseInt(data.channel)
    const varName2 = this.evalMessage(data.varName2, cache)
    const targetChannel = this.getSendTarget(channel, varName2, cache)
    let name = this.evalMessage(data.imgName, cache)
    if (sourceImage.animated) {
      name += '.gif'
    } else {
      name += '.png'
    }
    if (parseInt(data.spoiler) === 1) name = `SPOILER_${name}`
    try {
      const attachment = await this.Canvas.toAttachment(sourceImage, name)
      let message
      if (this.getDBM().DiscordJS.version.startsWith('12')) data.sendOrReply = 'send'
      if (data.sendOrReply === 'send') {
        if (targetChannel && targetChannel.send) message = await targetChannel.send(content === '' ? '' : content, attachment)
      } else if (data.sendOrReply === 'reply') {
        const msg = parseInt(data.replyingMessage)
        const varName2 = this.evalMessage(data.replyingVarName, cache)
        const replyMessage = this.getMessage(msg, varName2, cache)
        const messageOptions = { files: [attachment] }
        if (!parseInt(data.pingingAuthor)) messageOptions.allowedMentions = { repliedUser: false }
        if (targetChannel && replyMessage && replyMessage.reply) {
          if (replyMessage.channel.id === targetChannel.id) {
            message = await replyMessage.reply(content === '' ? '' : content, messageOptions)
          } else {
            this.Canvas.onError(data, cache, 'Reply message must be same channel as the target channel!')
          }
        }
      }
      if (message) {
        const storage2 = parseInt(data.storage2)
        if (storage2 !== 0) {
          const varName3 = this.evalMessage(data.varName3, cache)
          this.storeValue(message, storage2, varName3, cache)
        }
      }
      this.callNextAction(cache)
    } catch (err) {
      this.Canvas.onError(data, cache, err)
    }
  },

  mod (DBM) {
    DBM.Actions.Canvas.toBuffer = function (sourceImage) {
      const image = this.loadImage(sourceImage)
      if (sourceImage.animated) {
        const fs = require('fs')
        const path = require('path')
        const temp = fs.mkdtempSync(require('os').tmpdir() + path.sep)
        const canvas = this.CanvasJS.createCanvas(sourceImage.width, sourceImage.height)
        const ctx = canvas.getContext('2d')
        const frameLength = sourceImage.totalFrames.toString().length
        for (let i = 0; i < image.length; i++) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
          ctx.drawImage(image[i], 0, 0)
          const buffer = canvas.toBuffer('image/png', { compressionLevel: 9 })
          let frameName = i.toString()
          while (frameName.length !== frameLength) frameName = '0' + frameName
          fs.writeFileSync(`${temp}${path.sep}image_${frameName}.png`, buffer)
        }
        require('child_process').execSync(`"${this.dependencies.gifski}" --quiet ${(sourceImage.loop !== 0) ? '--once ' : ''}--fps ${Math.round(1000 / sourceImage.delay)} -o "${temp}${path.sep}temp.gif" "${temp}${path.sep}image_"*.png`)
        const buffer = fs.readFileSync(`${temp}${path.sep}temp.gif`)
        fs.rmdirSync(temp, { recursive: true })
        return buffer
      } else {
        const canvas = this.CanvasJS.createCanvas(image.width, image.height)
        const ctx = canvas.getContext('2d')
        ctx.drawImage(image, 0, 0)
        const buffer = canvas.toBuffer('image/png', { compressionLevel: 9 })
        return buffer
      }
    }

    DBM.Actions.Canvas.toAttachment = function (sourceImage, name) {
      const buffer = this.toBuffer(sourceImage)
      let possibleExt = '.png'
      if (sourceImage.animated) possibleExt = '.gif'
      const parse = require('path').parse(name)
      if (parse.ext === '') {
        name += possibleExt
      } else if (parse.ext !== possibleExt) {
        name = parse.name + possibleExt
      }
      const attachment = new DBM.DiscordJS.MessageAttachment(buffer, name)
      return attachment
    }
  }
}

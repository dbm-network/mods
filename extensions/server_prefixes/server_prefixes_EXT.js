module.exports = {
  name: 'Server Prefixes',
  isCommandExtension: false,
  isEventExtension: false,
  isEditorExtension: true,

  fields: [],

  defaultFields: {},

  size () {
    return { width: 500, height: 140 }
  },

  html (data) {
    return `
<div style="float: left; width: 99%; margin-left: auto; margin-right: auto; padding:10px; text-align: center;">
  <h2>Server Prefixes</h2><hr>
  <p>
    Requires <b><a href="#" onclick="require('child_process').execSync('start https://github.com/dbm-network/mods/tree/master/actions')">Control Server Prefix</a></b>
  </p>
</div>`
  },

  init () {},

  close () {},

  load () {},

  save () {},

  mod (DBM) {
    const fs = require('fs')
    const path = require('path')
    const { Bot, Files, Actions } = DBM
    const settingsPath = path.join('data', 'serverSettings.json')

    const loadPrefixes = function () {
      const client = Bot.bot
      if (fs.existsSync(settingsPath)) {
        console.log('Loading server prefixes...')
        fs.readFile(settingsPath, (err, data) => {
          if (err) return console.log(err)
          data = JSON.parse(data)
          client.guilds.cache.forEach(server => {
            server.prefix = data[server.id]
          })
          console.log('Server prefixes loaded')
        })
      } else {
        console.log('Creating server settings file')
        fs.writeFile(settingsPath, JSON.stringify({}), (err) => {
          if (err) console.error(err)
        })
      }
    }

    Bot.checkTag = function (msg) {
      const tag = msg.channel.type === 'dm' ? Files.data.settings.tag : msg.guild.prefix || Files.data.settings.tag
      const separator = Files.data.settings.separator || '\\s+'
      const content = msg.content.split(new RegExp(separator))[0]
      if (content.startsWith(tag)) {
        return content.substring(tag.length)
      }
      return null
    }

    Bot.checkCommand = function (msg) {
      let command = this.checkTag(msg)
      if (command) {
        if (!this._caseSensitive) {
          command = command.toLowerCase()
        }
        const cmd = this.$cmds[command]
        if (cmd) {
          Actions.preformActions(msg, cmd)
          return true
        }
      }
      return false
    }

    const onReady = Bot.onReady
    Bot.onReady = function (...params) {
      loadPrefixes()
      onReady.apply(this, ...params)
    }
  }
}

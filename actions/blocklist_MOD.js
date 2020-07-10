module.exports = {
  name: 'Blacklist Users',
  displayName: 'Blocklist Users',
  section: 'Other Stuff',

  subtitle (data) {
    const info = ['', 'Blocklist User', 'Un-Blocklist User']
    const vars = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `${vars[parseInt(data.storage)]}: ${data.varName} | ${info[parseInt(data.type)]}`
  },

  fields: ['storage', 'varName', 'type'],

  html (isEvent, data) {
    return `
<div>
  <div><br>
    Operation Type:<br>
    <select class="round" id="type">
      <option value="1" selected>Blocklist User</option>
      <option value="2">Un-Blocklist User</option>
    </select><br>
    <div style="float: left; width: 47%">
      User Variable Type:<br><select id="storage" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 47%">
      Variable Name:<br>
      <input class="round" id="varName" />
    </div>
  </div>
</div>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const varName = this.evalMessage(data.varName, cache)
    const storage = parseInt(data.storage)
    const type = parseInt(data.type)
    const user = this.getVariable(storage, varName, cache)
    const { appendFileSync, readFileSync, writeFileSync } = require('fs')
    const file = readFileSync('./data/blacklist.txt', 'utf-8').toString()
    let users
    if (!varName) {
      this.callNextAction(cache)
      return
    }
    switch (type) {
      case 1:
        users = file.split('\n')
        if (!users.includes(user.id)) {
          appendFileSync('./data/blacklist.txt', `${user.id}\n`)
        }
        break
      case 2:
        users = file.split('\n')
        if (users.includes(user.id)) {
          console.log(users)
          console.log(users.filter((x) => x !== user.id))
          writeFileSync('./data/blacklist.txt', users.filter((x) => x !== user.id).join('\n'))
        }
        break
      default:
        console.log("Update your blacklist_MOD.js, the selected option doesn't exist.")
        break
    }
    this.callNextAction(cache)
  },

  mod (DBM) {
    const { existsSync, readFileSync, writeFileSync } = require('fs')
    if (!existsSync('./data/blacklist.txt')) {
      writeFileSync('./data/blacklist.txt', '', (err) => {
        if (err) {
          console.log(err)
        }
      })
    }

    DBM.Bot.checkCommand = function (msg) {
      let command = this.checkTag(msg.content)
      if (command) {
        if (!this._caseSensitive) {
          command = command.toLowerCase()
        }
        const cmd = this.$cmds[command]
        if (cmd) {
          const info = readFileSync('./data/blacklist.txt').toString()
          if (!info.split('\n').includes(msg.author.id)) {
            DBM.Actions.preformActions(msg, cmd)
            return true
          }
          DBM.Bot.bot.emit('blacklistUserUse', msg.member || msg.author, msg)
        }
      }
      return false
    }
  }
}

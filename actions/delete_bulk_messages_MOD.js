module.exports = {
  name: 'Delete Bulk Messages MOD',
  section: 'Messaging',

  subtitle (data) {
    const channels = ['Same Channel', 'Mentioned Channel', '1st Server Channel', 'Temp Variable', 'Server Variable', 'Global Variable']
    return `Delete ${data.count} messages from ${channels[parseInt(data.channel)] || 'Nothing'}`
  },

  fields: ['channel', 'varName', 'count', 'type', 'option', 'msgid', 'Con0', 'Con1', 'Con2', 'Con3', 'Con4', 'Con5', 'iffalse', 'iffalseVal', 'storage', 'varName2'],

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName2, 'Message List'])
  },

  html (isEvent, data) {
    return `
  <div style="width: 550px; height: 350px; overflow-y: scroll;">
    <div>
      <div style="float: left; width: 35%;">
        Source Channel:<br>
        <select id="channel" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
          ${data.channels[isEvent ? 1 : 0]}
        </select>
      </div>
      <div id="varNameContainer" style="display: none; float: right; width: 60%;">
        Variable Name:<br>
        <input id="varName" class="round" type="text" list="variableList">
      </div>
    </div><br><br><br>
    <div style="padding-top: 8px;">
      <div style="float: left; width: 39%;">
        Amount to Delete:<br>
        <input id="count" class="round" type="text">
      </div>
      <div style="padding-left: 3px; float: left; width: 55%;">
        Delete By:<br>
        <select id="type" class="round" onchange="glob.onChange1(this)">
          <option value="0" selected>Exactly Amount</option>
          <option value="1">Filter</option>
        </select>
      </div>
    </div><br><br><br>
    <div style="padding-top: 8px;">
      <div style="float: left; width: 35%;">
        Delete Message:<br>
        <select id="option" class="round" onchange="glob.onChange2(this)">
          <option value="0" selected>None</option>
          <option value="1">Before The Message ID</option>
          <option value="2">After The Message ID</option>
          <option value="3">Around The Message ID</option>
        </select>
      </div>
      <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
        Message ID:<br>
        <input id="msgid" class="round" type="text">
      </div>
    </div><br><br><br>
    <div style="padding-top: 8px;">
      <div style="float: left; width: 35%;">
        Store Deleted Message List:<br>
        <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer3')">
          ${data.variables[0]}
        </select>
      </div>
      <div id="varNameContainer3" style="display: none; float: right; width: 60%;">
        Variable Name:<br>
        <input id="varName2" class="round" type="text">
      </div>
    </div><br><br><br>
    <div id="filterPlaceHolder" style="display: none; padding-top: 8px;">
      <div style="float: left; width: 40%;">
        Exclude Author Id:<br>
        <input id="Con0" class="round" type="text" placeholder="Leave it blank for None"><br>
      </div>
      <div style="padding-left: 3px; float: left; width: 60%;">
        Include Content:<br>
        <input id="Con3" class="round" type="text" placeholder="Leave it blank for None"><br>
      </div>
    </div>
    <div id="filterPlaceHolder2" style="display: none; padding-top: 8px;">
      <div style="float: left; width: 40%;">
        Include Author Id:<br>
        <input id="Con1" class="round" type="text" placeholder="Leave it blank for None"><br>
      </div>
      <div style="padding-left: 3px; float: left; width: 60%;">
        <a id="link" href='#'>Custom</a>:<br>
        <input id="Con4" class="round" type="text" placeholder="Leave it blank for None"><br>
      </div>
    </div>
    <div id="filterPlaceHolder3" style="display: none; padding-top: 8px;">
      <div style="float: left; width: 35%;">
        Embed Message:<br>
        <select id="Con2" class="round">
          <option value="0" selected>None</option>
          <option value="1">No</option>
          <option value="2">Yes</option>
        </select><br>
      </div>
      <div style=" padding-left: 5%; float: left; width: 60%;">
        Has Attachment:<br>
        <select id="Con5" class="round">
          <option value="0" selected>None</option>
          <option value="1">No</option>
          <option value="2">Yes</option>
        </select><br>
      </div>
    </div>
    <div style="padding-top: 8px;">
      <div style="float: left; width: 35%;">
        If Delete Bulk Messages Fails:<br>
        <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
          <option value="0" selected>Continue Actions</option>
          <option value="1">Stop Action Sequence</option>
          <option value="2">Jump To Action</option>
          <option value="3">Skip Next Actions</option>
          <option value="4">Jump To Anchor</option>
        </select>
      </div>
      <div id="iffalseContainer" style="padding-left: 5%; display: none; float: left; width: 65%;">
        <span id="iffalseName">Action Number</span>:<br>
        <input id="iffalseVal" class="round" type="text">
      </div>
    </div>
  </div>`
  },

  init () {
    const { glob, document } = this
    document.getElementById('link').onclick = function () {
      require('child_process').execSync('start https://gist.github.com/LeonZ2019/336a20a85f8c37e5d9273d0c690040e6')
    }

    glob.onChangeFalse = function (event) {
      switch (parseInt(event.value)) {
        case 0:
        case 1:
          document.getElementById('iffalseContainer').style.display = 'none'
          break
        case 2:
          document.getElementById('iffalseName').innerHTML = 'Action Number'
          document.getElementById('iffalseContainer').style.display = null
          break
        case 3:
          document.getElementById('iffalseName').innerHTML = 'Number of Actions to Skip'
          document.getElementById('iffalseContainer').style.display = null
          break
        case 4:
          document.getElementById('iffalseName').innerHTML = 'Anchor ID'
          document.getElementById('iffalseContainer').style.display = null
          break
      }
    }
    glob.onChange1 = function (type) {
      const value = parseInt(type.value)
      const placeholder = document.getElementById('filterPlaceHolder')
      const placeholder2 = document.getElementById('filterPlaceHolder2')
      const placeholder3 = document.getElementById('filterPlaceHolder3')
      if (value === 0) {
        placeholder.style.display = 'none'
        placeholder2.style.display = 'none'
        placeholder3.style.display = 'none'
      } else {
        placeholder.style.display = null
        placeholder2.style.display = null
        placeholder3.style.display = null
      }
    }
    glob.onChange2 = function (event) {
      const value = parseInt(event.value)
      const varNameInput = document.getElementById('varNameContainer2')
      if (value === 0) {
        varNameInput.style.display = 'none'
      } else {
        varNameInput.style.display = null
      }
    }
    glob.channelChange(document.getElementById('channel'), 'varNameContainer')
    glob.variableChange(document.getElementById('storage'), 'varNameContainer3')
    glob.onChange1(document.getElementById('type'))
    glob.onChange2(document.getElementById('option'))
    glob.onChangeFalse(document.getElementById('iffalse'))
  },

  async action (cache) {
    const data = cache.actions[cache.index]
    const channel = parseInt(data.channel)
    const varName = this.evalMessage(data.varName, cache)
    const source = this.getChannel(channel, varName, cache)
    if (!source) {
      this.displayError(data, cache, 'Channel do not exist!')
      this.callNextAction(cache)
      return
    }
    const options = {}
    const msgid = parseInt(this.evalMessage(data.msgid, cache))
    switch (parseInt(data.option)) {
      case 1:
        options.before = msgid
        break
      case 2:
        options.after = msgid
        break
      case 3:
        options.around = msgid
        break
    }
    options.limit = 100
    const limit = Math.min(parseInt(this.evalMessage(data.count, cache)), 100)
    if (this.dest(source, 'messages', 'fetch')) {
      try {
        const Con0 = this.evalMessage(data.Con0, cache)
        const Con1 = this.evalMessage(data.Con1, cache)
        const Con2 = this.evalMessage(data.Con2, cache)
        const Con3 = this.evalMessage(data.Con3, cache)
        const Con4 = this.evalMessage(data.Con4, cache)
        const Con5 = this.evalMessage(data.Con5, cache)
        const { Collection } = this.getDBM().DiscordJS
        let messagesFound = new Collection()
        let lastId
        let times = 0
        while (times === 0 || (messagesFound && messagesFound.size < limit)) {
          times++
          if (times === 10) throw Error('Looping for 10 times. Stop searching messages.')
          let messages
          if (lastId && (messagesFound.length || messagesFound.size) < limit) {
            options.before = lastId
            messages = await source.messages.fetch(options)
          } else {
            messages = await source.messages.fetch(options)
            lastId = messages.lastKey()
          }
          let filtered = messages
          if (Con0) filtered = filtered.filter((e) => e.author.id !== Con0.replace(/\D/g, ''))
          if (Con1) filtered = (filtered || messages).filter((e) => e.author.id === Con1.replace(/\D/g, ''))
          if (Con2 !== '0') {
            filtered = (filtered || messages).filter(
              (e) => Con2 === '1' ? e.embeds.length === 0 : e.embeds.length !== 0
            )
          }
          if (Con3) filtered = (filtered || messages).filter((e) => e.content.includes(Con3))
          if (Con4) {
            filtered = (filtered || messages).filter(function (message) {
              let result = false
              try {
                // eslint-disable-next-line no-eval
                result = !!eval(Con4)
              } catch {}
              return result
            })
          }
          if (Con5 !== '0') {
            filtered = (filtered || messages).filter(
              (e) => Con5 === '1' ? e.attachments.size === 0 : e.attachments.size !== 0
            )
          }
          messagesFound = messagesFound.concat(filtered)
        }
        if (messagesFound.array) messagesFound = messagesFound.array()
        if (messagesFound.length > limit) {
          messagesFound.splice(limit)
        }
        const deleted = await source.bulkDelete(messagesFound)
        const storage = parseInt(data.storage)
        if (storage !== 0 && deleted) {
          let result = deleted.array ? deleted.array() : deleted
          if (deleted.length === 1) result = deleted[0]
          const varName = this.evalMessage(data.varName2, cache)
          this.storeValue(result, storage, varName, cache)
        }
        this.callNextAction(cache)
      } catch (err) {
        console.error(err)
        if (['You can only bulk delete messages that are under 14 days old.', 'Looping for 10 times. Stop searching messages.'].includes(err.message)) {
          this.executeResults(false, data, cache)
        } else {
          this.displayError(data, cache, err)
        }
      }
    } else {
      this.callNextAction(cache)
    }
  },

  mod () {}
}

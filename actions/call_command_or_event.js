module.exports = {
  name: 'Call Command/Event',
  section: 'Other Stuff',

  subtitle (data) {
    let source
    if (parseInt(data.sourcetype) === 1) {
      source = data.source2.toString()
    } else {
      source = data.source.toString()
    }
    return `Call Command/Event ID "${source}"`
  },

  fields: ['sourcetype', 'source', 'source2', 'type'],

  html (isEvent, data) {
    return `
<div>
  <p>This action has been modified by DBM Mods.</p>
</div>
<div style="float: left; width: 85%; padding-top: 20px;">
  Source Type:<br>
  <select id="sourcetype" class="round" onchange="glob.onChange1(this)">
    <option value="0" selected>Choose from List</option>
    <option value="1">Insert an ID</option>
  </select>
</div>
<div id="info1"; style="float: left; width: 85%; padding-top: 20px; display: none;">
  Command/Event:<br>
  <select id="source" class="round">
    <optgroup id="commands" label="Commands"></optgroup>
    <optgroup id="events" label="Events"></optgroup>
  </select>
</div>
<div id="info2" style="float: left; width: 94.5%; padding-top: 20px;">
  Command/Event ID:<br>
  <input id="source2" class="round" type="text" placeholder="Insert a Command/Event ID...">
</div>
<div style="float: left; width: 85%; padding-top: 20px;">
  Call Type:<br>
  <select id="type" class="round">
  <option value="true" selected>Synchronous</option>
  <option value="false">Asynchronous</option>
  </select>
</div>`
  },

  init () {
    const { glob, document } = this

    const { $cmds } = glob
    const coms = document.getElementById('commands')
    coms.innerHTML = ''
    for (let i = 0; i < $cmds.length; i++) {
      if ($cmds[i]) {
        coms.innerHTML += `<option value="${$cmds[i]._id}">${$cmds[i].name}</option>\n`
      }
    }

    const { $evts } = glob
    const evet = document.getElementById('events')
    evet.innerHTML = ''
    for (let i = 0; i < $evts.length; i++) {
      if ($evts[i]) {
        evet.innerHTML += `<option value="${$evts[i]._id}">${$evts[i].name}</option>\n`
      }
    }

    glob.onChange1 = function (event) {
      const sourceType = parseInt(document.getElementById('sourcetype').value)
      const info1 = document.getElementById('info1')
      const info2 = document.getElementById('info2')

      switch (sourceType) {
        case 0:
          info1.style.display = null
          info2.style.display = 'none'
          break
        case 1:
          info1.style.display = 'none'
          info2.style.display = null
          break
      }
    }

    glob.onChange1(document.getElementById('sourcetype'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const { Files } = this.getDBM()

    let id
    if (parseInt(data.sourcetype) === 1) {
      id = this.evalMessage(data.source2, cache)
    } else {
      id = data.source
    }
    if (!id) return console.log('Please insert a Command/Event ID!')

    let actions
    const allData = Files.data.commands.concat(Files.data.events)
    for (let i = 0; i < allData.length; i++) {
      if (allData[i] && allData[i]._id === id) {
        actions = allData[i].actions
        break
      }
    }
    if (!actions) {
      this.callNextAction(cache)
      return
    }

    const act = actions[0]
    if (act && this.exists(act.name)) {
      const cache2 = {
        actions,
        index: 0,
        temp: cache.temp,
        server: cache.server,
        msg: (cache.msg || null)
      }
      if (data.type === 'true') {
        cache2.callback = function () {
          this.callNextAction(cache)
        }.bind(this)
        this[act.name](cache2)
      } else {
        this[act.name](cache2)
        this.callNextAction(cache)
      }
    } else {
      this.callNextAction(cache)
    }
  },

  mod () {}
}

module.exports = {
  name: 'Store Data List MOD',
  section: 'Other Stuff',

  subtitle (data) {
    const files = ['players.json', 'servers.json']
    return `${files[parseInt(data.File)]} - ${(data.dataName)}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const resultInfo = parseInt(data.resultInfo)
    let dataType = 'Unknown Type'
    switch (resultInfo) {
      case 0:
        dataType = 'List'
        break
      case 1:
        dataType = 'Number'
        break
    }
    return ([data.varName, dataType])
  },

  fields: ['File', 'serverType', 'dataName', 'sort', 'numberBoolean', 'resultFormat', 'resultInfo', 'rank', 'resultType', 'resultFrom', 'resultTo', 'varName', 'storage'],

  html (isEvent, data) {
    return `
<div style="width: 550px; height: 350px; overflow-y: scroll;">
  <div>
    <div style="float: left; width: 35%;">
      Data File:<br>
      <select id="File" class="round" onchange="glob.onChange0(this)">
        <option value="0" selected>players.json</option>
        <option value="1">servers.json</option>
      </select>
    </div>
    <div id="Input0" style="padding-left: 5%; display: none; float: left; width: 60%;">
      Store by server type:<br>
      <select id="serverType" class="round">
        <option value="0" selected>Current Server</option>
        <option value="1">All Servers</option>
      </select>
    </div>
  </div><br><br><br>
  <div>
    <div style="float: left; width: 39%;">
      Data Name:<br>
      <input id="dataName" class="round" type="text" placeholder="Must fill in"><br>
    </div>
    <div style="padding-left: 1%; float: left; width: 56%;">
      Sort By:<br>
      <select id="sort" class="round">
        <option value="0" selected>Sort from Descending</option>
        <option value="1">Sort from Ascending</option>
      </select><br>
    </div>
  </div><br>
  <div>
    <div style="float: left; width: 35%;">
      Store Result Info:<br>
      <select id="resultInfo" class="round" onchange="glob.onChange1(this)">
        <option value="0" selected>Results List</option>
        <option value="1">Ranking</option>
      </select><br>
    </div>
    <div id="Result0" style="padding-left: 5%; display: null; float: left; width: 60%;">
      Store Result List:<br>
      <select id="resultType" class="round" onchange="glob.onChange2(this)">
        <option value="0" selected>All Results</option>
        <option value="1">Result From Begin</option>
        <option value="2">Result To End</option>
        <option value="3">Result From Specific</option>
      </select><br>
    </div>
    <div id="Result1" style="padding-left: 5%; display: none; float: left; width: 62%;">
      Store Ranking:<br>
      <input id="rank" class="round" type="text" placeholder="Input Member ID here"><br>
    </div>
  </div><br>
  <div>
    <div id="Input1" style="display: null; float: left; width: 35%;">
      Number Before Start:<br>
      <select id="numberBoolean" class="round">
        <option value="0"selected>No</option>
        <option value="1" >Yes</option>
      </select><br>
    </div>
    <div id="Input2" style="display: null; padding-left: 5%; float: left; width: 65%;">
      Result Format (<a id="link" href='#'>Javascript String</a>):<br>
      <input id="resultFormat" class="round" type="text" placeholder="Name + 'DataName' + DataValue"><br>
    </div>
  </div><br>
  <div>
    <div id="Input3" style="display: none; float: left; width: 50%;">
      Result From:<br>
      <input id="resultFrom" class="round" type="text"><br>
    </div>
    <div id="Input4" style="display: none; float: left; width: 50%;">
      Result To:<br>
      <input id="resultTo" class="round" type="text"><br>
    </div>
  </div>
  <div style="padding-top: 5px;">
    <div style="float: left; width: 35%;">
      Store In:<br>
      <select id="storage" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div style="float: right; width: 61%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text">
    </div>
  </div>
</div>`
  },

  init () {
    const { glob, document } = this
    const Input0 = document.getElementById('Input0')
    const Input1 = document.getElementById('Input1')
    const Input2 = document.getElementById('Input2')
    const Input3 = document.getElementById('Input3')
    const Input4 = document.getElementById('Input4')
    const Result0 = document.getElementById('Result0')
    const Result1 = document.getElementById('Result1')
    const rank = document.getElementById('rank')
    const link = document.getElementById('link')

    link.onclick = function () {
      require('child_process').execSync('start https://gist.github.com/LeonZ2019/72dd92c14fdb29afbc64151003d1d48e')
    }

    glob.onChange0 = function (File) {
      switch (parseInt(File.value)) {
        case 0:
          Input0.style.display = null
          rank.placeholder = 'Input Member ID here'
          break
        case 1:
          Input0.style.display = 'none'
          rank.placeholder = 'Input Server ID here'
          break
      }
    }

    glob.onChange1 = function (resultInfo) {
      switch (parseInt(resultInfo.value)) {
        case 0:
          Result0.style.display = null
          Result1.style.display = 'none'
          Input1.style.display = null
          Input2.style.display = null
          break
        case 1:
          Result0.style.display = 'none'
          Result1.style.display = null
          Input1.style.display = 'none'
          Input2.style.display = 'none'
          Input3.style.display = 'none'
          Input4.style.display = 'none'
          break
      }
    }

    glob.onChange2 = function (resultType) {
      switch (parseInt(resultType.value)) {
        case 0:
          Input3.style.display = 'none'
          Input4.style.display = 'none'
          break
        case 1:
          Input3.style.display = 'none'
          Input4.style.display = null
          Input3.style.width = '0%'
          Input4.style.width = '100%'
          break
        case 2:
          Input3.style.display = null
          Input4.style.display = 'none'
          Input3.style.width = '100%'
          Input4.style.width = '0%'
          break
        case 3:
          Input3.style.display = null
          Input4.style.display = null
          Input3.style.width = '50%'
          Input4.style.width = '50%'
          break
      }
    }

    glob.onChange0(document.getElementById('File'))
    glob.onChange1(document.getElementById('resultInfo'))
    glob.onChange2(document.getElementById('resultType'))
  },

  async action (cache) {
    const Client = this.getDBM().Bot.bot
    const { Files } = this.getDBM()
    const fastsort = require('fast-sort')
    const data = cache.actions[cache.index]
    const File = parseInt(data.File)
    let file
    let serverType
    if (File === 0) {
      serverType = parseInt(data.serverType)
      file = Files.data.players
    } else {
      file = Files.data.servers
    }
    const array0 = []
    let result = []
    const dataName = this.evalMessage(data.dataName, cache)
    const sort = parseInt(data.sort)
    const numberBoolean = parseInt(data.numberBoolean)
    const resultInfo = parseInt(data.resultInfo)
    let resultFormat = String(this.evalMessage(data.resultFormat, cache))
    if (resultInfo === 0) {
      if (!resultFormat) {
        resultFormat = String('Name + " " + DataValue')
      }
    }
    const resultType = parseInt(data.resultType)
    const rank = this.evalMessage(data.rank, cache)
    const storage = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    let name
    for (const id in file) {
      if (file[id][dataName] || !isNaN(file[id][dataName])) {
        switch (File) {
          case 0:
            let object
            switch (serverType) {
              case 0:
                const { server } = cache
                if (server.memberCount !== server.members.cache.size) await server.members.fetch()
                object = server.members.cache.get(id)
                break
              case 1:
                object = Client.users.cache.get(id)
                break
            }
            if (object) {
              name = (object.tag || object.user.tag)
              array0.push({ id: object.id, data: file[id][dataName], name })
            }
            break
          case 1:
            object = Client.guilds.cache.get(id)
            if (object) array0.push({ id: object.id, data: file[id][dataName], name: object.name })
            break
        }
      }
    }
    switch (sort) {
      case 0:
        result = fastsort(array0).desc((u) => parseInt(u.data))
        break
      case 1:
        result = fastsort(array0).asc((u) => parseInt(u.data))
        break
    }
    for (let i = 0; i < result.length; i++) {
      result[i].rank = i + 1
    }
    switch (resultInfo) {
      case 0:
        let array1 = []
        let resultFrom; let
          resultTo
        switch (resultType) {
          case 0:
            resultFrom = 0
            resultTo = result.length
            break
          case 1:
            resultFrom = 0
            resultTo = parseInt(this.evalMessage(data.resultTo, cache))
            break
          case 2:
            resultFrom = parseInt(this.evalMessage(data.resultFrom, cache))
            resultTo = parseInt(this.evalMessage(data.resultTo, cache))
            break
        }
        if (result.length < resultTo || resultFrom >= resultTo) {
          resultTo = result.length
        }
        for (; resultFrom < resultTo; resultFrom++) {
          /* eslint-disable */
          const Name = result[resultFrom].name
          const DataValue = result[resultFrom].data
          let Member
          let User
          /* eslint-enable */
          if (serverType === 0) {
            Member = cache.server.members.cache.get(result[resultFrom].id)
          } else {
            User = Client.users.cache.get(result[resultFrom].id)
          }
          if (numberBoolean === 0) {
            // eslint-disable-next-line no-eval
            array1.push(`${eval(resultFormat)}\n`)
          } else {
            // eslint-disable-next-line no-eval
            array1.push(`${result[resultFrom].rank + eval(resultFormat)}\n`)
          }
        }
        array1 = array1.join('')
        this.storeValue(array1, storage, varName, cache)
        break
      case 1:
        if (rank) {
          const found = result.find((res) => res.id === rank)
          if (found) this.storeValue(found.rank, storage, varName, cache)
        }
        break
    }
    this.callNextAction(cache)
  },

  mod () {}
}

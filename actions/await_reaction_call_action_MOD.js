module.exports = {
  name: 'Await Reaction Call Action',
  section: 'Messaging',

  subtitle (data) {
    return `Await ${data.max} ${data.max === '1' ? 'reaction' : 'reactions'} for ${data.time} ${data.time === '1' ? 'milisecond' : 'miliseconds'}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage2)
    if (type !== varType) return
    return ([data.varName2, 'Reaction List'])
  },

  fields: ['storage', 'varName', 'filter', 'max', 'time', 'maxEmojis', 'maxUsers', 'iftrue', 'iftrueVal', 'iffalse', 'iffalseVal', 'storage2', 'varName2'],

  html (isEvent, data) {
    return `
<div id="wrexdiv2" style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
  <div class="codeblock" style="float: left; width: 88%; padding-top: 8px;">
    <p>
      <span style="color:white"><b>Filters Examples:</b><br><span style="color:#9b9b9b">
      reaction.emoji.name === '😎'<br>
      reaction.emoji.id === '1234567890'<br>
      <br>
      user.id === '1234567890'<br>
      user.name === 'Mr.Gold'<br>
      user.tag === 'Mr.Gold#9003'<br>
      <br>
      <u><span class="wrexlink" data-url="https://www.w3schools.com/js/js_comparisons.asp">JavaScript Comparison and Logical Operators</span></u>
    </p>
  </div><br><br><br><br><br><br><br><br><br><br><br>
  <div>
    <div style="float: left; width: 35%;">
      Source Message:<br>
      <select id="storage" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
        ${data.messages[isEvent ? 1 : 0]}
      </select>
    </div>
    <div id="varNameContainer" style="display: none; float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName" class="round" type="text" list="variableList">
    </div>
  </div><br><br><br>
  <div style="width: 567px; margin-top: 8px;">
    JavaScript Filter Eval: <span style="opacity: 0.5;">(JavaScript Strings)<br>
    <input id="filter" class="round" type="text" value="reaction.emoji.name === '👌' && user.id === 'someID'">
  </div><br>
  <div style="float: left; width: 50%;">
    Max Reactions:<br>
    <input id="max" class="round" type="text" value="1" placeholder="Optional"><br>
  </div>
  <div style="float: left; width: 49%;">
    Max Time (miliseconds):<br>
    <input id="time" class="round" type="text" value="60000" placeholder="Optional"><br>
  </div><br><br><br>
  <div style="float: left; width: 50%;">
    Max Emojis:<br>
    <input id="maxEmojis" class="round" type="text" placeholder="Optional"><br>
  </div>
  <div style="float: left; width: 49%;">
    Max Users:<br>
    <input id="maxUsers" class="round" type="text" placeholder="Optional"><br>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      On Respond:<br>
      <select id="iftrue" class="round" onchange="glob.onChangeTrue(this)">
        <option value="0" selected>Continue Actions</option>
        <option value="1">Stop Action Sequence</option>
        <option value="2">Jump To Action</option>
        <option value="3">Skip Next Actions</option>
        <option value="4">Jump to Anchor</option>
      </select>
    </div>
    <div id="iftrueContainer" style="display: none; float: right; width: 60%;">
      <span id="iftrueName">Action Number</span>:<br><input id="iftrueVal" class="round" type="text">
    </div>
  </div><br><br><br>
  <div style="padding-top: 18px;">
    <div style="float: left; width: 35%;">
      On Timeout:<br>
      <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
        <option value="0">Continue Actions</option>
        <option value="1" selected>Stop Action Sequence</option>
        <option value="2">Jump To Action</option>
        <option value="3">Skip Next Actions</option>
        <option value="4">Jump to Anchor</option>
      </select>
    </div>
    <div id="iffalseContainer" style="display: none; float: right; width: 60%;">
      <span id="iffalseName">Action Number</span>:<br><input id="iffalseVal" class="round" type="text"></div>
    </div><br><br><br>
    <div style="padding-top: 10px;">
      <div style="float: left; width: 35%;">
        Store Reaction List To:<br>
        <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
          ${data.variables[0]}
        </select>
      </div>
      <div id="varNameContainer2" style="display: none; float: right; width: 60%;">
        Variable Name:<br>
        <input id="varName2" class="round" type="text">
      </div>
    </div><br><br><br><br>
  </div>
  <style>
    .codeblock {
      margin: 4px; background-color: rgba(0,0,0,0.20); border-radius: 3.5px; border: 1px solid rgba(255,255,255,0.15); padding: 4px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; transition: border 175ms ease;
    }
    span.wrexlink {
      color: #99b3ff;
      text-decoration:underline;
      cursor:pointer;
    }
    span.wrexlink:hover {
      color:#4676b9;
    }
  </style>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.messageChange(document.getElementById('storage'), 'varNameContainer')

    glob.variableChange(document.getElementById('storage2'), 'varNameContainer2')
    glob.onChangeTrue = function (event) {
      switch (parseInt(event.value)) {
        case 0:
        case 1:
          document.getElementById('iftrueContainer').style.display = 'none'
          break
        case 2:
          document.getElementById('iftrueName').innerHTML = 'Action Number'
          document.getElementById('iftrueContainer').style.display = null
          break
        case 3:
          document.getElementById('iftrueName').innerHTML = 'Number of Actions to Skip'
          document.getElementById('iftrueContainer').style.display = null
          break
        case 4:
          document.getElementById('iftrueName').innerHTML = 'Anchor ID'
          document.getElementById('iftrueContainer').style.display = null
          break
      }
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
    glob.onChangeTrue(document.getElementById('iftrue'))
    glob.onChangeFalse(document.getElementById('iffalse'))

    const wrexlinks = document.getElementsByClassName('wrexlink')
    for (let x = 0; x < wrexlinks.length; x++) {
      const wrexlink = wrexlinks[x]
      var url = wrexlink.getAttribute('data-url')
      if (url) {
        wrexlink.setAttribute('title', url)
        wrexlink.addEventListener('click', (e) => {
          e.stopImmediatePropagation()
          console.log(`Launching URL: [${url}] in your default browser.`)
          require('child_process').execSync(`start ${url}`)
        })
      }
    }
  },

  action (cache) {
    const data = cache.actions[cache.index]

    const message = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const msg = this.getMessage(message, varName, cache)

    const storage = parseInt(data.storage2)
    const varName2 = this.evalMessage(data.varName2, cache)

    if (msg) {
      const js = String(this.evalMessage(data.filter, cache))

      const max = parseInt(this.evalMessage(data.max, cache))
      const maxEmojis = parseInt(this.evalMessage(data.maxEmojis, cache))
      const maxUsers = parseInt(this.evalMessage(data.maxUsers, cache))
      const time = parseInt(this.evalMessage(data.time, cache))

      msg.awaitReactions((reaction, user) => {
        try {
          // eslint-disable-next-line no-eval
          return !!eval(js)
        } catch {
          return false
        }
      }, {
        max,
        maxEmojis,
        maxUsers,
        time,
        errors: ['time']
      })
        .then((collected) => {
          this.storeValue(collected.size === 1 ? collected.first() : collected.array(), storage, varName2, cache)
          this.executeResults(true, data, cache)
        })
        .catch(() => this.executeResults(false, data, cache))
        .catch((err) => console.error(err.stack || err))
    }
  },

  mod () {}
}

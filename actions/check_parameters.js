module.exports = {
  name: 'Check Parameters',
  section: 'Conditions',

  subtitle (data) {
    const results = ['Continue Actions', 'Stop Action Sequence', 'Jump To Action', 'Jump Forward Actions', 'Jump to Anchor']
    return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`
  },

  fields: ['condition', 'comparison', 'value', 'iftrue', 'iftrueVal', 'iffalse', 'iffalseVal'],

  html (isEvent, data) {
    /* eslint-disable no-useless-escape */
    return `
<div>
  <p>This action has been modified by DBM Mods.</p>
  <div style="float: left; width: 45%;">
    Condition:<br>
    <select id="condition" class="round">
      <option value="0" selected>Number of Parameters is...</option>
      <option value="1">Number of Member Mentions are...</option>
      <option value="2">Number of Channel Mentions are...</option>
      <option value="3">Number of Role Mentions are...</option>
    </select>
  </div>
  <div style="padding-left: 5%; float: left; width: 25%;">
    Comparison:<br>
    <select id="comparison" class="round">
      <option value="0" selected>=</option>
      <option value="1">\<</option>
      <option value="2">\></option>
      <option value="3">\>=</option>
      <option value="4">\<=</option>
    </select>
  </div>
  <div style="padding-left: 5%; float: left; width: 25%;">
    Number:<br>
    <input id="value" class="round" type="text">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  ${data.conditions[0]}
</div>`
    /* eslint-enable no-useless-escape */
  },

  init () {
    const { glob, document } = this
    const option = document.createElement('OPTION')
    option.value = '4'
    option.text = 'Jump to Anchor'
    const iffalse = document.getElementById('iffalse')
    if (iffalse.length === 4) {
      iffalse.add(option)
    }
    const option2 = document.createElement('OPTION')
    option2.value = '4'
    option2.text = 'Jump to Anchor'
    const iftrue = document.getElementById('iftrue')
    if (iftrue.length === 4) {
      iftrue.add(option2)
    }
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
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const { msg } = cache
    let result = false
    if (msg && msg.content.length > 0) {
      const condition = parseInt(data.condition)
      let value = 0
      switch (condition) {
        case 0:
          value = msg.content.split(/\s+/).length - 1
          break
        case 1:
          value = msg.mentions.members.array().length
          break
        case 2:
          value = msg.mentions.channels.array().length
          break
        case 3:
          value = msg.mentions.roles.array().length
          break
      }
      const comparison = parseInt(data.comparison)
      const value2 = parseInt(data.value)
      switch (comparison) {
        case 0:
          // eslint-disable-next-line eqeqeq
          result = value == value2
          break
        case 1:
          result = value < value2
          break
        case 2:
          result = value > value2
          break
        case 3:
          result = value >= value2
          break
        case 4:
          result = value <= value2
          break
      }
    }
    this.executeResults(result, data, cache)
  },

  mod () {}
}

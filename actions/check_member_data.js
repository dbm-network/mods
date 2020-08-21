module.exports = {
  name: 'Check Member Data',
  section: 'Data',

  subtitle (data) {
    const results = ['Continue Actions', 'Stop Action Sequence', 'Jump To Action', 'Jump Forward Actions', 'Jump to Anchor']
    return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`
  },

  fields: ['member', 'varName', 'dataName', 'comparison', 'value', 'iftrue', 'iftrueVal', 'iffalse', 'iffalseVal'],

  html (isEvent, data) {
    return `
<div><p>This action has been modified by DBM Mods.</p></div><br>
<div>
  <div style="float: left; width: 35%;">
    Member:<br>
    <select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
      ${data.members[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 50%;">
    Data Name:<br>
    <input id="dataName" class="round" type="text">
  </div>
  <div style="float: left; width: 45%;">
    Comparison Type:<br>
    <select id="comparison" class="round">
      <option value="0">Exists</option>
      <option value="1" selected>Equals</option>
      <option value="2">Equals Exactly</option>
      <option value="3">Less Than</option>
      <option value="4">Greater Than</option>
      <option value="5">Includes</option>
      <option value="6">Matches Regex</option>
      <option value="7">Length is Bigger Than</option>
      <option value="8">Length is Smaller Than</option>
      <option value="9">Length Equals</option>
      <option value="10">Starts With</option>
      <option value="11">Ends With</option>
    </select>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Value to Compare to:<br>
  <input id="value" class="round" type="text" name="is-eval">
</div>
<div style="padding-top: 16px;">
  ${data.conditions[0]}
</div>`
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
    glob.memberChange(document.getElementById('member'), 'varNameContainer')
    glob.onChangeTrue(document.getElementById('iftrue'))
    glob.onChangeFalse(document.getElementById('iffalse'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const type = parseInt(data.member)
    const varName = this.evalMessage(data.varName, cache)
    const member = this.getMember(type, varName, cache)
    let result = false
    if (member && member.data) {
      const dataName = this.evalMessage(data.dataName, cache)
      const val1 = member.data(dataName)
      const compare = parseInt(data.comparison)
      let val2 = this.evalMessage(data.value, cache)
      if (compare !== 6) val2 = this.eval(val2, cache)
      if (val2 === false) val2 = this.evalMessage(data.value, cache)
      switch (compare) {
        case 0:
          result = val1 !== undefined
          break
        case 1:
          // eslint-disable-next-line eqeqeq
          result = val1 == val2
          break
        case 2:
          result = val1 === val2
          break
        case 3:
          result = val1 < val2
          break
        case 4:
          result = val1 > val2
          break
        case 5:
          if (typeof (val1.includes) === 'function') {
            result = val1.includes(val2)
          }
          break
        case 6:
          result = Boolean(val1.match(new RegExp(`^${val2}$`, 'i')))
          break
        case 7:
          result = val1.length > val2
          break
        case 8:
          result = val1.length < val2
          break
        case 9:
          result = val1.length === val2
          break
        case 10:
          result = val1.startsWith(val2)
          break
        case 11:
          result = val1.endsWith(val2)
          break
      }
    }
    this.executeResults(result, data, cache)
  },

  mod () {}
}

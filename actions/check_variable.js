module.exports = {
  name: 'Check Variable',
  section: 'Conditions',

  subtitle (data) {
    const comparisons = ['Exists', 'Equals', 'Equals Exactly', 'Less Than', 'Greater Than', 'Includes', 'Matches Regex', 'Length is Bigger Than', 'Length is Smaller Than', 'Length is Equals', 'Starts With', 'Ends With', 'Matches Full Regex', 'Less Than or Equal to', 'Greater Than or Equal to']
    const results = ['Continue Actions', 'Stop Action Sequence', 'Jump To Action', 'Jump Forward Actions', 'Jump to Anchor']
    return `${comparisons[parseInt(data.comparison)]} | If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`
  },

  fields: ['storage', 'varName', 'comparison', 'value', 'iftrue', 'iftrueVal', 'iffalse', 'iffalseVal'],

  html (isEvent, data) {
    return `
<div><p>This action has been modified by DBM Mods.</p></div><br>
<div>
  <div style="float: left; width: 35%;">
    Source Variable:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Comparison Type:<br>
    <select id="comparison" class="round" onchange="glob.onChange1(this)">
      <option value="0" selected>Exists</option>
      <option value="1">Equals</option>
      <option value="2">Equals Exactly</option>
      <option value="3">Less Than</option>
      <option value="13">Less Than or Equal to</option>
      <option value="4">Greater Than</option>
      <option value="14">Greater Than or Equal to</option>
      <option value="5">Includes</option>
      <option value="6">Matches Regex</option>
      <option value="12">Matches Full Regex</option>
      <option value="7">Length is Bigger Than</option>
      <option value="8">Length is Smaller Than</option>
      <option value="9">Length is Equals</option>
      <option value="10">Starts With</option>
      <option value="11">Ends With</option>
    </select>
  </div>
  <div style="float: right; width: 60%; display: none;" id="directValue">
    Value to Compare to:<br>
    <input id="value" class="round" type="text" name="is-eval" placeholder="">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  ${data.conditions[0]}
</div>`
  },

  init () {
    const { glob, document } = this

    glob.onChange1 = function (event) {
      if (parseInt(event.value) === 0) {
        document.getElementById('directValue').style.display = 'none'
      } else {
        document.getElementById('directValue').style.display = null
      }
      switch (parseInt(event.value)) {
        case 6:
          document.getElementById('value').placeholder = "('My'|'Regex')"
          break
        case 12:
          document.getElementById('value').placeholder = "/('My'|'Regex')\\w+/igm"
          break
        default:
          document.getElementById('value').placeholder = ''
      }
    }

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
    glob.onChange1(document.getElementById('comparison'))
    glob.refreshVariableList(document.getElementById('storage'))
    glob.onChangeTrue(document.getElementById('iftrue'))
    glob.onChangeFalse(document.getElementById('iffalse'))
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const type = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const variable = this.getVariable(type, varName, cache)
    let result = false
    if (variable) {
      const val1 = variable
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
        case 12:
          result = Boolean(val1.match(new RegExp(val2)))
          break
        case 13:
          result = val1 <= val2
          break
        case 14:
          result = val1 >= val2
          break
      }
    }
    this.executeResults(result, data, cache)
  },

  mod (DBM) {
    DBM.Actions.executeResults = function (result, data, cache) {
      const errors = { 404: 'There was not an anchor found with that exact anchor ID!' }
      if (result) {
        const type = parseInt(data.iftrue)
        switch (type) {
          case 0:
            this.callNextAction(cache)
            break
          case 2:
            const val = parseInt(this.evalMessage(data.iftrueVal, cache))
            const index = Math.max(val - 1, 0)
            if (cache.actions[index]) {
              cache.index = index - 1
              this.callNextAction(cache)
            }
            break
          case 3:
            const amnt = parseInt(this.evalMessage(data.iftrueVal, cache))
            const index2 = cache.index + amnt + 1
            if (cache.actions[index2]) {
              cache.index = index2 - 1
              this.callNextAction(cache)
            }
            break
          case 4:
            const id = this.evalMessage(data.iftrueVal, cache)
            const anchorIndex = cache.actions.findIndex((a) => a.name === 'Create Anchor' && a.anchor_id === id)
            if (anchorIndex === -1) throw new Error(errors['404'])
            cache.index = anchorIndex - 1
            this.callNextAction(cache)
            break
          default:
            break
        }
      } else {
        const type = parseInt(data.iffalse)
        switch (type) {
          case 0:
            this.callNextAction(cache)
            break
          case 2:
            const val = parseInt(this.evalMessage(data.iffalseVal, cache))
            const index = Math.max(val - 1, 0)
            if (cache.actions[index]) {
              cache.index = index - 1
              this.callNextAction(cache)
            }
            break
          case 3:
            const amnt = parseInt(this.evalMessage(data.iffalseVal, cache))
            const index2 = cache.index + amnt + 1
            if (cache.actions[index2]) {
              cache.index = index2 - 1
              this.callNextAction(cache)
            }
            break
          case 4:
            const id = this.evalMessage(data.iffalseVal, cache)
            const anchorIndex = cache.actions.findIndex((a) => a.name === 'Create Anchor' && a.anchor_id === id)
            if (anchorIndex === -1) throw new Error(errors['404'])
            cache.index = anchorIndex - 1
            this.callNextAction(cache)
            break
          default:
            break
        }
      }
    }
  }

}

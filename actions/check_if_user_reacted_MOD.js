module.exports = {
  name: 'Check If User Reacted',
  section: 'Conditions',

  subtitle (data) {
    const results = ['Continue Actions', 'Stop Action Sequence', 'Jump To Action', 'Jump Forward Actions', 'Jump to Anchor']
    return `If True: ${results[parseInt(data.iftrue)]} ~ If False: ${results[parseInt(data.iffalse)]}`
  },

  fields: ['member', 'varName', 'reaction', 'varName2', 'iftrue', 'iftrueVal', 'iffalse', 'iffalseVal'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Source Member:<br>
    <select id="member" class="round" onchange="glob.memberChange(this, 'varNameContainer')">
      ${data.members[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br><br>
<div>
  <div style="float: left; width: 35%;">
    Source Reaction:<br>
    <select id="reaction" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer2" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
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
    glob.refreshVariableList(document.getElementById('reaction'))
    glob.onChangeTrue(document.getElementById('iftrue'))
    glob.onChangeFalse(document.getElementById('iffalse'))
  },

  action (cache) {
    const data = cache.actions[cache.index]

    const type = parseInt(data.member)
    const varName = this.evalMessage(data.varName, cache)
    const member = this.getMember(type, varName, cache)

    const type2 = parseInt(data.reaction)
    const varName2 = this.evalMessage(data.varName2, cache)
    const reaction = this.getMods().getReaction(type2, varName2, cache)

    let result
    if (Array.isArray(member)) {
      result = member.every(function (user) {
        if (this.dest(reaction, 'users', 'cache') && user) {
          return reaction.users.cache.has(user.id)
        }
      })
    } else if (this.dest(reaction, 'users', 'cache') && member) {
      result = reaction.users.cache.has(member.id)
    }
    this.executeResults(result, data, cache)
  },

  mod () {}
}

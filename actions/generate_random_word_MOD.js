module.exports = {
  name: 'Generate Random Word(s)',
  section: 'Other Stuff',

  subtitle () {
    return 'Generate Random Word(s)'
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    return ([data.varName, 'Text'])
  },

  fields: ['storage', 'varName', 'min', 'max', 'wps'],

  html (isEvent, data) {
    return `
<div>
  <div style="float: left; width: 45%;">
    Minimum Range:<br>
    <input id="min" class="round" type="text"><br>
  </div>
  <div style="padding-left: 5%; float: left; width: 50%;">
    Maximum Range:<br>
    <input id="max" class="round" type="text"><br>
  </div><br>
  <div style="float: left; width: 45%;">
    Words Per String:<br>
    <input id="wps" class="round" type="text"><br>
  </div><br><br><br>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
</div>`
  },

  init () {},

  action (cache) {
    const Mods = this.getMods()
    const randomWords = Mods.require('random-words')
    const data = cache.actions[cache.index]
    const type = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const wps = parseInt(this.evalMessage(data.wps, cache))
    const min = parseInt(this.evalMessage(data.min, cache))
    const max = parseInt(this.evalMessage(data.max, cache)) + 1
    if (isNaN(min)) {
      console.log(`Error with Generate Random Word(s), Action #${cache.index}: min is not a number`)
      this.callNextAction(cache)
    } else if (isNaN(max)) {
      console.log(`Error with Generate Random Word(s), Action #${cache.index}: max is not a number`)
      this.callNextAction(cache)
    } else if (isNaN(wps)) {
      console.log(`Error with Generate Random Word(s), Action #${cache.index}: Words Per Sentence is not a number`)
      this.callNextAction(cache)
    } else {
      const words = randomWords({ min, max, wordsPerString: wps })
      this.storeValue(words, type, varName, cache)
      this.callNextAction(cache)
    }
  },

  mod () {}
}

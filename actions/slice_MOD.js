module.exports = {
  name: 'Slice',
  section: 'Other Stuff',

  subtitle () {
    return 'Slice anything!'
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataType = 'Sliced Result'
    return ([data.varName, dataType])
  },

  fields: ['slice', 'startingNumber', 'sliceLength', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div>
  Slice Text:<br>
  <textarea id="slice" rows="2" placeholder="Insert message here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div><br>
<div style="float: left; width: 45%; padding-top: 8px;">
  Slice Starting Number:<br>
  <input id="startingNumber" class="round" type="text">
</div>
<div style="float: right; width: 45%; padding-top: 8px;">
  Slice Length:<br>
  <input id="sliceLength" class="round" type="text">
</div><br><br>
<div style="float: left; width: 35%; padding-top: 8px;">
  Store Result In:<br>
  <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
    ${data.variables[0]}
  </select>
</div>
<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
  Variable Name:<br>
  <input id="varName" class="round" type="text">
</div><br><br><br><br>
<div id="RandomText" style="padding-top: 8px;">
  <p>
  example text: you are the best<br>
  If you want to slice <b>you</b>, starting number = 0, slice length = 3.
  </p>
</div>`
  },

  init () {
    const { glob, document } = this

    glob.variableChange(document.getElementById('storage'), 'varNameContainer')
  },

  action (cache) {
    const data = cache.actions[cache.index]
    const type = parseInt(data.storage)
    const varName = this.evalMessage(data.varName, cache)
    const sliceText = this.evalMessage(data.slice, cache)
    const startingFrom = parseInt(this.evalMessage(data.startingNumber, cache))
    const sliceLength = parseInt(this.evalMessage(data.sliceLength, cache))

    if (startingFrom < 0) return console.log('Your number can not be less than 0.')
    if (sliceLength === 0) return console.log('Slice length can not be 0.')
    if (!sliceText) return console.log('Please write something to slice.')
    if (!startingFrom && startingFrom !== 0) return console.log('Please write a starting number.')
    if (!sliceLength) return console.log('Slice length can not be empty')

    const result = `${sliceText}`.slice(`${startingFrom}`, `${sliceLength + startingFrom}`)

    this.storeValue(result, type, varName, cache)
    this.callNextAction(cache)
  },

  mod () {}
}

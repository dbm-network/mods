module.exports = {

  name: 'Store Time Info',
  section: 'Other Stuff',

  subtitle (data) {
    const time = ['Year', 'Month', 'Day of the Month', 'Hour', 'Minute', 'Second', 'Milisecond', 'Month Text'];
    return `${time[parseInt(data.type)]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    let result = 'Number'
    if (data.type === '7') {
      result = 'Text'
    }
    return ([data.varName, result]);
  },

  fields: ['type', 'storage', 'varName'],

  html (isEvent, data) {
    return `
<div>
 <div style='padding-top: 8px; width: 70%;'>
   Time Info:<br>
    <select id='type' class='round'>
      <option value='0' selected>Year</option>
      <option value='1'>Month (Number)</option>
      <option value='7'>Month (Text)</option>
      <option value='2'>Day of the Month</option>
      <option value='3'>Hour</option>
      <option value='4'>Minute</option>
      <option value='5'>Second</option>
      <option value='6'>Milisecond</option>
    </select>
  </div>
</div><br>
<div>
  <div style='float: left; width: 35%;'>
    Store In:<br>
    <select id='storage' class='round'>
      ${data.variables[1]}
    </select>
  </div>
  <div id='varNameContainer' style='float: right; width: 60%;'>
    Variable Name:<br>
    <input id='varName' class='round' type='text'><br>
  </div>
</div>`
  },
  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const type = parseInt(data.type)
    const date = new Date()
    let result
    switch (type) {
      case 0:
        result = date.getFullYear()
        break
      case 1:
        result = date.getMonth() + 1
        break
      case 2:
        result = date.getDate()
        break
      case 3:
        result = date.getHours()
        break
      case 4:
        result = date.getMinutes()
        break
      case 5:
        result = date.getSeconds()
        break
      case 6:
        result = date.getMiliseconds()
        break
      case 7:
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        result = months[(date.getMonth())]
        break
      default:
        break
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage)
      const varName = this.evalMessage(data.varName, cache)
      this.storeValue(result, storage, varName, cache)
    }
    this.callNextAction(cache)
  },
  mod () {}
}

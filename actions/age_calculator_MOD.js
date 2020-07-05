module.exports = {
  name: 'Age Calculator',
  section: 'Other Stuff',

  subtitle (data) {
    const info = ['MM/DD/YYYY', 'DD/MM/YYYY', 'MM/YYYY/DD', 'DD/YYYY/MM', 'YYYY/MM/DD', 'YYYY/DD/MM']
    return `Convert Age from format: ${info[data.info]}`
  },

  variableStorage (data, varType) {
    const type = parseInt(data.storage)
    if (type !== varType) return
    const dataType = 'Number'
    return ([data.varName, dataType])
  },

  fields: ['DOB', 'info', 'storage', 'varName'],

  html (isEvent, data) {
    return `
    <div style="width: 90%;">
      Date Variable or String:<br>
      <input id="DOB" class="round" type="text">
    </div><br>
    <div style="padding-top: 8px; width: 60%;">
      Input Date Format:
      <select id="info" class="round">
          <option value="0" selected>MM/DD/YYYY</option>
          <option value="1">DD/MM/YYYY</option>
          <option value="2">MM/YYYY/DD</option>
          <option value="3">DD/YYYY/MM</option>
          <option value="4">YYYY/MM/DD</option>
          <option value="5">YYYY/DD/MM</option>
      </select>
    </div><br>
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
    const data = cache.actions[cache.index]
    const regex = /(\.)|(-)|(\/)|(\\)|(,)|(:)|(;)|(')|(°)/gi
    const replDOB = this.evalMessage(data.DOB, cache).replace(regex, ' ')
    // ['12', '23', '1990']
    const dateArr = replDOB.split(' ')
    const monthsArr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const INFO = parseInt(data.info)
    let result; let converttoformat; let converttodateformat; let
      calcDOB
    switch (INFO) {
      case 0:
        // MM/DD/YYYY selected format
        // convert to DD/MM/YYYY so calc can work
        // INPUT: ['12', '23', '1990']
        converttoformat = `${dateArr[1]} ${monthsArr[parseInt(dateArr[0]) - 1]} ${dateArr[2]}`
        converttodateformat = new Date(converttoformat)

        calcDOB = parseInt((new Date() - converttodateformat) / 60 / 60 / 24 / 365.242214 / 1000) // Precise num of days in year, not 365 or 365.25

        if (calcDOB < 0) {
          result = 'unborn'
        } else if (calcDOB === 0) {
          result = 'newborn'
        } else {
          result = calcDOB
        }
        break

      case 1:
        // DD/MM/YYYY selected format
        // convert to DD/MM/YYYY so calc can work
        // INPUT: ['12', '23', '1990']
        converttoformat = `${dateArr[0]} ${monthsArr[parseInt(dateArr[1]) - 1]} ${dateArr[2]}`
        converttodateformat = new Date(converttoformat)

        calcDOB = parseInt((new Date() - converttodateformat) / 60 / 60 / 24 / 365.242214 / 1000) // Precise num of days in year, not 365 or 365.25

        if (calcDOB < 0) {
          result = 'unborn'
        } else if (calcDOB === 0) {
          result = 'newborn'
        } else {
          result = calcDOB
        }
        break

      case 2:
        // MM/YYYY/DD selected format
        // convert to DD/MM/YYYY so calc can work
        // INPUT: ['12', '1990', '23']
        converttoformat = `${dateArr[2]} ${monthsArr[parseInt(dateArr[0]) - 1]} ${dateArr[1]}`
        converttodateformat = new Date(converttoformat)

        calcDOB = parseInt((new Date() - converttodateformat) / 60 / 60 / 24 / 365.242214 / 1000) // Precise num of days in year, not 365 or 365.25

        if (calcDOB < 0) {
          result = 'unborn'
        } else if (calcDOB === 0) {
          result = 'newborn'
        } else {
          result = calcDOB
        }
        break
      case 3:
        // DD/YYYY/MM selected format
        // convert to DD/MM/YYYY so calc can work
        // INPUT: ['12', '1990', '23']
        converttoformat = `${dateArr[0]} ${monthsArr[parseInt(dateArr[2]) - 1]} ${dateArr[1]}`
        converttodateformat = new Date(converttoformat)

        calcDOB = parseInt((new Date() - converttodateformat) / 60 / 60 / 24 / 365.242214 / 1000) // Precise num of days in year, not 365 or 365.25

        if (calcDOB < 0) {
          result = 'unborn'
        } else if (calcDOB === 0) {
          result = 'newborn'
        } else {
          result = calcDOB
        }
        break

      case 4:
        // YYYY/MM/DD selected format
        // convert to DD/MM/YYYY so calc can work
        // INPUT: ['1990', '12', '23']
        converttoformat = `${dateArr[2]} ${monthsArr[parseInt(dateArr[1]) - 1]} ${dateArr[0]}`
        converttodateformat = new Date(converttoformat)

        calcDOB = parseInt((new Date() - converttodateformat) / 60 / 60 / 24 / 365.242214 / 1000) // Precise num of days in year, not 365 or 365.25

        if (calcDOB < 0) {
          result = 'unborn'
        } else if (calcDOB === 0) {
          result = 'newborn'
        } else {
          result = calcDOB
        }
        break

      case 5:
        // YYYY/DD/MM selected format
        // convert to DD/MM/YYYY so calc can work
        // INPUT: ['1990', '23', '12']
        converttoformat = `${dateArr[1]} ${monthsArr[parseInt(dateArr[2]) - 1]} ${dateArr[0]}`
        converttodateformat = new Date(converttoformat)

        calcDOB = parseInt((new Date() - converttodateformat) / 60 / 60 / 24 / 365.242214 / 1000) // Precise num of days in year, not 365 or 365.25

        if (calcDOB < 0) {
          result = 'unborn'
        } else if (calcDOB === 0) {
          result = 'newborn'
        } else {
          result = calcDOB
        }
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

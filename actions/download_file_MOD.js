module.exports = {
  name: 'Download File',
  section: 'File Stuff',

  subtitle (data) {
    return `From: ${data.url} to ${data.filePath}/${data.fileName || "download"}.${data.fileFormat || "txt"}`
  },

  fields: ['url', 'fileName', 'fileFormat', 'filePath'],

  html () {
    return `
  <div style="float: left;">
    Web URL:<br>
    <input id="url" class="round" type="text" style="width: 522px" oninput="glob.onInput1(this)"><br>
  </div><br><br><br>
  <div style="float: left;">
    <div style="float: left; width: 60%;">
    File Name:<br>
    <input id="fileName" class="round" type="text" style="width: 400px"><br>
    </div>
    <div style="float: left; width: 35%; padding-left: 100px;">
    File Format:<br>
    <input id="fileFormat" class="round" type="text" style="width: 100px"><br>
    </div>
  </div><br><br><br><br>
  <div style="float: left;">
    File Path:<br>
    <input id="filePath" class="round" type="text" style="width: 522px" value="./downloads"><br>
  </div><br><br><br><br>
<p>
  <u><b><span style="color: white;">NOTE:</span></b></u><br>
  In File Path, "./" represents the path to your bot folder<br>
  File Name and File Format are automatic but you can change them
</p>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]

    let url = this.evalMessage(data.url, cache)
    let fileName = this.evalMessage(data.fileName, cache)
    let fileFormat = this.evalMessage(data.fileFormat, cache)
    const filePath = this.evalMessage(data.filePath, cache)
    const Mods = this.getMods()
    const http = require('https')
    const fs = require('fs')
    const path = require('path')
    const fullFilePath = `${filePath}/${fileName || "download"}.${fileFormat || "txt"}`
    
    // Check/Re-Encode URL
    if (!Mods.checkURL(url)) {
      url = encodeURI(url);
    }
    
    // Check if File Exists, if not, create it.
    if (!fs.existsSync(fullFilePath)) {
      fs.writeFileSync(fullFilePath, '')
    }
    
    // Initiate Write Stream
    let ws = fs.createWriteStream(fullFilePath)
    ws.on('open', (s) => {
      const request = http.get(url, (response) => {
        // Write Data
        response.pipe(ws)
      })
    })
  },

  mod () {}
}

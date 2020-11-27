class FileControl {
  constructor (params) {
    this.name = 'File Control'
    this.section = 'File Stuff'
    this.fields = ['input', 'format', 'filename', 'filepath', 'filetask', 'input2', 'togglestatus']
  }

  subtitle (data) {
    const filetasks = ['Create', 'Write', 'Append into', 'Delete', 'Insert into']
    return `${filetasks[parseInt(data.filetask)]} ${data.filename}${data.format}`
  }

  html () {
    return `
<style>
  ::-webkit-scrollbar {
    width: 10px !important;
  }
  ::-webkit-scrollbar-track {
    background: inherit !important;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #3c4035 !important;
  }
  .col-20l {
    float: left;
    width: 20%;
  }
  .col-17l {
    float: left;
    width: 17%;
  }
  textarea {
    float: left;
    width: 100%;
    resize: 1;
    padding: 4px 8px;
  }
  span.wrexlink {
    color: #99b3ff;
    text-decoration:underline;
    cursor:pointer;
  }
  span.wrexlink:hover {
    color:#4676b9;
  }
  .hidden {
    display: none;
  }
  /* The switch - the box around the slider */
  .switch {
    position: relative;
    display: inline-block;
    width: 40px;
    height: 20px;
  }
  /* Hide default HTML checkbox */
  .switch input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  /* The slider */
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: .4s;
    transition: .4s;
  }
  .slider:before {
    position: absolute;
    content: "";
    height: 20px;
    width: 20px;
    left: 1px;
    bottom: 0px;
    background-color: white;
    -webkit-transition: .4s;
    transition: .4s;
  }
  input:checked + .slider {
    background-color: #2196F3;
  }
  input:focus + .slider {
    box-shadow: 0 0 1px #2196F3;
  }
  input:checked + .slider:before {
    -webkit-transform: translateX(18px);
    -ms-transform: translateX(18px);
    transform: translateX(18px);
  }
  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }
  .slider.round:before {
    border-radius: 50%;
  }
</style>
<div id="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;" onload="showInput()">
  <div style="padding-bottom: 100px; padding: 5px 15px 5px 5px">
    <div style="padding: 5px 10px 5px 5px">
      <div style="display: flex; flex-direction: row;">
        <div class="col-20l" style="display: flex; flex-direction: column; flex: 2; padding-right: 1%;">
          Format:<br>
          <select id="format" class="round">
            <option value="" selected>OTHER</option>
            <option value=".log">LOG</option>
            <option value=".txt">TXT</option>
            <option value=".json">JSON</option>
            <option value=".js">JS</option>
          </select>
        </div>
        <div class="col-17l" style="display: flex; flex-direction: column; flex: 2; padding-right: 1%;">
          Task:<br>
          <select id="filetask" title="99% of the time, you want append" class="round">
            <option value="0" title="Only makes the file">Create</option>
            <option value="1" title="Overwrites the files contents with yours">Write</option>
            <option value="2" title="Add the content to the end of the file" selected>Append</option>
            <option value="4" title="Inserts a line in a specific place in the file">Insert</option>
            <option value="3" title="Deletes a file, Be VERY carefull with this option">Delete</option>
          </select>
        </div>
        <div style="display: flex; flex-direction: column; flex: 8;">
          File Name:<br>
          <textarea id="filename" title="If 'Other' add the file .format to the end of the file name" placeholder="Example file name 'myreallycoollog'" class="round" type="textarea" rows="1"></textarea>
        </div>
      </div>
    </div>
    <div style="padding: 5px 10px 5px 5px">
        <div style="float: left; width: 100%;">
          File Path:<br>
          <textarea class="round col-100" id="filepath" title="./ represents the bots root directory. Use instead of an absolute path > C:/path/to/bot/" placeholder="Example Path = ./logs/date/example-date/" class="round" type="textarea" rows="3"></textarea><br>
        </div>
    </div>
    <div style="padding: 5px 10px 5px 5px">
      <div>
        <span>If you would like to create a directory, leave the filename section empty while setting format to 'OTHER' and task to 'Create'.</span>
      </div>
    </div>
    <div style="padding: 5px 10px 5px 5px">
      <div id="inputArea" class="" style="float: left; width: 100%;">
        Input Text:<br>
        <textarea id="input" placeholder="Leave Blank For None." class="round" type="textarea" rows="10"></textarea><br><br><br><br><br><br><br><br><br><br><br>
      </div>
      <div style="padding: 5px 10px 5px 5px;display: none;" id='visibot'>
        <label class="switch">
          <input onclick="if(checked){value='yes'}else{value='no'}" type="checkbox" id="togglestatus" value='no'>
          <span class="slider round"></span>
        </label>
        <span>Toogle this if your data contains Objects (Json, array, etc...)</span>
      </div>
      <div id="lineInsert" class="" style="float: left; width: 65%;">
        Line to Insert at:<br>
        <input id="input2" placeholder="1 Adds content at the first line." class="round"></input>
      </div>
    </div>
  </div>
</div>`
  }

  init () {
    const { document } = this
    const selector = document.getElementById('filetask')
    const selector2 = document.getElementById('format')
    const targetfield = document.getElementById('inputArea')
    const targetfield2 = document.getElementById('lineInsert')
    var vall = document.getElementById('togglestatus').value
    if (vall === 'yes') {
      document.getElementById('togglestatus').checked = true
    };

    selector.onclick = () => showInput()

    function showInput () {
      const selected = selector[selector.selectedIndex].value
      const selected2 = selector2[selector2.selectedIndex].value
      if (selected2 === '.json') {
        document.getElementById('visibot').style.display = 'block'
      } else {
        document.getElementById('visibot').style.display = 'none'
      }
      if (selected === '0' || selected === '3') { // Hides "Input Text"
        targetfield.classList.add('hidden')
      } else {
        targetfield.classList.remove('hidden')
      }
      if (selected === '0' || selected === '1' || selected === '2' || selected === '3') { // Hides "Line to Insert at"
        targetfield2.classList.add('hidden')
      } else {
        targetfield2.classList.remove('hidden')
      }
    }
  }

  action (cache) {
    const fs = require('fs')
    const path = require('path')
    const Mods = this.getMods()
    const mkdirp = Mods.require('mkdirp')
    const insertLine = Mods.require('insert-line')
    const data = cache.actions[cache.index]
    const dirName = path.normalize(this.evalMessage(data.filepath, cache))
    const fileName = this.evalMessage(data.filename, cache)
    const line = parseInt(this.evalMessage(data.input2, cache))
    const togglestat = data.togglestatus

    const fpath = path.join(dirName, fileName + data.format)
    const task = parseInt(data.filetask)
    const itext = this.evalMessage(data.input, cache)
    const lmg = 'Something went wrong while'
    let result
    switch (task) {
      case 0: // Create File
        result = async () => {
          if (fileName === '') return
          fs.writeFileSync(fpath, '', (err) => {
            if (err) return console.log(`${lmg} creating: [${err}]`)
          })
        }
        break
      case 1: // Write File
        result = () => {
          if (fileName === '') throw new Error('File Name not Provided:')
          if (togglestat === 'yes') {
            fs.writeFileSync(fpath, JSON.stringify(itext), (err) => {
              if (err) return console.log(`${lmg} writing: [${err}]`)
            })
          } else {
            fs.writeFileSync(fpath, itext, (err) => {
              if (err) return console.log(`${lmg} writing: [${err}]`)
            })
          }
        }
        break

      case 2: // Append File
        result = () => {
          if (fileName === '') throw new Error('File Name not Provided:')
          if (togglestat === 'yes') {
            fs.appendFileSync(fpath, `${JSON.stringify(itext)}\r\n`, (err) => {
              if (err) return console.log(`${lmg} appending: [${err}]`)
            })
          } else {
            fs.appendFileSync(fpath, `${itext}\r\n`, (err) => {
              if (err) return console.log(`${lmg} appending: [${err}]`)
            })
          }
        }
        break

      case 4: // Insert Line to File
        result = () => {
          if (fileName === '') throw new Error('File Name not Provided:')
          insertLine(fpath).content(itext).at(line).then((err) => {
            if (err) return console.log(`${lmg} inserting: [${err}]`)
          })
        }
        break
      case 3: // Delete File
        result = () => fs.unlink(fpath, (err) => {
          if (!fs.existsSync(dirName)) this.callNextAction(cache)
          if (err) return console.log(`${lmg} deleting: [${err}]`)
        })
        break
    }
    function ensureDirExists (dirPath, cb) {
      const dirname = path.normalize(dirPath)
      if (!fs.existsSync(dirname)) {
        mkdirp(dirname, { recursive: true }, cb)
        return true
      }
      cb(null, '')
      return false
    }
    try {
      if (dirName) {
        ensureDirExists(dirName, result)
      } else {
        throw new Error('you did not set a file path, please go back and check your work.')
      }
    } catch (err) {
      return console.error(`ERROR ${err.stack || err}`)
    }
    this.callNextAction(cache)
  }

  mod () {}
}

module.exports = new FileControl()

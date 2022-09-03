module.exports = {
  name: 'File Control',
  section: 'File Stuff',
  fields: ['input', 'format', 'filename', 'filepath', 'filepath2', 'filetask', 'input2', 'togglestatus'],
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/file_control_MOD.js',
  },

  subtitle(data) {
    const filetasks = ['Create', 'Write', 'Append into', 'Delete', 'Insert into', 'Copy'];
    return `${filetasks[parseInt(data.filetask, 10)]} ${data.filename}${data.format}`;
  },

  html() {
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
      text-decoration: underline;
      cursor: pointer;
    }

    span.wrexlink:hover {
      color: #4676b9;
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

    input:checked+.slider {
      background-color: #2196F3;
    }

    input:focus+.slider {
      box-shadow: 0 0 1px #2196F3;
    }

    input:checked+.slider:before {
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
              <option value="5" title="Copies a file">Copy</option>
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
      <div id="newPath" style="padding: 5px 10px 5px 5px">
        <div style="float: left; width: 100%;">
          New File Path:<br>
          <textarea class="round col-100" id="filepath2" placeholder="Example Path = ./logs/date/example-date/" class="round" type="textarea" rows="3"></textarea><br>
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
          <span>Toggle this if your data contains Objects (Json, array, etc...)</span>
        </div>
        <div id="lineInsert" class="" style="float: left; width: 65%;">
          Line to Insert at:<br>
          <input id="input2" placeholder="1 Adds content at the first line." class="round"></input>
        </div>
      </div>
    </div>
  </div>`;
  },

  init() {
    const { document } = this;
    const selector = document.getElementById('filetask');
    const selector2 = document.getElementById('format');
    const targetfield = document.getElementById('inputArea');
    const targetfield2 = document.getElementById('lineInsert');
    const targetField3 = document.getElementById('newPath');
    const val1 = document.getElementById('togglestatus').value;
    if (val1 === 'yes') document.getElementById('togglestatus').checked = true;

    function showInput() {
      const selected = selector[selector.selectedIndex].value;
      const selected2 = selector2[selector2.selectedIndex].value;
      if (selected2 === '.json' && (selected !== '5' || selected !== '4')) {
        document.getElementById('visibot').style.display = 'block';
      } else {
        document.getElementById('visibot').style.display = 'none';
      }
      if (selected === '0' || selected === '3' || selected === '5') {
        // Hides "Input Text"
        targetfield.classList.add('hidden');
      } else {
        targetfield.classList.remove('hidden');
      }
      if (selected === '4') {
        targetfield2.classList.remove('hidden');
      } else {
        targetfield2.classList.add('hidden'); // Hides "Line to Insert at"
      }
      if (selected === '5') {
        // Hides "New File Path"
        targetField3.classList.remove('hidden');
      } else {
        targetField3.classList.add('hidden');
      }
    }

    selector.onclick = () => showInput();
  },

  async action(cache) {
    const path = require('path');
    const Mods = this.getMods();
    const fs = Mods.require('fs-extra');
    const insertLine = Mods.require('insert-line');

    const data = cache.actions[cache.index];
    const dirName = path.normalize(this.evalMessage(data.filepath, cache));
    const dirName2 = path.normalize(this.evalMessage(data.filepath2, cache));
    const fileName = this.evalMessage(data.filename, cache);
    const line = parseInt(this.evalMessage(data.input2, cache), 10);
    const togglestat = data.togglestatus;

    const fpath = path.join(dirName, fileName + data.format);
    const fpath2 = path.join(dirName2, fileName + data.format);
    const task = parseInt(data.filetask, 10);
    const itext = this.evalMessage(data.input, cache);
    const lmg = 'Something went wrong while';

    try {
      switch (task) {
        case 0: // Create File
          if (fileName === '') break;
          fs.pathExistsSync(path.join(fpath, fileName))
            ? console.log('File already exists!')
            : fs.writeFileSync(fpath, '');
          break;
        case 1: // Write File
          if (fileName === '') throw new Error('File Name not Provided:');
          fs.writeFileSync(fpath, togglestat === 'yes' ? JSON.stringify(itext) : itext);
          break;
        case 2: // Append File
          if (fileName === '') throw new Error('File Name not Provided:');
          fs.appendFileSync(fpath, `${togglestat === 'yes' ? JSON.stringify(itext) : itext}\r\n`);
          break;
        case 4: // Insert Line to File
          if (fileName === '') throw new Error('File Name not Provided:');
          insertLine(fpath)
            .content(itext)
            .at(line)
            .then((err) => {
              if (err) return console.error(`${lmg} inserting: [${err}]`);
            });
          break;
        case 3: // Delete File
          fs.unlinkSync(fpath);
          break;
        case 5: // Copy File
          fs.copySync(fpath, fpath2);
          break;
        default:
          break;
      }
    } catch (err) {
      const type = ['creating', 'writing', 'appending', 'deleting', 'copying'][task];
      return console.error(`${lmg} ${type} [${err}]`);
    }

    try {
      if (dirName) {
        fs.ensureDirSync(path.normalize(dirName));
      } else {
        throw new Error('you did not set a file path, please go back and check your work.');
      }
    } catch (err) {
      return console.error(`ERROR ${err.stack || err}`);
    }
    this.callNextAction(cache);
  },

  mod() {},
};

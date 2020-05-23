/**
 * @class FileControl
 */
class FileControl {
  /**
   *Creates an instance of FileControl.
   * @param {*} params
   */
  constructor(params) {
    this.name = 'File Control';
    this.DVN = '4.3.9';
    this.displayName = `File Control V${this.DVN}`;
    this.section = 'File Stuff';
    this.author = ['Danno3817', 'EliteArtz', 'Eggsy', 'General Wrex', 'RigidStudios'];
    this.version = '1.9.6';
    this.short_description = "This mod allows you to interact with files & directories. Please be careful when using this action. If you delete a file there's no going back";
    this.fields = ["input", "format", "filename", "filepath", "filetask", "input2"];
  }



  /**
   * Action Subtitle
   *
   * This function generates the subtitle displayed next to the name.
   * @param {*} data
   * @returns
   */
  subtitle(data) {
    const filetasks = ['Create', 'Write', 'Append into', 'Delete', 'Insert into'];
    return `${filetasks[parseInt(data.filetask)]} ${data.filename}${data.format}`;
  }

  /**
   * Command HTML
   *
   * This function returns a string containing the HTML used for
   * editing actions.
   *
   * The "isEvent" parameter will be true if this action is being used
   * for an event. Due to their nature, events lack certain information,
   * so edit the HTML to reflect this.
   *
   * The "data" parameter stores constants for select elements to use.
   *
   * Each is an array: index 0 for commands, index 1 for events.
   *
   * The names are: sendTargets, members, roles, channels, messages,
   * servers, variables
   * @param {*} isEvent
   * @param {*} data
   * @returns
   */
  html(isEvent, data) {
    return `
      <style>
        /* Most of this style inspired by EliteArtz & General Wrex */
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
      </style>

    <div id="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;" onload="showInput()">
      <div style="padding-bottom: 100px; padding: 5px 15px 5px 5px">
        <div class="container">
          <div class="ui teal segment" style="background: inherit;">
            <p>${this.short_description}</p>
            <p>Made by: <b>${this.author.join(' ')}</b><br>Version: ${this.version} | DVN: ${this.DVN}</p>
          </div>
        </div>

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
          <div id="lineInsert" class="" style="float: left; width: 65%;">
            Line to Insert at:<br>
            <input id="input2" placeholder="1 Adds content at the first line." class="round"></input>
          </div>
        </div>
      </div>
    </div>`
  }

  /**
   * Action Editor Init Code
   *
   * When the HTML is first applied to the action editor, this code
   * is also run. This helps add modifications or setup reactionary
   * functions for the DOM elements.
   */
  init() {
    const { glob, document } = this;

    let selector = document.getElementById('filetask');
    let targetfield = document.getElementById('inputArea');
    let targetfield2 = document.getElementById('lineInsert');

      selector.onclick = () => showInput();

    function showInput() {
        let selected = selector[selector.selectedIndex].value
      if (selected === "0" || selected === "3") {     // Hides "Input Text"
        targetfield.classList.add("hidden");
      } else {
        targetfield.classList.remove("hidden");
      }
      if (selected === "0" || selected === "1" || selected === "2" || selected === "3") {     // Hides "Line to Insert at"
        targetfield2.classList.add("hidden");
      } else {
        targetfield2.classList.remove("hidden");
      }
    }
  }


  /**
   * Action Bot Function
   *
   * This is the function for the action within the Bots Action class.
   *
   * Keep in mind event calls won't have access to the "msg" parameter,
   * so be sure to provide checks for variable existence.
   * @param {*} cache
   */
  action(cache) {
    const fs = require('fs');
    const path = require('path');

    const WrexMODS = this.getWrexMods();
    const mkdirp = WrexMODS.require('mkdirp');
    const insertLine = WrexMODS.require('insert-line');

    const data = cache.actions[cache.index];
    const dirName = path.normalize(this.evalMessage(data.filepath, cache));
    const fileName = this.evalMessage(data.filename, cache);
    const line = parseInt(this.evalMessage(data.input2, cache));


    var fpath = path.join (dirName, fileName + data.format);
    var task = parseInt(data.filetask);
    var itext = this.evalMessage(data.input, cache);

    const lmg = 'Something went wrong while';

    let result
    switch (task) {
      case 0: // Create File
        result = async () => {
          if (fileName === '') return this.callNextAction(cache);
          fs.writeFileSync(fpath, "", (err) => {
            if (err) return console.log(`${lmg} creating: [${err}]`);
          });
        }
        break;
      case 1: // Write File
        result = () => {
          if (fileName === '') throw new Error('File Name not Provided:');
          fs.writeFileSync(fpath, itext, (err) => {
            if (err) return console.log(`${lmg} writing: [${err}]`);
          });
        }
        break;

      case 2: // Append File
        result = () => {
          if (fileName === '') throw new Error('File Name not Provided:');
          fs.appendFileSync(fpath, itext + '\r\n', (err) => {
            if (err) return console.log(`${lmg} appending: [${err}]`);
          });
        }
        break;

      case 4: // Insert Line to File
        result = () => {
          if (fileName === '') throw new Error('File Name not Provided:');
          insertLine(fpath).content(itext).at(line).then(function(err) {
            if (err) return console.log(`${lmg} inserting: [${err}]`);
          });
        }
        break;

      case 3: // Delete File
        result = () => fs.unlink(fpath, (err) => {
          if (!fs.existsSync(dirName)) this.callNextAction(cache);
          if (err) return console.log(`${lmg} deleting: [${err}]`);
        });
        break;
    }

    function ensureDirExists(dirPath, cb) {
      let dirname = path.normalize(dirPath);
      if (!fs.existsSync(dirname)) {
        mkdirp(dirname, { recursive: true }, cb);
        return true;
      }else {
        cb(null, "");
        return false;
      }
    }

    try{
      if (dirName) {
        ensureDirExists(dirName, result);
      } else {
        throw new Error('you did not set a file path, please go back and check your work.');
      }
    } catch (err) {
      return console.error(`ERROR ${err.stack ? err.stack : err}`);
    }
    this.callNextAction(cache);
  }

  /**
   * Action Bot Mod
   *
   * Upon initialization of the bot, this code is run. Using the bots
   * DBM namespace, one can add/modify existing functions if necessary.
   *
   * In order to reduce conflicts between mods, be sure to alias
   * functions you wish to overwrite.
   * @param {*} DBM
   */
  mod(DBM) {
  }
}
module.exports = new FileControl();

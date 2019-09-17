module.exports = {

  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "File Control",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "File Stuff",

  //---------------------------------------------------------------------
    // DBM Mods Manager Variables (Optional but nice to have!)
    //
    // These are variables that DBM Mods Manager uses to show information
    // about the mods for people to see in the list.
  //---------------------------------------------------------------------

    // Who made the mod (If not set, defaults to "DBM Mods")
    author: "Danno3817, EliteArtz, Eggsy & General Wrex", //Original Idea by EliteArtz

    // The version of the mod (Defaults to 1.0.0)
    version: "1.9.6", //Added in 1.8.7
    // Version 4.0.0

    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "This mod allows you to interact with files & directories. Please be carefull when using this action. If you delete a file there's no going back",

  //---------------------------------------------------------------------
    // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
  //---------------------------------------------------------------------

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle: function(data) {
    const filetasks = ['Create', 'Write', 'Append', 'Delete'];
    return `${filetasks[parseInt(data.filetask)]} ${data.filename}${data.format}`;
  },

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: ["input", "format", "filename", "filepath", "filetask"],

  //---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editting actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  //
  // The "data" parameter stores constants for select elements to use.
  // Each is an array: index 0 for commands, index 1 for events.
  // The names are: sendTargets, members, roles, channels,
  //                messages, servers, variables
  //---------------------------------------------------------------------

  html: function(isEvent, data) {
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

  <div id="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
  <div style="padding-bottom: 100px; padding: 0px 10px 5px 5px">
    
    <div style="padding: 12px 15px">
      <div style="border: 1px solid hsla(0,0%,80%,.3); padding: 15px 12px; border-radius: 5px 5px 5px 5px;width: 98%;">
        <u><span class="wrexlink" data-url="https://github.com/Discord-Bot-Maker-Mods/DBM-Mods">Mod Info:</span></u><br>
        <span>Made by: <b>${this.author}</b></span>
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
    </div>
    

  </div>
  <div style="padding: 5px 15px">
    <div style="padding: 15px 12px; border-radius: 5px 5px 5px 5px;width: 98%;">
      ${this.short_description}<br>
      <p align=center>Version: ${this.version} | DVN: 4.2.0</p>
    </div>
  </div>
</div>`
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  //---------------------------------------------------------------------

  init: function() {
    const { glob, document } = this;

    let selector = document.getElementById('filetask');
    let targetfield = document.getElementById('inputArea');

    if (selector[selector.selectedIndex].value === "0" || selector[selector.selectedIndex].value === "3") {
      targetfield.classList.add("hidden");
    } else {
      targetfield.classList.remove("hidden");
    }

    function showInput() {
      if (selector[selector.selectedIndex].value === "0" || selector[selector.selectedIndex].value === "3") {
        targetfield.classList.add("hidden");
      } else {
        targetfield.classList.remove("hidden");
      }
    }

    selector.onclick = () => showInput();

  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existance.
  //---------------------------------------------------------------------

  action: function (cache) {
    const data = cache.actions[cache.index];
    
    const fs = require('fs');
    const path = require('path');

    const WrexMODS = this.getWrexMods();
    const mkdirp = WrexMODS.require('mkdirp');
    
    var dirName = path.normalize(this.evalMessage(data.filepath, cache));
    var fileName = path.normalize(this.evalMessage(data.filename, cache));
    
    var fpath = path.join (dirName,fileName + data.format);
    var task = parseInt(data.filetask);
    var itext = this.evalMessage(data.input, cache);

    function ensureDirExists(dirPath, cb) {
      let dirname = path.normalize(dirPath);
      if (!fs.existsSync(dirname)) {
        mkdirp(dirname, cb);
        return true;
      }else {
        cb(null, "")
        return false;
      }
    }
    
    let result;
    switch (task) {
      case 0: // Create File
        result = () => fs.writeFileSync(fpath, "", (err) => {
          if (err) return console.log(`Something went wrong while creating: [${err}]`);
        });
        break;
        
      case 1: // Write File
        result = () => fs.writeFileSync(fpath, itext, (err) => {
          if (err) return console.log(`Something went wrong while writing: [${err}]`);
        });
        break;
    
      case 2: // Append File
        result = () => fs.appendFileSync(fpath, itext + '\r\n', (err) => {
          if (err) return console.log(`Something went wrong while appending: [${err}]`);
        });
        break;
          
      case 3: // Delete File
        result = () => fs.unlink(fpath, (err) => {
          if (err) return console.log(`Something went wrong while deleting: [${err}]`);
        });
        break;
    }

    try {
      if (dirName) {
        if (fileName) {
          // Checks for directory, if not exist creates one.
          ensureDirExists(dirName, result);
        } else { console.log("You did not set a file name, please go back and check your work.");}
      } else { console.log("you did not set a file path, please go back and check your work.");}
    } catch (err) { console.log("ERROR!" + err.stack ? err.stack : err); }
      this.callNextAction(cache);
    },
  //---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflictions between mods, be sure to alias
  // functions you wish to overwrite.
  //---------------------------------------------------------------------

  mod: function(DBM) {
  }

}; // End of module

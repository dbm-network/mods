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
    author: "Danno3817", //Original Idea by EliteArtz

    // The version of the mod (Defaults to 1.0.0)
    version: "1.8.9", //Added in 1.8.7

    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "Allows a user to interact with 'Files'",

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
    <div id="scroll"style="width: 550px; height: 350px; overflow-y: scroll;">
      <div>
        <div>
          <p><u>Mod Info:</u><br>
          Made By: Danno3817, EliteArtz, Eggsy & General Wrex</p>
        </div><br>
        <div>
          <p><u>Important Info:</u><br>
          If you want to use your bots directory, you can add '.' (dot) before '/':<br>
          e.g:<br>
          My bot directory is: "<b>/root/myBot/</b>"<br>
          I want to delete: "<b>/root/myBot/delete.txt</b>"<br>
          Then I need to write "<b>./</b>" in the file path field.<br><br>
          <i>Please be careful while using the delete function, there is no turning back after deleting the file.</i><br>
          </p>
        </div>
      </div>
      <div>
        <div style="float: left; padding-right: 1% ">
          Format:<br>
          <select id="format" class="round">
            <option value="" selected>Other</option>
            <option value=".log">Log</option>
            <option value=".txt">txt</option>
            <option value=".json">JSON</option>
            <option value=".js">Java Script</option>
            
          </select>
        </div>
        <div style="float: left; padding-right: 1%;">
          Task:<br>
          <select id="filetask" class="round">
            <option value="0" selected>Create</option>
            <option value="1">Write</option>
            <option value="2">Append</option>
            <option value="3">Delete</option>
          </select>
        </div>
        <div style="float: left; width: 64%;">
          File Name:<br>
          <textarea id="filename" placeholder="Insert File Name Here..." class="round" style="width: 100%; resize: none; padding: 4px 8px;" type="textarea" rows="1"></textarea><br>
        </div><br>
      </div>
      <div>
        <div style="float: left; width: 100%">
          File Path:<br>
          <textarea id="filepath" placeholder="Example Path = ./logs/date/example-date" class="round" style="width: 99%; resize: 1; padding: 4px 8px;" type="textarea" rows="3"></textarea><br>
        </div><br>
        <div style="float: left; width: 100%;">
          Input Text:<br>
          <textarea id="input" placeholder="Leave Blank For None." class="round" style="width: 99%; resize: 1; padding: 4px 8px;" type="textarea" rows="10"></textarea><br>
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

  init: function() {},

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

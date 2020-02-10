module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------
    
    name: "Store Date Info Plus",
    
    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------
    
    section: "Other Stuff",
    
        
    //---------------------------------------------------------------------
    // DBM Mods Manager Variables (Optional but nice to have!)
    //
    // These are variables that DBM Mods Manager uses to show information
    // about the mods for people to see in the list.
    //---------------------------------------------------------------------
    
    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------
    
    subtitle: function(data) {
        const info = ['Day of Week', 'Day Number', 'Day of Year', 'Week of Year', 'Month of Year', 'Month Number', 'Year', 'Hour', 'Minute', 'Second', 'Millisecond', 'Timezone', 'Unix Timestamp']
        const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable']
        return `Store ${data.modeStorage === "0" ? '"' + info[data.info] + '"' : data.buildInput === "" ? '"Not Set"' : '"' + data.buildInput + '"'} from a Date ~ ${storage[data.storage]}`;
    },
    
    // Who made the mod (If not set, defaults to "DBM Mods")
    author: "Cap",
    
    // The version of the mod (Last edited version number of DBM Mods)
    version: "1.9.7", //Added in 1.9.7
    
    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "Store something from a date more fully, plus!",
    
    // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
    // Uncomment if you need this. Also, replace WrexMODS if needed.
    depends_on_mods: ["WrexMODS"],
    
    
    //---------------------------------------------------------------------
    // Action Storage Function
    //
    // Stores the relevant variable info for the editor.
    //---------------------------------------------------------------------
    
    variableStorage: function (data, varType) {
        const type = parseInt(data.storage);
        if (type !== varType) return;
        let dataType = 'Date';
        return ([data.varName, dataType]);
    },
    
    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------
    
    fields: ["sourceDate", "dateLanguage", "modeStorage", "info", "buildInput", "storage", "varName"],
    
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
        <div>
            <p>
                <u>Mod Info:</u><br>
                Created by ${this.author}
            </p>
        </div><br>
        <div style="float: left; width: 62%">
            Source Date:<br>
            <input id="sourceDate" class="round" type="text" placeholder="Ex: Sun Oct 26 2019 10:38:01 GMT+0200">
        </div>
        <div style="float: right; width: 38%">
           Date Language (initials):<br>
           <input id="dateLanguage" class="round" placeholder='Default is "en" (English)'>
        </div><br>
        <div style="float: left; width: 40%; padding-top: 16px">
            Mode:<br>
            <select id="modeStorage" class="round" onchange="glob.onChangeMode(this)">
                <option value="0" selected>Select</option>
                <option value="1">Builder</option>
            </select>
        </div>
        <div id="selectMode" style="display: none; float: right; width: 50%; padding-top: 16px">
            Source Info:<br>
            <select id="info" class="round">
                <option value="0" selected>Day of Week</option>
                <option value="1">Day Number</option>
                <option value="2">Day of Year (number)</option>
                <option value="3">Week of Year (number)</option>
                <option value="4">Month of Year</option>
                <option value="5">Month Number</option>
                <option value="6">Year</option>
                <option value="7">Hour</option>
                <option value="8">Minute</option>
                <option value="9">Second</option>
                <option value="10">Millisecond</option>
                <option value="11">Timezone</option>
                <option value="12">Unix Timestamp</option>
            </select>
        </div>
        <div id="buildMode" style="display: none; float: right; width: 50%; padding-top: 16px">
            Build It (<span class="wrexlink" data-url="https://momentjs.com/docs/#/displaying/format/">Moment Docs</span>):<br>
            <input id="buildInput" class="round" placeholder="Ex: DD/MM/YYYY = 10/26/2019">
        </div><br><br><br><br><br>
        <div style="float: left; width: 35%; padding-top: 10px">
            Store In:<br>
            <select id="storage" class="round">
                ${data.variables[1]}
            </select>
        </div>
        <div id="varNameContainer" style="float: right; width: 60%; padding-top: 10px">
            Variable Name:<br>
            <input id="varName" class="round" type="text">
        </div><br><br><br>
        <div id="noteContainer" style="display: none; padding-top: 16px">
            <b>Note:</b> You can use square brackets to put text in <b>builder mode</b> in the "Build It" field.<br>
            <b>Ex:</b> <span id="code">DD/MM/YYYY [at] HH:mm</span> = <span id="code">10/26/2019 at 10:38</span>
        </div>
        <style>
             span.wrexlink {
		color: #99b3ff;
		text-decoration: underline;
                cursor: pointer
            }

	     span.wrexlink:hover { 
                color:#4676b9
            }

            #code {
                background: #2C313C;
                color: white;
                padding: 3px;
                font-size: 12px;
                border-radius: 2px
              }
        </style>
        `
    },
    
    //---------------------------------------------------------------------
    // Action Editor Init Code
    //
    // When the HTML is first applied to the action editor, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------
    
    init: function() {
        const {glob, document} = this;

        glob.onChangeMode = function(modeStorage) {
            switch(parseInt(modeStorage.value)) {
                case 0:
                    document.getElementById("selectMode").style.display = null;
                    document.getElementById("buildMode").style.display = "none";
                    document.getElementById("noteContainer").style.display = "none";
                    break;
                case 1:
                    document.getElementById("selectMode").style.display = "none";
                    document.getElementById("buildMode").style.display = null;
                    document.getElementById("noteContainer").style.display = null;
                    break;
                }
            }

        glob.onChangeMode(document.getElementById("modeStorage"));

        var wrexlinks = document.getElementsByClassName("wrexlink")
        for(var x = 0; x < wrexlinks.length; x++) {
          
          var wrexlink = wrexlinks[x];
          var url = wrexlink.getAttribute('data-url');   
          if (url) {
            wrexlink.setAttribute("title", url);
            wrexlink.addEventListener("click", function(e){
              e.stopImmediatePropagation();
              console.log("Launching URL: [" + url + "] in your default browser.")
              require('child_process').execSync('start ' + url);
            });
          }   
        }  
    },
    
    //---------------------------------------------------------------------
    // Action Bot Function
    //
    // This is the function for the action within the Bot's Action class.
    // Keep in mind event calls won't have access to the "msg" parameter, 
    // so be sure to provide checks for variable existance.
    //---------------------------------------------------------------------
    
    action: function(cache) {
        const data = cache.actions[cache.index];
        const moment = this.getWrexMods().require("moment");
        const dateLanguage = this.evalMessage(data.dateLanguage, cache);
        const date = moment(Date.parse(this.evalMessage(data.sourceDate, cache)), "", dateLanguage === "" ? "en" : dateLanguage);
        const buildInput = this.evalMessage(data.buildInput, cache);
        const modeType = parseInt(this.evalMessage(data.modeStorage, cache));
        const info = parseInt(data.info);

        let result;
        
        if (modeType === 0) {
            switch(info) {
                case 0:
                    result = date.format("dddd");
                    break;
                case 1:
                    result = date.format("DD");
                    break;
                case 2:
                    result = date.format("DDD");
                    break;
                case 3:
                    result = date.format("ww");
                    break;
                case 4:
                    result = date.format("MMMMM");
                    break;
                case 5:
                    result = date.format("MM");
                    break;
                case 6:
                    result = date.format("YYYY");
                    break;
                case 7:
                    result = date.format("hh");
                    break;
                case 8:
                    result = date.format("mm");
                    break;
                case 9:
                    result = date.format("ss");
                    break;
                case 10:
                    result = date.format("SS");
                    break;
                case 11:
                    result = date.format("ZZ");
                    break;
                case 12:
                    result = date.format("X");
                    break;
               }
          } else {
             result = date.format(buildInput);
          }

          if (result === "Invalid date") {
             return console.log('Invalid Date! Check that your date is valid in "Store Date Info Plus". A Date generally looks like the one stored in "Creation Date" of a server. (variables works)');
          }
    
          if (result !== undefined) {
              const storage = parseInt(data.storage);
              const varName = this.evalMessage(data.varName, cache);
              this.storeValue(result, storage, varName, cache);
          }
	   
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
    

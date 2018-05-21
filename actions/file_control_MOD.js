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
        author: "Danno3187", //Original Idea by EliteArtz

        // The version of the mod (Defaults to 1.0.0)
        version: "1.8.7", //Added in 1.8.7

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
    <div >
        <p>
        <u>Mod Info</u><br>
        Made by Danno3817, EliteArtz & EGGSY</p><br>
        <div>
            <div style="float: left; padding-right: 10px; width: 20%;">
                File Format:<br>
                <select id="format" class="round">
                <option value=".json">JSON</option>
                <option value=".txt">TXT</option>
                <option value=".js">JS</option>
                <option value=".log" selected>LOG</option>
                </select>
            </div>

            <div style="float: left; padding-right: 10px; width: 20%;">
                File Task:<br>
                <select id="filetask" class="round">
                <option value="0" selected>Create</option>
                <option value="1">Write</option>
                <option value="2">Append</option>
                <option value="3">Delete</option>
                </select>
            </div>

            <div style="float: right; width: 50%">
                File Name:<br>
                <textarea id="filename" placeholder="Insert File Name Here..." class="round" style="width 50%; resize: none; padding: 4px 0px;" type="textarea" rows="1" cols="25";></textarea><br>
            </div><br>
        </div>
    </div>
    <div>
        <div>
            <div style="float: left; width: 99%">
                File Path:<br>
                <textarea id="filepath" placeholder="Insert Path Here... Example Below" class="round" style="width99%; resize: none;" type="textarea" rows="1" cols="60"></textarea><br>
            </div><br>

            <div style="float: left; width: 99%;">
            Input Text:<br>
            <textarea id="input" placeholder="Leave Blank For None." class="round" style="width: 99%; resize: 1;" type="textarea" rows="8" cols="35"></textarea><br>
            </div><br>
    </div><br>
    <div>
        <div>
            <p>Important info:<br>
            You'll need a '/' at the end of the Path '\\\' for windows users.<br>
            If you want to delete something in current directory, you can add '.' (dot) before '/':<br>
            e.g:<br>
            My bot directory is: "<b>/root/myBot/</b>"<br>
            I want to delete: "<b>/root/myBot/delete.txt</b>"<br>
            Then I need to write "<b>./delete.txt</b>" in the field.<br><br>
            <i>Please be careful while using this mod. Don't forget there is no turning back after deleting the file.</i><br>
            </p>
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

        const fileNAME = this.evalMessage(data.filename, cache);
        const filePATH = this.evalMessage(data.filepath, cache);
        const FullFile = filePATH + fileNAME + `${data.format}`;
        const fs = require('fs');

        const task = parseInt(data.filetask);

        const inputtext = this.evalMessage(data.input, cache);

        switch(task){
            case 0: //Create
            console.log("Create File Activated");
            try {
                if (filePATH){
                    if (fileNAME) { 
                        fs.writeFileSync(FullFile,"");
                    }else {
                        console.log("File name is missing.");
                    }
                }else{
                console.log("File path is missing.");
                }
            }catch (err){
                console.log("ERROR!" + err.stack ? err.stack : err);
            }this.callNextAction(cache);
            break;

            case 1: //Write
            try{
                if (filePATH){
                    if (fileNAME) { 
                        fs.writeFileSync(FullFile, inputtext);
                    }else {
                        console.log("File name is missing.");
                    }
                }else{
                console.log("File path is missing.");
                }
            } catch (err) {
                console.log("ERROR!" + err.stack ? err.stack : err);
            }this.callNextAction(cache);
            break;

            case 2: //Append
            try {
                if (filePATH && fileNAME){
                    fs.appendFileSync(FullFile, inputtext + '\r\n' );
                }else{
                console.log("File name or File path is missing.");
                }
            }catch (err){
                console.log("ERROR!" + err.stack ? err.stack : err);
            }this.callNextAction(cache);
            break;

            case 3: //Delete
            try {
                if (filePATH) {
                    fs.exists(`${FullFile}`, function(exists) {
                        if(exists) {
                            fs.unlink(FullFile, (err) => {
                                if (err) return console.log(`Something went wrong while deleting: [${err}]`);
                              });
                        } else {
                            console.log('File not found, nothing to delete.');
                        }
                      });
                } else {
                console.log(`File path is missing.`);
                }
            } catch (err) {
                console.log("ERROR!" + err.stack ? err.stack : err);
            }
            this.callNextAction(cache);
            break;


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

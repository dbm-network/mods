module.exports = {

        //---------------------------------------------------------------------
        // Action Name
        //
        // This is the name of the action displayed in the editor.
        //---------------------------------------------------------------------

        name: "Store Regex Matched Variable",

        //---------------------------------------------------------------------
        // Action Section
        //
        // This is the section the action will fall into.
        //---------------------------------------------------------------------

        section: "Variable Things",

        //---------------------------------------------------------------------
        // Action Subtitle
        //
        // This function generates the subtitle displayed next to the name.
        //---------------------------------------------------------------------

        subtitle: function(data) {
            const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
            return ` (${data.typeVariable}) ~Var: ${storage[parseInt(data.storage)]} (${data.varName})`;
        },

        //---------------------------------------------------------------------
        	 // DBM Mods Manager Variables (Optional but nice to have!)
        	 //
        	 // These are variables that DBM Mods Manager uses to show information
        	 // about the mods for people to see in the list.
        	 //---------------------------------------------------------------------

        	 // Who made the mod (If not set, defaults to "DBM Mods")
        	 author: "General Wrex",

        	 // The version of the mod (Defaults to 1.0.0)
        	 version: "1.8.2",

        	 // A short description to show on the mod line for this mod (Must be on a single line)
        	 short_description: "INSERT DESCRIPTION HERE",

        	 // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
        	 depends_on_mods: ["WrexMODS"],

        	 //---------------------------------------------------------------------

        //---------------------------------------------------------------------
        // Action Storage Function
        //
        // Stores the relevant variable info for the editor.
        //---------------------------------------------------------------------
        variableStorage: function(data, varType) {
            const type = parseInt(data.storage);
            if (type !== varType) return;

            return ([data.varName, 'Unknown Type']);
        },

        //---------------------------------------------------------------------
        // Action Fields
        //
        // These are the fields for the action. These fields are customized
        // by creating elements with corresponding IDs in the HTML. These
        // are also the names of the fields stored in the action's JSON data.
        //---------------------------------------------------------------------

        fields: ["behavior", "inputStorage", "inputVarName", "theType", "typeVariable", "storage", "varName"],

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
            <div id ="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
            <div>
               <p>
                  <u>Mod Info:</u><br>
                  Created by General Wrex!<br>
               </p>
            </div>
            <div>
               <div style="float: left; width: 95%;">
                  End Behavior:<br>
                  <select id="behavior" class="round">
                     <option value="0" selected>Call Next Action Automatically</option>
                     <option value="1">Do Not Call Next Action</option>
                  </select>
                  <br>
               </div>
               <div>
                  <div style="float: left; width: 30%;">
                     Input Variable:<br>
                     <select id="inputStorage" class="round" onchange="glob.variableChange(this, 'inputVarNameContainer')">
                     ${data.variables[1]}
                     </select>
                  </div>
                  <div id="inputVarNameContainer" style="display: ; float: right; width: 60%;">
                     Input Variable Name:<br>
                     <input id="inputVarName" class="round" type="text">
                  </div>
               </div>
               <div>
                  <div style="float: left; width: 30%;">
                     <br>Type:<br>
                     <select id="theType" class="round">
                        <option value="0" selected>Regex Match</option>
                        <option value="1" >Regex Replace</option>
                     </select>
                  </div>
                  <div id="typeContainer" style="display: ; float: right; width: 60%;">
                     <br>Match: (Regex Builder)<a href="http://buildregex.com/" target="_blank">http://buildregex.com/</a>)
                     <input id="typeVariable" class="round" type="text">
                  </div>
               </div>
               <div>
                  <div style="float: left; width: 30%;"><br><br>
                     Store In:<br>
                     <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
                     ${data.variables[1]}
                     </select>
                  </div>
                  <div id="varNameContainer" style="display: ; float: right; width: 60%;"><br><br>
                     Variable Name:<br>
                     <input id="varName" class="round" type="text">
                  </div>
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
            const {
                glob,
                document
            } = this;
            glob.variableChange(document.getElementById('inputStorage'), 'inputVarNameContainer');
            glob.variableChange(document.getElementById('storage'), 'varNameContainer');
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

            const inputStorage = parseInt(data.inputStorage);
            const storage = parseInt(data.storage);
            const type = parseInt(data.theType);

            const inputVarName = this.evalMessage(data.inputVarName, cache);
            const typeVariable = this.evalMessage(data.typeVariable, cache);
            const varName = this.evalMessage(data.varName, cache);

            var inputData = this.getVariable(inputStorage, inputVarName, cache);

            if (inputData) {

                switch (type) {
                    case 0:
                        try {
                            if (typeVariable) {

                                var regex = new RegExp(typeVariable, 'i');

                                if (regex.test(inputData)) {
                                    console.log("Store Regex Match: Valid Regex (RegEx String: " + typeVariable + ")");

                                    var outputData = inputData.match(regex);

                                    if (outputData) {
                                        var jsonData = JSON.stringify(outputData)

                                        console.log("Store Regex Match: Match Stored as JSON: " + jsonData);

                                        console.log('Match Results;\r\n');

                                        for (i = 0; i < outputData.length; i++) {
                                            console.log('[' + i + '] = ' + outputData[i]);
                                        }

                                        console.log('\r\nAppend the key that you want to store that value to the variable.');

                                        const storageType = ['', 'tempVars', 'serverVars', 'globalVars'];
                                        var out = storageType[storage]

                                        console.log('Example ${'+out+'("'+ varName +'")} to ${'+out+'("'+ varName +'")[key]}');
                                        console.log(''+ varName +'[key] if not using it as a template');
                                        this.storeValue(this.eval(jsonData, cache), storage, varName, cache);
                                    }


                                } else {
                                    console.log("Store Regex Match: Invalid Regex: (RegEx String: " + typeVariable + ")");
                                    this.storeValue(this.eval(outputData, cache), storage, varName, cache);
                                }
                            }
                        } catch (error) {
                            console.error("Store Regex Match: Error " + error);
                        }
                        break;
                    case 1:

                        try {
                            if (typeVariable) {

                                var regex = new RegExp(typeVariable, 'g');

                                console.log("Store Regex Match: Replacing With: " + typeVariable);

                                if (inputData) {

                                    var outputData = inputData.replace(regex, typeVariable);

                                    if (outputData) {
                                        var jsonData = JSON.stringify(outputData)
                                        console.log("Store Regex Match: Stored as JSON: " + jsonData);
                                        this.storeValue(this.eval(jsonData, cache), storage, varName, cache);
                                    }

                                }
                            }

                        } catch (error) {
                            console.error("Store Regex Match: Error " + error);
                        }
                        break;
                }
            }

            if (data.behavior === "0") {
                this.callNextAction(cache);
            }
        },

        //---------------------------------------------------------------------
        // Action Bot Mod
        //
        // Upon initialization of the bot, this code is run. Using the bot's
        // DBM namespace, one can add/modify existing functions if necessary.
        // In order to reduce conflictions between mods, be sure to alias
        // functions you wish to overwrite.
        //---------------------------------------------------------------------

        mod: function(DBM) {}

    }; // End of module

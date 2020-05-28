module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------

    name: "Quirky Text",

    //---------------------------------------------------------------------
    // Action Section
    //
    // This is the section the action will fall into.
    //---------------------------------------------------------------------

    section: "Other Stuff",

    //---------------------------------------------------------------------
    // Action Subtitle
    //
    // This function generates the subtitle displayed next to the name.
    //---------------------------------------------------------------------

    subtitle: function (data) {
        let opts = ["OWO'ify","SpONgeBoB","🇪🇲🇴🇱🇪🇹🇸","C 👏 L 👏 A 👏 P","1337","ᵗᶦⁿʸ"]
        return `Convert ${data.text} (${opts[parseInt(data.format) - 1]})`;
    },

    //---------------------------------------------------------------------
    // DBM Mods Manager Variables (Optional but nice to have!)
    //
    // These are variables that DBM Mods Manager uses to show information
    // about the mods for people to see in the list.
    //---------------------------------------------------------------------

    // Who made the mod (If not set, defaults to "DBM Mods")
    author: "RigidStudios", // Idea by Nathan // I hate myself tbh // Code stolen from NPM and Wrex

    // The version of the mod (Defaults to 1.0.0)
    version: "1.9.6", //added in 1.9.4

    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "oh god... what did i do...",

    // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods
    // WrexMODS (nobody actually ever puts this here do they hmmmmm :3)

    //---------------------------------------------------------------------

    //---------------------------------------------------------------------
    // Action Storage Function
    //
    // Stores the relevant variable info for the editor.
    //---------------------------------------------------------------------

    variableStorage: function (data, varType) {
        const type = parseInt(data.storage);
        if (type !== varType) return;
        return ([data.varName, 'String']);
    },

    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------

    fields: ["text", "format", "varName", "storage"],

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

    html: function (isEvent, data) {
        return `<div style="float: left; width: 95%; padding-top: 8px;">
              		<p><u>Mod Info:</u><br>
              		By <b>RigidStudios</b>! <br>Converts text to.... uh...</p>
              	</div>
              	<br><br><br>
              	<div style="float: left; width: 70%; padding-top: 8px;">
              		Text to Convert:
              		<input id="text" class="round" type="text">
              	</div>
                <div style="float: left; width: 100%; paddint-top: 8px;">
                  Converter:<br>
                  <select id="format" class="round">
                    <option value="1" selected>OWO'ify</option>
                    <option value="2">Spongebob</option>
                    <option value="3" title="Code from General Wrex's Raw Data.">Emolets</option>
                    <option value="4">Clap Clap Clap</option>
                    <option value="5">LEET</option>
                    <option value="6">tiny</option>
                  </select>
                </div>
              	<div style="float: left; width: 35%; padding-top: 8px;">
              		Store Result In:<br>
              		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
              		  ${data.variables[0]}
              		</select>
              	</div>
              	<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
              		Variable Name:<br>
              		<input id="varName" class="round" type="text">
              	</div><br><br>
              	<div style=" float: left; width: 88%; padding-top: 8px;">
              		<br>
              		<p>
              			I regret this...
              		</p>
        	      </div>`;
    },

    //---------------------------------------------------------------------
    // Action Editor Init Code
    //
    // When the HTML is first applied to the action editor, this code
    // is also run. This helps add modifications or setup reactionary
    // functions for the DOM elements.
    //---------------------------------------------------------------------

    init: function () {
        const {
            glob,
            document
        } = this;

        glob.variableChange(document.getElementById('storage'), 'varNameContainer');
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

        const WrexMODS = this.getWrexMods();
        const text = this.evalMessage(data.text, cache)
        const format = parseInt(this.evalMessage(data.format, cache))

        let result;

        switch (format) {
          case 1:
            const owo = WrexMODS.require('owoifyx'); // My brain hurt too much writing my own owo library...
            result = owo(text);
          break;
          case 2:
            result = text.split('').map((l) => (Math.round(Math.random())) ? l.toUpperCase() : l.toLowerCase()).join('');
          break;
          case 3:
          let word = "";

                    function GetCharacter(input){
                        if(("abcdefghijklmnopqrstuvwxyz").includes(input)){
                            return ':regional_indicator_' + input + ":";
                        }else{
                            switch (input) {
                                case "0":
                                    return ':zero:'
                                    break;
                                case "1":
                                    return ':one:'
                                    break;
                                case "2":
                                    return ':two:'
                                    break;
                                case "3":
                                    return ':three:'
                                    break;
                                case "4":
                                    return ':four:'
                                    break;
                                case "5":
                                    return ':five:'
                                    break;
                                case "6":
                                    return ':six:'
                                    break;
                                case "7":
                                    return ':seven:'
                                    break;
                                case "8":
                                    return ':eight:'
                                    break;
                                case "9":
                                    return ':nine:'
                                    break;
                                case "!":
                                    return ':grey_exclamation:'
                                    break;
                                case "<":
                                    return ':arrow_backward:'
                                    break;
                                case ">":
                                    return ':arrow_forward:'
                                    break;
                                case ",":
                                    return ','
                                    break;
                                case ".":
                                    return '.'
                                    break;
                                case "@":
                                    return '@'
                                    break;
                                case "?":
                                    return ':question:'
                                    break;
                                default:
                                    return ' '
                                    break;
                            }
                        }
                    }

              text.toLowerCase().split('').forEach(function(char){ word = word + GetCharacter(char)});
              result = word;
          break;
          case 4:
            result = text.toUpperCase().split("").join(" 👏 ");
          break;
          case 5:
            const leet = WrexMODS.require('leet');
            result = leet.convert(text.toLowerCase());
            break;
          case 6:
            const small = WrexMODS.require('superscript-text');
            result = small(text);
            break;
          default:
            result = "bRuH yOU foRgOT thE TexT"
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

    mod: function (DBM) {}

}; // End of module

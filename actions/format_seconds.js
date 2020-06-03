module.exports = {

    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------

    name: "Format Seconds",

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
        return `Convert ${data.time}`;
    },

    //---------------------------------------------------------------------
    // DBM Mods Manager Variables (Optional but nice to have!)
    //
    // These are variables that DBM Mods Manager uses to show information
    // about the mods for people to see in the list.
    //---------------------------------------------------------------------

    // Who made the mod (If not set, defaults to "DBM Mods")
    author: "RigidStudios", // If anyone touches this mod i will personally gut you.

    // The version of the mod (Defaults to 1.0.0)
    version: "1.0.0",

    // A short description to show on the mod line for this mod (Must be on a single line)
    short_description: "Convert Seconds to Days, Hours, Minutes and Seconds, along with other formats.",

    // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

    //---------------------------------------------------------------------

    //---------------------------------------------------------------------
    // Action Storage Function
    //
    // Stores the relevant variable info for the editor.
    //---------------------------------------------------------------------

    variableStorage: function (data, varType) {
        const type = parseInt(data.storage);
        if (type !== varType) return;
        return ([data.varName, 'Date']);
    },

    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------

    fields: ["time", "storage", "format", "varName"],

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
        return `
	<div style="float: left; width: 95%; padding-top: 8px;">
		<p><u>Mod Info:</u><br>
		Revamped by <b>RigidStudios</b>! Originally by <b>Aamon</b>. <br> Convert seconds to Various formats.</p>
	</div>
	<br><br><br>
	<div style="float: left; width: 70%; padding-top: 8px;">
		Seconds to Convert:
		<input id="time" class="round" type="text" placeholder="e.g. 1522672056 or use Variables">
	</div>
  <div style="float: left; width: 100%; paddint-top: 8px;">
    Format:<br>
    <select id="format" class="round">
      <option value="1">M/D/H/M/S</option>
      <option value="2" selected>D/H/M/S</option>
      <option value="3">H/M/S</option>
      <option value="4">M/S</option>
      <option value="5">Months/Days/Hours/Minutes/Seconds</option>
      <option value="6">Days/Hours/Minutes/Seconds</option>
      <option value="7">Hours/Minutes/Seconds</option>
      <option value="8">Minutes/Seconds</option>
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
        const time = this.evalMessage(data.time, cache);
        var _this = this; // this is needed sometimes.
        const format = parseInt(this.evalMessage(data.format, cache));

        let mo, d, h, m, s;
        let result;

        switch (format) {
          case 1: // MDHMS
              mo = Math.floor(time / 2592000)
              d = Math.floor(time % 2592000 / 86400);
              h = Math.floor(time % 86400 / 3600);
              m = Math.floor(time % 3600 / 60);
              s = Math.floor(time % 60);
                result = ((mo > 0) ? mo + "M " : "") + ((d > 0) ? d + "d " : "") + ((h > 0) ? h + "h " : "") + ((m > 0) ? m + "m " : "") + s + "s";
            break;
          case 2: // DHMS
              d = Math.floor(time / 86400);
              h = Math.floor(time % 86400 / 3600);
              m = Math.floor(time % 3600 / 60);
              s = Math.floor(time % 60);
                result = ((d > 0) ? d + "d " : "") + ((h > 0) ? h + "h " : "") + ((m > 0) ? m + "m " : "") + s + "s";
            break;
          case 3: // HMS
              h = Math.floor(time / 3600);
              m = Math.floor(time % 3600 / 60);
              s = time % 60;
                result = ((h > 0) ? h + "h " : "") + ((m > 0) ? m + "m " : "") + s + "s";
            break;
          case 4: // MS
              m = Math.floor(time / 60);
              s = time % 60;
                result = ((m > 0) ? m + "m " : "") + s + "s";
            break;
          case 5: // Formatted MDHMS
              mo = Math.floor(time / 2592000)
              d = Math.floor(time % 2592000 / 86400);
              h = Math.floor(time % 86400 / 3600);
              m = Math.floor(time % 3600 / 60);
              s = Math.floor(time % 60);
                result = ((mo > 0) ? ((mo !== 1 ) ? mo + " Months " : mo + " Month ") : "") + ((d > 0) ? ((d !== 1 ) ? d + " Days " : d + " Day ") : "") + ((h > 0) ? ((h !== 1 ) ? h + " Hours " : h + " Hour ") : "") + ((m > 0) ? ((m !== 1 ) ? m + " Minutes " : m + " Minute ") : "") + ((s !== 1 ) ? s + " Seconds" : s + " Second");
            break;
          case 6: // Formatted DHMS
              d = Math.floor(time / 86400);
              h = Math.floor(time % 86400 / 3600);
              m = Math.floor(time % 3600 / 60);
              s = Math.floor(time % 60);
                result = ((d > 0) ? ((d !== 1 ) ? d + " Days " : d + " Day ") : "") + ((h > 0) ? ((h !== 1 ) ? h + " Hours " : h + " Hour ") : "") + ((m > 0) ? ((m !== 1 ) ? m + " Minutes " : m + " Minute ") : "") + ((s !== 1 ) ? s + " Seconds" : s + " Second");
            break;
          case 7: // Formatted HMS
              h = Math.floor(time / 3600);
              m = Math.floor(time % 3600 / 60);
              s = time % 60;
                result = ((h > 0) ? ((h !== 1 ) ? h + " Hours " : h + " Hour ") : "") + ((m > 0) ? ((m !== 1 ) ? m + " Minutes " : m + " Minute ") : "") + ((s !== 1 ) ? s + " Seconds" : s + " Second");
            break;
          case 8: // Formatted MS
              m = Math.floor(time / 60);
              s = time % 60;
                result = ((m > 0) ? ((m !== 1 ) ? m + " Minutes " : m + " Minute ") : "") + ((s !== 1 ) ? s + " Seconds" : s + " Second");
            break;
          default:
            console.log("Something went wrong... Check your Format Seconds mod. (#" + cache.index + ")");
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

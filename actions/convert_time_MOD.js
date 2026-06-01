module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Convert Time',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Other Stuff',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data) {
    const convertFroms = ['Miliseconds', 'Seconds', 'Minutes', 'Hours'];
    const convertTos = ['Miliseconds', 'Seconds', 'Minutes', 'Hours'];
    return `Convert ${data.time} ${convertFroms[parseInt(data.convertFrom, 10)]} to ${
      convertTos[parseInt(data.convertTo, 10)]
    }`;
  },

  // ---------------------------------------------------------------------
  // DBM Mods Manager Variables (Optional but nice to have!)
  //
  // These are variables that DBM Mods Manager uses to show information
  // about the mods for people to see in the list.
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: 'https://github.com/master3395/dbm-mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    const dataType = 'Number';
    return [data.varName, dataType];
  },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  // ---------------------------------------------------------------------

  fields: ['time', 'convertFrom', 'convertTo', 'storage', 'varName'],

  // ---------------------------------------------------------------------
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
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div>
	<div>
		<p>Made by ZockerNico</p>
	</div><br>
	<div style="float: left; width: 45%;">
		Convert from:<br>
		<select id="convertFrom" class="round">
			<option value="0">Miliseconds</option>
			<option value="1" selected>Seconds</option>
			<option value="2">Minutes</option>
			<option value="3">Hours</option>
		</select>
	</div>
	<div style="float: right; width: 50%;">
		Amount:<br>
		<input id="time" class="round" type="text">
	</div>
	<div style="float: left; padding-top: 8px; width: 70%;">
		Convert to:<br>
		<select id="convertTo" class="round">
			<option value="0">Miliseconds</option>
			<option value="1">Seconds</option>
			<option value="2" selected>Minutes</option>
			<option value="3">Hours</option>
		</select>
	</div>
	<div style="float: left; padding-top: 8px; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; padding-top: 8px; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text"><br>
	</div><br>
	<div style="float: left; padding-top: 8px;">
		<p>Sample:<br>1 minute as input will give you 0.016666666666666666 hours as output.</p>
	</div>
</div>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existance.
  // ---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const amount = parseInt(this.evalMessage(data.time, cache), 10);
    const convFrom = parseFloat(data.convertFrom);
    const convTo = parseFloat(data.convertTo);
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);

    let result = undefined;
    function Converter(from, to, amount) {
      switch (from) {
        case 0: // From miliseconds
          switch (to) {
            case 0:
              result = parseFloat(amount); // Same
              break;
            case 1:
              result = parseFloat(amount / 1000); // To seconds
              break;
            case 2:
              result = parseFloat(amount / 60000); // To minutes
              break;
            case 3:
              result = parseFloat(amount / 3600000); // To hours
              break;
          }
          break;
        case 1: // From seconds
          switch (to) {
            case 0:
              result = parseFloat(amount * 1000); // To miliseconds
              break;
            case 1:
              result = parseFloat(amount); // Same
              break;
            case 2:
              result = parseFloat(amount / 60); // To minutes
              break;
            case 3:
              result = parseFloat(amount / 3600); // To hours
              break;
          }
          break;
        case 2: // From minutes
          switch (to) {
            case 0:
              result = parseFloat(amount * 60000); // To miliseconds
              break;
            case 1:
              result = parseFloat(amount * 60); // To seconds
              break;
            case 2:
              result = parseFloat(amount); // Same
              break;
            case 3:
              result = parseFloat(amount / 60); // To hours
              break;
          }
          break;
        case 3: // From hours
          switch (to) {
            case 0:
              result = parseFloat(amount * 6000000); // To miliseconds
              break;
            case 1:
              result = parseFloat(amount * 3600); // To seconds
              break;
            case 2:
              result = parseFloat(amount * 60); // To minutes
              break;
            case 3:
              result = parseFloat(amount); // Same
              break;
          }
          break;
      }
    }
    Converter(convFrom, convTo, amount);

    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflictions between mods, be sure to alias
  // functions you wish to overwrite.
  // ---------------------------------------------------------------------

  mod(DBM) {},
}; // End of module

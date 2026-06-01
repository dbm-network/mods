module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Paste Pastebin',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },
  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data) {
    const varTypes = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
    const FalseTypes = ['Continue Actions', 'Stop Action Sequence', 'Jump To Action', 'Skip Next Actions'];
    return `Link: ${varTypes[parseInt(data.storage, 10)]} ("${data.varName}") If Fails: ${
      FalseTypes[parseInt(data.iffalse, 10)]
    }`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Pastebin Link'];
  },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  // ---------------------------------------------------------------------

  fields: ['apikey', 'title', 'format', 'type', 'text', 'storage', 'varName', 'iffalse', 'iffalseVal'],

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
        <div style="width: 550px; height: 350px; overflow-y: scroll;">
        <div><u>Mod Info:</u><br>Made by <b>Blue Label</b></div><br>
        <div>
        <u>Helpful Information</u><br>
        - To get an api key visit <a href="https://pastebin.com/api#1">pastebin api page</a>.<br>
        - To get all the supported formats <a href="https://pastebin.com/api#5">click here</a>.<br>
        - To see the paste limit and other information <a href="https://pastebin.com/faq">pastebin FAQ</a>.<br>
        - If you chose file, write down the file location for ex './example.txt'.<br><br>
        </div><br>
        <div id="divapikey" style="float: left; width: 100%;">
		    API Key:<br>
		    <input id="apikey" class="round" type="text" placeholder="Insert your Pastebin API Key">
        </div>
        <div style="float: left; width: 50%; padding-top: 10px">
		    Pastebin Title:<br>
		    <input id="title" class="round" type="text"><br>
        </div>
        <div style="float: left; width: 50%; padding-top: 10px">
		    Format:<br>
            <input id="format" class="round" type="text" placeholder="Insert text for none"><br>
	    </div>
        <div style="float: left; width: 50%; padding-top: 10px">
            <select id="type" class:"round">
            <option value="0" selected>Custom Text</option>
            <option value="1">File</option>
            </select>
        </div><br><br><br>
        <div style="float: left; width: 90%;">
            <textarea placeholder="Insert File Location or Custom Text" id="text" rows="9" style="width: 90%;"></textarea>
        </div><br><br><br>
        <div style="float: left; width: 35%; padding-top: 10px;">
            Store Pastebin Link In:<br>
            <select id="storage" class="round">
                ${data.variables[1]}
            </select>
        </div>
        <div id="varNameContainer" style="float: right; width: 60%; padding-top: 10px;">
            Variable Name:<br>
            <input id="varName" class="round" type="text">
        </div>
        <div style="float: left; width: 35%; padding-top: 10px;">
            If Paste Fails:<br>
            <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
				<option value="0" selected>Continue Actions</option>
				<option value="1">Stop Action Sequence</option>
				<option value="2">Jump To Action</option>
				<option value="3">Skip Next Actions</option>
		 </select>
		</div>
        <div id="iffalseContainer" style="display: none; float: right; width: 60%; padding-top: 10px;">
            <span id="iffalseName">Action Number</span>:<br><input id="iffalseVal" class="round" type="text">
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

  init() {
    const { glob, document } = this;

    glob.onChangeFalse(document.getElementById('iffalse'));
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existance.
  // ---------------------------------------------------------------------

  action(cache) {
    const _this = this;
    const data = cache.actions[cache.index];
    const apikey = _this.evalMessage(data.apikey, cache);
    const title = _this.evalMessage(data.title, cache);
    const format = _this.evalMessage(data.format, cache);
    const text = _this.evalMessage(data.text, cache);
    const type = parseInt(data.type, 10);

    const WrexMODS = _this.getWrexMods();
    WrexMODS.CheckAndInstallNodeModule('pastebin-js');
    const PastebinAPI = require('pastebin-js');
    const pastebin = new PastebinAPI({
      api_dev_key: apikey,
    });
    let result;
    switch (type) {
      case 0:
        result = pastebin.createPaste(text, title);
        break;
      case 1:
        result = pastebin.createPasteFromFile(text, title, format, 1, 'N');
        break;
    }
    result
      .then(function (pasteData) {
        console.log(pasteData);
        const varName = _this.evalMessage(data.varName, cache);
        const storage = parseInt(data.storage, 10);
        _this.storeValue(pasteData, storage, varName, cache);
        _this.callNextAction(cache);
      })
      .fail(function (err) {
        console.log(err);
        _this.executeResults(false, data, cache);
      });
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

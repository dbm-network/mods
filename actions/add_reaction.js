module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Add Reaction',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Messaging',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Add Reaction to ${presets.getMessageText(data.storage, data.varName)}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  //
  // Helps check for updates and provides info if a custom mod.
  // If this is a third-party mod, please set "author" and "authorUrl".
  //
  // It's highly recommended "preciseCheck" is set to false for third-party mods.
  // This will make it so the patch version (0.0.X) is not checked.
  // ---------------------------------------------------------------------

  meta: { version: '2.2.0', preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'emoji', 'varName2', 'varName3'],

  // ---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<message-input dropdownLabel="Source Message" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></message-input>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: 35%;">
		<span class="dbminputlabel">Source Emoji</span><br>
		<select id="emoji" name="second-list" class="round" onchange="glob.onChange1(this)">
			<option value="4" selected>Direct Emoji</option>
			<option value="0">Custom Emoji</option>
			<option value="1">Temp Variable</option>
			<option value="2">Server Variable</option>
			<option value="3">Global Variable</option>
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%;">
		<span id="extName" class="dbminputlabel">Emoji (right-click -> Insert Emoji)</span><br>
		<input id="varName2" class="round" type="text">
	</div>
	<div id="varNameContainer3" style="float: right; width: 60%; display: none;">
		<span class="dbminputlabel">Variable Name</span><br>
		<input id="varName3" class="round" type="text" list="variableList2">
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

    glob.onChange1 = function (event) {
      const value = parseInt(event.value, 10);
      const varNameInput = document.getElementById('extName');
      if (value === 0) {
        varNameInput.innerHTML = 'Emoji Name';
        document.getElementById('varNameContainer3').style.display = 'none';
        document.getElementById('varNameContainer2').style.display = null;
      } else if (value === 4) {
        varNameInput.innerHTML = 'Emoji (right-click -> Insert Emoji)';
        document.getElementById('varNameContainer3').style.display = 'none';
        document.getElementById('varNameContainer2').style.display = null;
      } else {
        glob.onChangeBasic(event, 'varNameContainer3');
        document.getElementById('varNameContainer3').style.display = null;
        document.getElementById('varNameContainer2').style.display = 'none';
      }
    };

    glob.onChange1(document.getElementById('emoji'));
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const message = await this.getMessageFromData(data.storage, data.varName, cache);

    const type = parseInt(data.emoji, 10);
    let emoji;
    if (type === 4) {
      emoji = this.evalMessage(data.varName2, cache);
    } else if (type === 0) {
      emoji = this.getDBM().Bot.bot.emojis.cache.find((e) => e.name === this.evalMessage(data.varName2, cache));
    } else {
      emoji = this.getVariable(type, this.evalMessage(data.varName3, cache), cache);
    }

    if (Array.isArray(message)) {
      this.callListFunc(message, 'react', [emoji])
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else if (emoji && message?.react) {
      message
        .react(emoji)
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  // ---------------------------------------------------------------------

  mod() {},
};

module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Store Thread Channel Info',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Channel Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const info = [
      'Thread Channel Object',
      'Thread Channel ID',
      'Thread Channel Name',
      'Thread Channel Is Archived?',
      'Thread Channel Is Locked?',
      'Thread Channel Is Invitable?',
      'Thread Channel Archived At',
      'Thread Channel Archived At Timestamp',
    ];
    return `${presets.getChannelText(data.thread, data.threadVarName)} - ${info[parseInt(data.info, 10)]}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    const info = parseInt(data.info, 10);
    let dataType = 'Unknown Type';
    switch (info) {
      case 0:
        dataType = 'Thread Channel';
        break;
      case 1:
        dataType = 'Thread Channel ID';
        break;
      case 2:
        dataType = 'Text';
        break;
      case 3:
      case 4:
      case 5:
        dataType = 'Boolean';
        break;
      case 6:
        dataType = 'Date';
        break;
      case 7:
        dataType = 'Timestamp';
        break;
    }
    return [data.storageVarName, dataType];
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

  fields: ['thread', 'threadVarName', 'info', 'storage', 'storageVarName'],

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
<thread-channel-input dropdownLabel="Source Channel" selectId="thread" variableContainerId="varNameContainer" variableInputId="threadVarName"></thread-channel-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Source Info</span><br>
	<select id="info" class="round">
		<option value="0" selected>Thread Channel Object</option>
		<option value="1">Thread Channel ID</option>
		<option value="2">Thread Channel Name</option>
		<option value="3">Thread Channel Is Archived?</option>
		<option value="4">Thread Channel Is Locked?</option>
		<option value="5">Thread Channel Is Invitable?</option>
		<option value="6">Thread Channel Archived At</option>
		<option value="7">Thread Channel Archived At Timestamp</option>
	</select>
</div>

<br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="storageVarName"></store-in-variable>`;
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
  // so be sure to provide checks for variable existence.
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];

    const targetChannel = await this.getChannelFromData(data.thread, data.threadVarName, cache);

    if (!targetChannel) {
      this.callNextAction(cache);
      return;
    }

    let result;
    const info = parseInt(data.info, 10);
    switch (info) {
      case 0:
        result = targetChannel;
        break;
      case 1:
        result = targetChannel.id;
        break;
      case 2:
        result = targetChannel.name;
        break;
      case 3:
        result = targetChannel.archived;
        break;
      case 4:
        result = targetChannel.locked;
        break;
      case 5:
        result = targetChannel.invitable;
        break;
      case 6:
        result = targetChannel.archivedAt;
        break;
      case 7:
        result = targetChannel.archiveTimestamp;
        break;
      default:
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const storageVarName = this.evalMessage(data.storageVarName, cache);
      this.storeValue(result, storage, storageVarName, cache);
    }

    this.callNextAction(cache);
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

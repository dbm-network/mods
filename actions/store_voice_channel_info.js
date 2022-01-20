module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: "Store Voice Channel Info",

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: "Channel Control",

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle(data, presets) {
    const info = [
      "Voice Channel Object",
      "Voice Channel ID",
      "Voice Channel Name",
      "Voice Channel Members",
      "Voice Channel Is Full?",
      "Voice Channel Position",
      "Voice Channel User Limit",
      "Voice Channel Bitrate",
      "Voice Channel Members Count",
    ];
    return `${presets.getVoiceChannelText(data.channel, data.varName)} - ${info[parseInt(data.info, 10)]}`;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  //---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    const info = parseInt(data.info, 10);
    let dataType = "Unknown Type";
    switch (info) {
      case 0:
        dataType = "Voice Channel";
        break;
      case 1:
        dataType = "Voice Channel ID";
        break;
      case 2:
        dataType = "Text";
        break;
      case 3:
        dataType = "Members List";
        break;
      case 4:
        dataType = "Text";
        break;
      case 5:
      case 6:
      case 7:
      case 8:
        dataType = "Number";
        break;
    }
    return [data.varName2, dataType];
  },

  //---------------------------------------------------------------------
  // Action Meta Data
  //
  // Helps check for updates and provides info if a custom mod.
  // If this is a third-party mod, please set "author" and "authorUrl".
  //
  // It's highly recommended "preciseCheck" is set to false for third-party mods.
  // This will make it so the patch version (0.0.X) is not checked.
  //---------------------------------------------------------------------

  meta: { version: "2.0.11", preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: ["channel", "varName", "info", "storage", "varName2"],

  //---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  //---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<voice-channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName" selectWidth="45%" variableInputWidth="50%"></voice-channel-input>

<br><br><br>

<div style="padding-top: 8px;">
	<span class="dbminputlabel">Source Info</span><br>
	<select id="info" class="round">
		<option value="0" selected>Voice Channel Object</option>
		<option value="1">Voice Channel ID</option>
		<option value="2">Voice Channel Name</option>
    <option value="3">Voice Channel Members</option>
    <option value="4">Voice Channel Is Full?</option>
		<option value="5">Voice Channel Position</option>
		<option value="6">Voice Channel User Limit</option>
		<option value="7">Voice Channel Bitrate</option>
		<option value="8">Voice Channel Members Count</option>
	</select>
</div>

<br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>`;
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  //---------------------------------------------------------------------

  init() {},

  //---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  //---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const channel = parseInt(data.channel, 10);
    const varName = this.evalMessage(data.varName, cache);
    const info = parseInt(data.info, 10);
    const targetChannel = this.getVoiceChannel(channel, varName, cache);
    if (!targetChannel) {
      this.callNextAction(cache);
      return;
    }
    let result;
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
        result = [...targetChannel.members.values()];
        break;
      case 4:
        result = targetChannel.full;
        break;
      case 4:
        result = targetChannel.position;
        break;
      case 5:
        result = targetChannel.userLimit;
        break;
      case 6:
        result = targetChannel.bitrate;
        break;
      case 7:
        result = targetChannel.members.size;
        break;

      default:
        break;
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },

  //---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  //---------------------------------------------------------------------

  mod() {},
};

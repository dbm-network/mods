module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Await Message from Member',

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
    return `Await message in ${presets.getChannelText(data.channel, data.channelVarName)} from ${presets.getMemberText(
      data.member,
      data.memberVarName,
    )}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.storeInVarName, 'Message'];
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

  fields: ['channel', 'channelVarName', 'member', 'memberVarName', 'time', 'count', 'storage', 'storeInVarName'],

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
<channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="channelVarNameContainer" variableInputId="channelVarName"></channel-input>

<br><br><br><br>

<member-input dropdownLabel="Member" selectId="member" variableContainerId="memberVarNameContainer" variableInputId="memberVarName"></member-input>

<br><br><br><br>

<div style="padding-top: 8px;">
	<div style="width: calc(50% - 12px); float: left;">
		<span class="dbminputlabel">Await Time (in Seconds)</span><br>
		<input id="time" class="round" type="text" style="width: 100%;" value="5"><br>
	</div>
	<div style="width: calc(50% - 12px); float: right;">
		<span class="dbminputlabel">Number of Messages to Check</span><br>
		<input id="count" class="round" type="text" style="width: 100%;" value="20"><br>
	</div>
</div>

<br><br><br><br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="storeInVarNameContainer" variableInputId="storeInVarName"></store-in-variable>
`;
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
    const channel = await this.getChannelFromData(data.channel, data.channelVarName, cache);
    const member = await this.getMemberFromData(data.member, data.memberVarName, cache);

    if (!member || !channel?.createMessageCollector) {
      this.callNextAction(cache);
      return;
    }

    const maxProcessed = Math.min(parseInt(this.evalMessage(data.count, cache), 10), 200);
    const time = parseInt(this.evalMessage(data.time, cache) || '5', 10) * 1000;
    const filter = (m) => m?.author?.id === member.id;

    const collector = channel.createMessageCollector({
      max: 1,
      time,
      filter,
      maxProcessed,
    });

    collector.on('end', (collected) => {
      if (collected && collected.size > 0) {
        const varName = this.evalMessage(data.storeInVarName, cache);
        const storage = parseInt(data.storage, 10);
        this.storeValue(collected.values().next(), storage, varName, cache);
      }

      this.callNextAction(cache);
    });
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  // ---------------------------------------------------------------------

  mod(DBM) {},
};

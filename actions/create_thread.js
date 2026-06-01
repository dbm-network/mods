module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Create Thread',

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
    return `Create Thread Named "${data.threadName}" from ${
      data.fromTarget._index === 0
        ? presets.getChannelText(data.fromTarget?.channel ?? 0, data.fromTarget?.channelVarName)
        : presets.getMessageText(data.fromTarget?.message ?? 0, data.fromTarget?.messageVarName)
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
    return [data.storageVarName, 'Thread Channel'];
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

  fields: ['fromTarget', 'threadName', 'autoArchiveDuration', 'reason', 'storage', 'storageVarName', 'threadType'],

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
<div style="height: 350px; overflow-y: scroll; overflow-x: hidden;">
	<tab-system exclusiveTabData retainElementIds spreadOut id="fromTarget">
		<tab label="Create on Channel" icon="plus" fields='["channel", "channelVarName"]'>
			<div style="padding: 8px; margin-bottom: 25px;">
				<channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainerChannel" variableInputId="channelVarName"></channel-input>
			</div>
			<br>
		</tab>
		<tab label="Create from Message" icon="plus" fields='["message", "messageVarName"]'>
			<div style="padding: 8px; margin-bottom: 25px;">
				<message-input dropdownLabel="Source Message" selectId="message" variableContainerId="varNameContainerMessage" variableInputId="messageVarName"></message-input>
			</div>
			<br>
		</tab>
	</tab-system>
	<br><br><br><br><br><br><br>
	
	<div style="float: left; width: calc(50% - 12px);">
		<span class="dbminputlabel">Thread Name</span><br>
		<input id="threadName" class="round" type="text"><br>
	</div>
	<div style="float: right; width: calc(50% - 12px);">
		<span class="dbminputlabel">Auto-Archive Duration</span><br>
		<select id="autoArchiveDuration" class="round">
			<option value="60" selected>1 hour</option>
			<option value="1440">24 hours</option>
			<option value="4320">3 days</option>
			<option value="10080">1 week</option>
			<option value="max">Maximum</option>
		</select><br>
	</div>
	<br><br><br><br>
	
	<div style="width: calc(50% - 12px);">
		<span class="dbminputlabel">Thread Type</span><br>
		<select id="threadType" class="round"">
			<option value="0" selected>Public Thread</option>
			<option value="1">Private Thread</option>
		</select>
	</div>
	<br>
	
	<hr class="subtlebar" style="margin-top: 0px;">
	<br>
	
	<div>
		<span class="dbminputlabel">Reason</span>
		<input id="reason" placeholder="Optional" class="round" type="text">
	</div>
	<br>
	
	<store-in-variable allowNone selectId="storage" variableInputId="storageVarName" variableContainerId="varNameContainer2"></store-in-variable>
</div>
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

    let messageOrChannel = null;

    if (data.fromTarget._index === 0) {
      messageOrChannel = await this.getChannelFromData(data.fromTarget.channel, data.fromTarget.channelVarName, cache);
    } else {
      messageOrChannel = await this.getMessageFromData(data.fromTarget.message, data.fromTarget.messageVarName, cache);
    }

    let type = this.getDBM().DiscordJS.ChannelType.PublicThread;
    switch (data.threadType) {
      case '0':
        type = this.getDBM().DiscordJS.ChannelType.PublicThread;
        break;
      case '1':
        type = this.getDBM().DiscordJS.ChannelType.PrivateThread;
        break;
    }

    // ThreadAutoArchiveDuration
    // https://discord-api-types.dev/api/discord-api-types-v10/enum/ThreadAutoArchiveDuration
    const threadOptions = {
      name: this.evalMessage(data.threadName, cache),
      autoArchiveDuration: data.autoArchiveDuration === 'max' ? 10080 : parseInt(data.autoArchiveDuration, 10),
      type,
    };

    if (data.reason) {
      const reason = this.evalMessage(data.reason, cache);
      threadOptions.reason = reason;
    }

    if (messageOrChannel !== null) {
      if (Array.isArray(messageOrChannel)) {
        this.callListFunc(messageOrChannel, 'startThread', [threadOptions]).then(() => this.callNextAction(cache));
      } else if (messageOrChannel?.startThread) {
        messageOrChannel
          .startThread(threadOptions)
          .then((threadChannel) => {
            const storage = parseInt(data.storage, 10);
            const storageVarName = this.evalMessage(data.storageVarName, cache);
            this.storeValue(threadChannel, storage, storageVarName, cache);
            this.callNextAction(cache);
          })
          .catch((err) => this.displayError(data, cache, err));
      }
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

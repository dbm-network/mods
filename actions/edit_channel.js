module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Edit Any Channel',

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
    const channelTypes = ['Text Channel', 'Voice Channel', 'Thread Channel'];
    return `Edit ${presets.getChannelText(data.channel, data.channelVarName)} as a ${
      channelTypes[data.channelEdits._index ?? 0]
    }`;
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

  fields: ['channel', 'channelVarName', 'channelName', 'reason', 'channelEdits'],

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
<any-channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainer" variableInputId="channelVarName" selectWidth="40%" variableInputWidth="55%"></any-channel-input>

<br><br><br>

<div style="padding-top: 8px;">
	<div style="float: left; width: calc(50% - 12px);">
		<span class="dbminputlabel">Name</span><br>
		<input id="channelName" class="round" type="text" placeholder="Leave blank to not edit!">
	</div>
	<div style="float: right; width: calc(50% - 12px);">
		<span class="dbminputlabel">Reason</span>
		<input id="reason" placeholder="Optional" class="round" type="text">
	</div>
</div>

<br><br><br><br>

<tab-system exclusiveTabData spreadOut id="channelEdits">

	<tab label="Text Channel" icon="sort alphabet down" fields='["topic", "categoryID", "slowmode", "position"]'>
		<div style="padding: 8px;">
			<div style="float: left; width: calc(50% - 12px);">
				<span class="dbminputlabel">Topic</span><br>
				<input id="topic" class="round" type="text" placeholder="Leave blank to not edit!">

				<br>

				<span class="dbminputlabel">Slowmode (seconds)</span><br>
				<input id="slowmode" class="round" type="text" placeholder="Leave blank to not edit!">
			</div>
			<div style="float: right; width: calc(50% - 12px);">
				<span class="dbminputlabel">Category ID</span><br>
				<input id= "categoryID" class="round" type="text" placeholder="Leave blank to not edit!">

				<br>

				<span class="dbminputlabel">Position</span><br>
				<input id="position" class="round" type="text" placeholder="Leave blank to not edit!">
			</div>

			<br><br><br><br><br><br>
		</div>
	</tab>

	<tab label="Voice Channel" icon="assistive listening systems" fields='["regionOverride", "categoryID", "bitrate", "userLimit"]'>
		<div style="padding: 8px;">
			<div style="float: left; width: calc(50% - 12px);">
				<span class="dbminputlabel">Region Override</span><br>
				<select id="regionOverride" class="round">
					<option value="none" selected>Don't Edit</option>
					<option value="auto">Automatic</option>
					<option value="us-west">US West</option>
					<option value="us-east">US East</option>
					<option value="us-central">US Central</option>
					<option value="us-south">US South</option>
					<option value="singapore">Singapore</option>
					<option value="southafrica">South Africa</option>
					<option value="sydney">Sydney</option>
					<option value="europe">Europe</option>
					<option value="brazil">Brazil</option>
					<option value="hongkong">Hong Kong</option>
					<option value="russia">Russia</option>
					<option value="japan">Japan</option>
					<option value="india">India</option>
				</select>

				<br>

				<span class="dbminputlabel">Bitrate</span><br>
				<input id="bitrate" class="round" type="text" placeholder="Leave blank to not edit!">
			</div>
			<div style="float: right; width: calc(50% - 12px);">
				<span class="dbminputlabel">Category ID</span><br>
				<input id= "categoryID" class="round" type="text" placeholder="Leave blank to not edit!">

				<br>

				<span class="dbminputlabel">User Limit</span><br>
				<input id="userLimit" class="round" type="text" placeholder="Leave blank to not edit!">
			</div>

			<br><br><br><br><br><br>
		</div>
	</tab>

	<tab label="Thread Channel" icon="align right" fields='["autoArchiveDuration", "invitable", "slowmode", "locked"]'>
	 <div style="padding: 8px;">
			<div style="float: left; width: calc(50% - 12px);">
				<span class="dbminputlabel">Auto-Archive Duration</span><br>
				<select id="autoArchiveDuration" class="round">
					<option value="none" selected>Don't Edit</option>
					<option value="60">1 hour</option>
					<option value="1440">24 hours</option>
					<option value="4320">3 days (requires boost LVL 1)</option>
					<option value="10080">1 week (requires boost LVL 2)</option>
					<option value="max">Maximum</option>
				</select>

				<br>

				<span class="dbminputlabel">Slowmode (seconds)</span><br>
				<input id="slowmode" class="round" type="text" placeholder="Leave blank to not edit!">
			</div>
			<div style="float: right; width: calc(50% - 12px);">
				<span class="dbminputlabel">Allow Everyone to Invite</span><br>
				<select id="invitable" class="round">
					<option value="none" selected>Don't Edit</option>
					<option value="true">Yes</option>
					<option value="false">No</option>
				</select>

				<br>

				<span class="dbminputlabel">Set Locked</span><br>
				<select id="locked" class="round">
					<option value="none" selected>Don't Edit</option>
					<option value="true">Yes</option>
					<option value="false">No</option>
				</select>
			</div>

			<br><br><br><br><br><br>
		</div>
	</tab>

</tab-system>`;
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
    const reason = this.evalMessage(data.reason, cache);

    const channelData = {};
    if (data.channelName) {
      channelData.name = this.evalMessage(data.channelName, cache);
    }

    const channelEditData = data.channelEdits;

    switch (channelEditData._index) {
      // text
      case 0: {
        if (channelEditData.topic) {
          channelData.topic = this.evalMessage(channelEditData.topic, cache);
        }
        if (channelEditData.categoryID) {
          channelData.parent = this.evalMessage(channelEditData.categoryID, cache);
        }
        if (channelEditData.slowmode) {
          channelData.rateLimitPerUser = parseInt(this.evalMessage(channelEditData.slowmode, cache), 10);
        }
        if (channelEditData.position) {
          channelData.position = parseInt(this.evalMessage(channelEditData.position, cache), 10);
        }
        break;
      }

      // voice
      case 1: {
        if (channelEditData.regionOverride !== 'none') {
          channelData.rtcRegion = channelEditData.regionOverride === 'auto' ? null : channelEditData.regionOverride;
        }
        if (channelEditData.categoryID) {
          channelData.parent = this.evalMessage(channelEditData.categoryID, cache);
        }
        if (channelEditData.bitrate) {
          channelData.bitrate = parseInt(this.evalMessage(channelEditData.bitrate, cache), 10);
        }
        if (channelEditData.userLimit) {
          channelData.userLimit = parseInt(this.evalMessage(channelEditData.userLimit, cache), 10);
        }
        break;
      }

      // thread
      case 2: {
        if (channelEditData.autoArchiveDuration !== 'none') {
          channelData.autoArchiveDuration =
            channelEditData.autoArchiveDuration === 'max' ? 'max' : parseInt(channelEditData.autoArchiveDuration, 10);
        }
        if (channelEditData.invitable !== 'none') {
          channelData.invitable = channelEditData.invitable === 'true';
        }
        if (channelEditData.slowmode) {
          channelData.rateLimitPerUser = parseInt(this.evalMessage(channelEditData.slowmode, cache), 10);
        }
        if (channelEditData.locked !== 'none') {
          channelData.locked = channelEditData.locked === 'true';
        }
        break;
      }
    }
    channelData.reason = reason;

    const channelStorage = parseInt(data.channel, 10);
    const channelVarName = this.evalMessage(data.channelVarName, cache);
    const channel = await this.getAnyChannel(channelStorage, channelVarName, cache);

    if (Array.isArray(channel)) {
      this.callListFunc(channel, 'edit', [channelData]).then(() => this.callNextAction(cache));
    } else if (channel?.edit) {
      channel
        .edit(channelData)
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

module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Create Forum Channel',

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

  subtitle(data) {
    return `${data.channelName}`;
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

  meta: { version: '2.2.0', preciseCheck: true, author: null, authorUrl: null, downloadURL: null },

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Channel'];
  },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  // ---------------------------------------------------------------------

  fields: ['channelName', 'topic', 'position', 'storage', 'varName', 'categoryID', 'options'],

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

  html() {
    return `
<div style="height: 350px; overflow-y: scroll; overflow-x: hidden;">
	<div style="float: left; width: 100%; padding-top: 8px;">
		<span class="dbminputlabel">Name</span>
		<input id="channelName" class="round" type="text">
	</div>

	<div style="float: left; width: 100%; padding-top: 16px;">
		<span class="dbminputlabel">Guidelines</span>
		<textarea id="topic" rows="3" style="white-space: nowrap;"></textarea>
	</div>
	
	<div style="float: left; width: 100%;">
		<div style="float: left; width: 60%; padding-top: 16px;">
			<span class="dbminputlabel">Category ID</span><br>
			<input id= "categoryID" class="round" type="text" placeholder="Leave blank for no category">
		</div>

		<div style="float: right; width: 35%; padding-top: 16px;">
			<span class="dbminputlabel">Position</span><br>
			<input id="position" class="round" type="text" placeholder="Leave blank for default">
		</div>
	</div>

	<br><br><br><br><br><br><br><br><br><br><br><br>

	<div style="padding-top: 8px">
		<span class="dbminputlabel">Extra Options</span>
		<dialog-button
			id="options"
			style="width: 100%;"
			fields='[
				"defaultSortType",
				"defaultForumLayout",
				"rateLimitPerUser",
				"autoArchiveDuration",
				"reason",
				"tags"
			]'
			dialogTitle="Forum Channel Options"
			dialogWidth="600"
			dialogHeight="430"
			dialogResizable="false"
			saveButtonText="Save Actions"
			saveButtonIcon="star"
			buttonTextFunction="
				'(' +
				(data.defaultSortType === '1' ? 'Creation Date' : 'Latest Activity') +
				', ' + (data.defaultForumLayout === '2' ? 'Gallery View' : 'List View') +
				', ' + (data.rateLimitPerUser || '[no rate limit]') +
				', ' + (data.reason || '[no reason]') +
				')'
			"
		>
			<div style="padding: 16px;">
				<div style="padding-top: 8px; float: left; width: calc(50% - 12px);">
					<span class="dbminputlabel">Default Sort Type</span><br>
					<select id="defaultSortType" class="round">
						<option value="1" selected>Creation Date</option>
						<option value="0">Latest Activity</option>
					</select>

					<br>

					<span class="dbminputlabel">Default Layout Type</span><br>
					<select id="defaultForumLayout" class="round">
						<option value="2" selected>Gallery View</option>
						<option value="1">List View</option>
					</select>

					<br>

					<span class="dbminputlabel">Rate Limit Per User</span><br>
					<input id="rateLimitPerUser" class="round" type="text" placeholder="Leave blank to disable">

					<br>

					<span class="dbminputlabel">Auto-Archive Duration</span><br>
					<select id="autoArchiveDuration" class="round">
						<option value="60" selected>1 hour</option>
						<option value="1440">24 hours</option>
						<option value="4320">3 days</option>
						<option value="10080">1 week</option>
						<option value="max">Maximum</option>
					</select>

					<br>

					<span class="dbminputlabel">Reason</span>
					<input id="reason" placeholder="Optional" class="round" type="text">
				</div>
				<div style="width: calc(50% - 12px); float: right">
					<dialog-list
						id="tags"
						fields='[
							"name",
							"moderated",
							"emoji"
						]'
						dialogTitle="Tag Info"
						dialogWidth="400"
						dialogHeight="300"
						listLabel="Available Tags"
						listStyle="height: calc(100vh - 150px);"
						itemName="Tag"
						itemCols="1"
						itemHeight="30px;"
						itemTextFunction="data.name"
						itemStyle="text-align: left; line-height: 30px;"
					>
						<div style="padding: 16px;">
							<span class="dbminputlabel">Name</span>
							<input id="name" class="round" type="text">

							<br>

							<span class="dbminputlabel">Moderated</span>
							<input id="moderated" placeholder="'Yes' or 'No'" class="round" type="text">

							<br>

							<span class="dbminputlabel">Emoji</span>
							<input id="emoji" placeholder="Leave blank for none..." class="round" type="text">
						</div>
					</dialog-list>
				</div>
			</div>
		</dialog-button>
	</div>

	<br>

	<div style="float: left; width: 100%;">
		<store-in-variable allowNone dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
	</div>
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
    const { server } = cache;

    if (!server) {
      this.callNextAction();
      return;
    }

    const channelData = {
      name: this.evalMessage(data.channelName, cache),
      type: this.getDBM().DiscordJS.ChannelType.GuildForum,
    };

    if (data.topic) {
      channelData.topic = this.evalMessage(data.topic, cache);
    }
    if (data.position) {
      channelData.position = parseInt(this.evalMessage(data.position, cache), 10);
    }
    if (data.categoryID) {
      channelData.parent = this.evalMessage(data.categoryID, cache);
    }
    if (data.options.rateLimitPerUser) {
      channelData.rateLimitPerUser = parseInt(this.evalMessage(data.options.rateLimitPerUser, cache), 10);
    }
    if (data.options.reason) {
      channelData.reason = this.evalMessage(data.options.reason, cache);
    }

    // ThreadAutoArchiveDuration
    // https://discord-api-types.dev/api/discord-api-types-v10/enum/ThreadAutoArchiveDuration
    channelData.autoArchiveDuration =
      data.options.autoArchiveDuration === 'max' ? 10080 : parseInt(data.autoArchiveDuration, 10);

    // SortOrderType
    // https://discord-api-types.dev/api/discord-api-types-v10/enum/SortOrderType
    channelData.defaultSortOrder = parseInt(data.options.defaultSortType, 10);

    // ForumLayoutType
    // https://discord-api-types.dev/api/discord-api-types-v10/enum/ForumLayoutType
    channelData.defaultForumLayout = parseInt(data.options.defaultForumLayout, 10);

    // GuildForumTagData
    // https://discord.js.org/#/docs/discord.js/main/typedef/GuildForumTagData
    if (data.options.tags.length > 0) {
      channelData.availableTags = data.options.tags.map((tagData) => {
        const result = {
          name: this.evalMessage(tagData.name, cache),
          moderated: tagData.moderated === 'yes',
        };
        if (tagData.emoji) {
          result.emoji = this.evalMessage(tagData.emoji, cache);
        }
        return result;
      });
    }

    server.channels
      .create(channelData)
      .then((channel) => {
        const storage = parseInt(data.storage, 10);
        const varName = this.evalMessage(data.varName, cache);
        this.storeValue(channel, storage, varName, cache);
        this.executeResults(true, data?.branch ?? data, cache);
      })
      .catch((err) => this.displayError(data, cache, err));
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

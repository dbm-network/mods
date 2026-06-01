module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Set Bot Game',

  // ---------------------------------------------------------------------
  // Action Display Name
  //
  // Overrides the name that appears in the editor.
  // ---------------------------------------------------------------------

  displayName: 'Set Bot Activity',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Bot Client Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const activityPrefix = {
      PLAYING: 'Playing',
      STREAMING: 'Streaming',
      LISTENING: 'Listening to',
      WATCHING: 'Watching',
      COMPETING: 'Competing in',
    };
    return `${activityPrefix[data.activityType]} ${data.gameName}${data.gameLink ? ` [${data.gameLink}]` : ''}`;
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

  fields: ['gameName', 'gameLink', 'activityType'],

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
<span class="dbminputlabel">Game Name</span><br>
<input id="gameName" class="round" type="text">

<br>

<span class="dbminputlabel">Twitch Stream Link</span><br>
<input id="gameLink" class="round" type="text" placeholder="Leave blank to disallow! If set, overrules the activity type">

<br>

<span class="dbminputlabel">Activity Type</span>
<select id="activityType" class="round">
	<option value="PLAYING" selected>Playing</option>
	<option value="STREAMING">Streaming</option>
	<option value="LISTENING">Listening</option>
	<option value="WATCHING">Watching</option>
	<option value="COMPETING">Competing</option>
</select>
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

  action(cache) {
    const botClient = this.getDBM().Bot.bot.user;
    const data = cache.actions[cache.index];
    const name = this.evalMessage(data.gameName, cache);
    const url = this.evalMessage(data.gameLink, cache);

    const { ActivityType } = this.getDBM().DiscordJS;

    if (url) {
      botClient.setActivity(name, { type: ActivityType.Streaming, url });
    } else {
      let type = ActivityType.Playing;
      switch (data.activityType) {
        case 'PLAYING':
          type = ActivityType.Playing;
        case 'STREAMING':
          type = ActivityType.Streaming;
        case 'LISTENING':
          type = ActivityType.Listening;
        case 'WATCHING':
          type = ActivityType.Watching;
        case 'COMPETING':
          type = ActivityType.Competing;
      }

      botClient.setActivity(name, { type });
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

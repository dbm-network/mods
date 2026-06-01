module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Create Embed Message',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Embed Message',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `${data.title}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Embed Message Data'];
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

  fields: ['title', 'author', 'color', 'timestamp', 'url', 'authorIcon', 'imageUrl', 'thumbUrl', 'storage', 'varName'],

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
<div style="float: left; width: calc(50% - 12px);">
	<span class="dbminputlabel">Title</span><br>
	<input id="title" class="round" type="text"><br>
	<span class="dbminputlabel">Author</span><br>
	<input id="author" class="round" type="text" placeholder="Leave blank to disallow author!"><br>
	<span class="dbminputlabel">Color</span><br>
	<input id="color" class="round" type="text" placeholder="Leave blank for default!"><br>
	<span class="dbminputlabel">Use Timestamp</span><br>
	<select id="timestamp" class="round">
		<option value="true">Yes</option>
		<option value="false" selected>No</option>
	</select><br>
</div>

<div style="float: right; width: calc(50% - 12px);">
	<span class="dbminputlabel">URL</span><br>
	<input id="url" class="round" type="text" placeholder="Leave blank for none!"><br>
	<span class="dbminputlabel">Author Icon URL</span><br>
	<input id="authorIcon" class="round" type="text" placeholder="Leave blank for none!"><br>
	<span class="dbminputlabel">Image URL</span><br>
	<input id="imageUrl" class="round" type="text" placeholder="Leave blank for none!"><br>
	<span class="dbminputlabel">Thumbnail URL</span><br>
	<input id="thumbUrl" class="round" type="text" placeholder="Leave blank for none!"><br>
</div>

<br><br><br><br><br><br><br><br><br><br><br><br><br><br>

<hr class="subtlebar">

<br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>`;
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
    const data = cache.actions[cache.index];
    const { EmbedBuilder } = this.getDBM().DiscordJS;
    const embed = new EmbedBuilder();
    if (data.title) {
      embed.setTitle(this.evalMessage(data.title, cache));
    }
    if (data.url) {
      embed.setURL(this.evalMessage(data.url, cache));
    }
    if (data.author && data.authorIcon) {
      embed.setAuthor({
        name: this.evalMessage(data.author, cache),
        iconURL: this.evalMessage(data.authorIcon, cache),
      });
    }
    if (data.color) {
      embed.setColor(this.evalMessage(data.color, cache));
    }
    if (data.imageUrl) {
      embed.setImage(this.evalMessage(data.imageUrl, cache));
    }
    if (data.thumbUrl) {
      embed.setThumbnail(this.evalMessage(data.thumbUrl, cache));
    }
    if (data.timestamp === 'true') {
      embed.setTimestamp();
    }
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(embed, storage, varName, cache);
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

  mod(DBM) {},
};

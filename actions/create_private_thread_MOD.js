module.exports = {
    //---------------------------------------------------------------------
    // Action Name
    //
    // This is the name of the action displayed in the editor.
    //---------------------------------------------------------------------

    name: "Create Private Thread MOD",

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
        return `Create Private Thread In ${presets.getChannelText(data.channel ?? 0, data.channelVarName)}`;
    },

    //---------------------------------------------------------------------
    // Action Storage Function
    //
    // Stores the relevant variable info for the editor.
    //---------------------------------------------------------------------

    variableStorage(data, varType) {
        const type = parseInt(data.storage, 10);
        if (type !== varType) return;
        return [data.storageVarName, "Canal"];
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

    meta: {
        version: '2.1.7',
        preciseCheck: true, 
        author: 'DBM Mods',
        authorUrl: 'https://github.com/dbm-network/mods',
        downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/create_private_thread_MOD.js',
    },

    //---------------------------------------------------------------------
    // Action Fields
    //
    // These are the fields for the action. These fields are customized
    // by creating elements with corresponding IDs in the HTML. These
    // are also the names of the fields stored in the action's JSON data.
    //---------------------------------------------------------------------

    fields: ["channel", "channelVarName", "threadName", "autoArchiveDuration", "reason", "storage", "storageVarName"],

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
  <channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainerChannel" variableInputId="channelVarName"></channel-input>
  
  <br><br><br><br>
  
  <div style="float: left; width: calc(50% - 12px);">
  
    <span class="dbminputlabel">Thread Name</span><br>
    <input id="threadName" class="round" type="text"><br>
  
  </div>
  <div style="float: right; width: calc(50% - 12px);">
  
    <span class="dbminputlabel">Auto-Archive Duration</span><br>
    <select id="autoArchiveDuration" class="round">
      <option value="60" selected>1 Hour</option>
      <option value="1440">24 Hours</option>
      <option value="4320">3 Days</option>
      <option value="10080">1 Week</option>
      <option value="max">Maximum</option>
    </select><br>
  
  </div>
  
  <br><br><br><br>
  
  <hr class="subtlebar" style="margin-top: 0px;">
  
  <br>
  
  <div>
    <span class="dbminputlabel">Reason</span>
    <input id="reason" placeholder="Opcional" class="round" type="text">
  </div>
  
  <br>
  
  <store-in-variable allowNone selectId="storage" variableInputId="storageVarName" variableContainerId="varNameContainer2"></store-in-variable>`;
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

    async action(cache) {
        const data = cache.actions[cache.index];
        const channel = await this.getChannelFromData(data.channel, data.channelVarName, cache);

        const thread = await channel.threads.create({
            name: this.evalMessage(data.threadName, cache),
            autoArchiveDuration: data.autoArchiveDuration === "max" ? 10080 : parseInt(data.autoArchiveDuration, 10),
            type: "PrivateThread",
            reason: this.evalMessage(data.reason, cache) || null
        });

        const storage = parseInt(data.storage, 10);
        const storageVarName = this.evalMessage(data.storageVarName, cache);
        this.storeValue(thread, storage, storageVarName, cache);

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

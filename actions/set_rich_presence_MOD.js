module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Set Rich Presence',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Other Stuff',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data) {
    return `Client ID: ${data.clientId}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  //
  // Provides meta-information about the custom action.
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action that the user can customize.
  // ---------------------------------------------------------------------

  fields: [
    'clientId',
    'state',
    'details',
    'startTimestamp',
    'endTimestamp',
    'largeImageKey',
    'largeImageText',
    'smallImageKey',
    'smallImageText',
    'partyId',
    'partySize',
    'partyMax',
    'joinSecret',
  ],

  // ---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns the HTML to display the fields.
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
 <div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.1</a></div>
  

    <div style="display: flex; flex-wrap: wrap; gap: 8px; justify-content: space-between;">
      <!-- State & Details -->
      <div style="flex: 1; min-width: 200px;">
        <span class="dbminputlabel">State</span><br>
        <input id="state" class="round" type="text" value="Playing Solo" placeholder="Required...">
      </div>
      <div style="flex: 1; min-width: 200px;">
        <span class="dbminputlabel">Details</span><br>
        <input id="details" class="round" type="text" value="Competitive" placeholder="Required...">
      </div>

      <!-- Start Timestamp & End Timestamp -->
      <div style="flex: 1; min-width: 200px;">
        <span class="dbminputlabel">Start Timestamp</span><br>
        <input id="startTimestamp" class="round" type="text" placeholder="Leave blank for none...">
      </div>
      <div style="flex: 1; min-width: 200px;">
        <span class="dbminputlabel">End Timestamp</span><br>
        <input id="endTimestamp" class="round" type="text" placeholder="Leave blank for none...">
      </div>

      <!-- Large Image Key & Large Image Text -->
      <div style="flex: 1; min-width: 200px;">
        <span class="dbminputlabel">Large Image Key</span><br>
        <input id="largeImageKey" class="round" type="text" placeholder="Leave blank for default...">
      </div>
      <div style="flex: 1; min-width: 200px;">
        <span class="dbminputlabel">Large Image Text</span><br>
        <input id="largeImageText" class="round" type="text" placeholder="Leave blank for default...">
      </div>

      <!-- Small Image Key & Small Image Text -->
      <div style="flex: 1; min-width: 200px;">
        <span class="dbminputlabel">Small Image Key</span><br>
        <input id="smallImageKey" class="round" type="text" placeholder="Leave blank for none...">
      </div>
      <div style="flex: 1; min-width: 200px;">
        <span class="dbminputlabel">Small Image Text</span><br>
        <input id="smallImageText" class="round" type="text" placeholder="Leave blank for none...">
      </div>

      <!-- Party ID & Join Secret -->
      <div style="flex: 1; min-width: 200px;">
        <span class="dbminputlabel">Party ID</span><br>
        <input id="partyId" class="round" type="text" placeholder="required...">
      </div>
      <div style="flex: 1; min-width: 200px;">
        <span class="dbminputlabel">Join Secret</span><br>
        <input id="joinSecret" class="round" type="text" placeholder="Leave blank for none...">
      </div>

      <!-- Party Size & Party Max -->
      <div style="flex: 1; min-width: 200px;">
        <span class="dbminputlabel">Party Size</span><br>
        <input id="partySize" class="round" type="text" value="1" placeholder="Leave blank for none...">
      </div>
      <div style="flex: 1; min-width: 200px;">
        <span class="dbminputlabel">Party Max</span><br>
        <input id="partyMax" class="round" type="text" value="5" placeholder="Leave blank for none...">
      </div>

      <!-- Client ID (Full Width) -->
      <div style="width: 100%;">
        <span class="dbminputlabel">Client ID</span><br>
        <input id="clientId" class="round" type="text" placeholder="required...">
      </div>
    </div>
  `;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // Initializes the action's HTML elements when the editor is loaded.
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  //
  // The function for the action within the Bot's Action class.
  // ---------------------------------------------------------------------

  action(cache) {
    process.emitWarning = (message, type, code, ctor) => {
      if (type === 'DeprecationWarning' && message.includes('punycode')) {
        return;
      }

      return process.__emitWarning(message, type, code, ctor);
    };

    const data = cache.actions[cache.index];
    const { Client } = require('discord-rpc');
    const rpc = new Client({ transport: 'ipc' });

    rpc.on('ready', () => {
      rpc.setActivity({
        state: this.evalMessage(data.state, cache),
        details: this.evalMessage(data.details, cache),
        startTimestamp: this.evalMessage(data.startTimestamp, cache) * 1000,
        endTimestamp: this.evalMessage(data.endTimestamp, cache) * 1000,
        largeImageKey: this.evalMessage(data.largeImageKey, cache),
        largeImageText: this.evalMessage(data.largeImageText, cache),
        smallImageKey: this.evalMessage(data.smallImageKey, cache),
        smallImageText: this.evalMessage(data.smallImageText, cache),
        partyId: this.evalMessage(data.partyId, cache),
        partySize: parseInt(this.evalMessage(data.partySize, cache), 10),
        partyMax: parseInt(this.evalMessage(data.partyMax, cache), 10),
        joinSecret: this.evalMessage(data.joinSecret, cache),
        instance: false,
      });
    });

    rpc.login({ clientId: this.evalMessage(data.clientId, cache) }).catch((err) => {
      if (err.message.includes('connection closed')) {
        return;
      }
      console.error('Discord login error:', err);
    });

    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Modifies the bot's existing functions if necessary.
  // ---------------------------------------------------------------------

  mod() {},
};

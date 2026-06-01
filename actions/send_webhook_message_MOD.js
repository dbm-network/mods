module.exports = {
  // ---------------------------------------------------------------------
  // region Action Name
  // ---------------------------------------------------------------------

  name: 'Send Webhook Message',

  // ---------------------------------------------------------------------
  // region Action Section
  // ---------------------------------------------------------------------

  section: 'Messaging',

  // ---------------------------------------------------------------------
  // region Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data) {
    return `Sending a message with webhook: ${data.varName || 'No Webhook'}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName3, 'Message Object'];
  },

  // ---------------------------------------------------------------------
  // region Action Fields
  // ---------------------------------------------------------------------

  fields: ['webhook', 'varName', 'message', 'varName2', 'storage', 'varName3'],

  // ---------------------------------------------------------------------
  // region Command HTML
  // ---------------------------------------------------------------------

  html() {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.0</a></div>

<div>
  <retrieve-from-variable dropdownLabel="Source Webhook" selectId="webhook" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>
</div>

<br><br><br><br>

<div>
  <retrieve-from-variable dropdownLabel="Source Message" selectId="message" variableContainerId="varNameContainer2" variableInputId="varName2"></retrieve-from-variable>
</div>

<br><br><br><br><br><br>

<div>
<store-in-variable allowNone dropdownLabel="Store Message In" selectId="storage" variableContainerId="varNameContainer3" variableInputId="varName3"></store-in-variable>
</div>
`;
  },

  // ---------------------------------------------------------------------
  // region Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // region Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];

    const webhookType = parseInt(data.webhook, 10);
    const webhookVar = this.evalMessage(data.varName, cache);
    const webhook = this.getVariable(webhookType, webhookVar, cache);

    const messageType = parseInt(data.message, 10);
    const messageVar = this.evalMessage(data.varName2, cache);
    const messageData = this.getVariable(messageType, messageVar, cache);

    if (!webhook || typeof webhook.send !== 'function') {
      return this.callNextAction(cache);
    }

    try {
      const sentMessage = await webhook.send(messageData);

      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName3, cache);
      this.storeValue(sentMessage, storage, varName2, cache);
    } catch (error) {
      console.error(error);
    }

    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // region Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};

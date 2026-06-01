module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Delete Guild Scheduled Event',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Guild Scheduled Events',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Delete Guild Event: ${data.name || 'No Name'}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['storage', 'varName', 'reason'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.0</a></div>

    <retrieve-from-variable allowSlashParams dropdownLabel="Source Event" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>

     <br><br><br><br>
      <span class="dbminputlabel">Reason (optional)</span><br>
      <input id="reason" class="round" type="text" placeholder="Reason for audit log (optional)">
`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const event = this.getVariable(type, varName, cache);

    const reason = this.evalMessage(data.reason, cache);

    try {
      if (event && typeof event.delete === 'function') {
        await event.delete(reason || undefined);
      } else {
        let eventId;
        if (typeof event === 'string') {
          const match = event.match(/event=(\d+)/);
          eventId = match ? match[1] : event;
        }

        if (!eventId) throw new Error('No valid event ID found!');

        const server = cache.server || cache.interaction?.guild;
        if (!server) throw new Error('No server context available!');

        const fetchedEvent = await server.scheduledEvents.fetch(eventId);
        if (fetchedEvent) {
          await fetchedEvent.delete(reason || undefined);
        } else {
          throw new Error('Event not found!');
        }
      }
    } catch (err) {
      console.error(`Failed to delete event:`, err);
    }

    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};

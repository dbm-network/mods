module.exports = {
  name: 'Convert Seconds To Timestamp',
  section: 'Other Stuff',
  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods',
  },

  subtitle(data) {
    return `Convert ${data.time}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'String'];
  },

  fields: ['time', 'storage', 'varName'],

  html() {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.1</a></div>
  

  <div style="float: left; width: 70%; padding-top: 8px;">
    <span class="dbminputlabel">Seconds to Convert</span>
    <input id="time" class="round" type="text" placeholder="e.g. 1522672056 or use Variables">
  </div>
  <br><br><br><br>
  
  <div>
    <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
  </div>
  `;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const time = this.evalMessage(data.time, cache);

    if (isNaN(time)) return this.callNextAction(cache);

    const futureTimestamp = Math.floor(Date.now() / 1000) + parseInt(time, 10);

    const discordTimestamp = `<t:${futureTimestamp}:R>`; // Format Discorda: <t:timestamp:R>

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(discordTimestamp, storage, varName, cache);

    this.callNextAction(cache);
  },

  mod() {},
};

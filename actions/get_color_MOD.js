module.exports = {
  name: 'Get Color',
  section: 'Other Stuff',
  eta: {
    version: '3.2.5',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods',
  },

  subtitle(data) {
    return `Get color: <font color="${data.color || '#000000'}">${data.color || 'No Color Selected'}</font>`;
  },

  fields: ['color', 'storage', 'varName2'],

  html() {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.1</a></div>
  

  <div style="margin-bottom: 10px;">
  <span class="dbminputlabel">Color</span><br>
  <input type="color" id="color" class="round" style="height: 50px;">
</div>

  
        <hr class="subtlebar" style="width: 100%; margin-top: 30px; margin-bottom: 30px;">

        <store-in-variable 
          dropdownLabel="Store In" 
          selectId="storage" 
          variableContainerId="varNameContainer2" 
          variableInputId="varName2">
        </store-in-variable>
      `;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const color = this.evalMessage(data.color, cache);
    const storage = parseInt(data.storage, 10);
    const varName2 = this.evalMessage(data.varName2, cache);

    if (color) {
      this.storeValue(color, storage, varName2, cache);
    }

    this.callNextAction(cache);
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, 'Color HEX'];
  },

  mod() {},
};

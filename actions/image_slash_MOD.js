module.exports = {
  name: 'Find Slash Image',

  section: 'Messaging',

  subtitle(data, presets) {
    return 'Action created by DBM Extended';
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'PhotoUrl'];
  },

  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  fields: ['PhotoUrl', 'storage', 'varName'],

  html(isEvent, data) {
    return `
  <div>
      <div style="float: left; width: 100%;">
          <span class="dbminputlabel">Nazwa parametru</span><br>
          <input id="PhotoUrl" class="round" type="text">
      </div>
  </div>
  
  <br><br><br>
  
  <store-in-variable style="padding-top: 8px;" dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName" selectWidth="40%" variableInputWidth="55%"></store-in-variable>
  <br><br><br><br><br><br><br>
  <p>Jeżeli ci nie działa napisz do mnie w wiadomośći prywatnej!</p>`;
  },

  init() {},

  action(cache) {
    const data = cache.actions[cache.index];
    const interaction = cache.interaction;
    const PhotoUrl = this.evalMessage(data.PhotoUrl, cache);
    const slashcmd = interaction.options.getAttachment(PhotoUrl);
    const result = slashcmd.url;
    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};

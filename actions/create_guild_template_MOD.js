module.exports = {
  name: 'Create Guild Template',

  section: 'DBM Extended',

  subtitle(data, presets) {
    return `Action created by DBM Extended`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    const dataType = 'Template URL';
    return [data.varName2, dataType];
  },

  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBMExtended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadUrl: 'https://github.com/DBM-Extended/mods',
  },

  fields: ['server', 'varName', 'name2', 'description', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
<server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>

<br><br><br><br>
<div style="float: left; width: 50%;">
<span class="dbminputlabel">Name</span><br>
<input id="name2" class="round" type="text">
</div>
<br><br><br><br>
<div style="float: left; width: 50%;">
<span class="dbminputlabel">Description</span><br>
<input id="description" class="round" type="text">
</div><br><br><br>

<div style="padding-top: 16px;">
<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const targetServer = await this.getServerFromData(data.server, data.varName, cache);
    const name = this.evalMessage(data.name2, cache);
    const description = this.evalMessage(data.description, cache);
    targetServer
      .createTemplate(name, description)
      .then((template) => {
        const storage = parseInt(data.storage, 10);
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(template.url, storage, varName2, cache);
        this.callNextAction(cache);
      })
      .catch((err) => this.displayError(data, cache, err));
  },

  mod() {},
};

module.exports = {
  name: 'Store Attachment Info',
  section: 'Messaging',
  fields: ['storage', 'varName', 'info', 'storage2', 'varName2'],
  meta: {
    version: '2.1.1',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_attachment_info_MOD.js',
  },

  subtitle({ info }) {
    const names = [
      "Attachment's URL",
      "Attachment File's Name",
      "Attachment's Height",
      "Attachment's Width",
      'This option has been removed',
      "Attachment File's Size",
    ];
    return `${names[parseInt(info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [
      data.varName2,
      ['URL', 'File Name', 'Number', null, 'File Size'][parseInt(data.info, 10)] || 'Message Attachment (Unknown) Info',
    ];
  },

  html(isEvent, data) {
    return `
<div style="float: left; width: 35%; padding-top: 8px;">
  Source Message:<br>
  <select id="storage" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
    ${data.messages[isEvent ? 1 : 0]}
  </select>
</div>
<div id="varNameContainer" style="display: none; float: right; width: 60%; padding-top: 8px;">
  Variable Name:<br>
  <input id="varName" class="round" type="text" list="variableList"><br>
</div><br><br>
<div style="float: left; width: 80%; padding-top: 8px;">
  Source Info:<br>
  <select id="info" class="round">
    <option value="0">Attachment's URL</option>
    <option value="1">Attachment File's Name</option>
    <option value="2">Attachment's Height</option>
    <option value="3">Attachment's Width</option>
    <option value="5">Attachment File's Size (KB)</option>
  </select>
</div><br><br>
<div style="float: left; width: 35%; padding-top: 8px;">
  Store In:<br>
  <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')>
    ${data.variables[0]}
  </select>
</div>
<div id="varNameContainer2" style="float: right; width: 60%; padding-top: 8px;">
  Variable Name:<br>
  <input id="varName2" class="round" type="text"><br>
</div>`;
  },

  init() {
    const { document, glob } = this;
    glob.messageChange(document.getElementById('storage'), 'varNameContainer');
    glob.variableChange(document.getElementById('storage2'), 'varNameContainer2');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const message = await this.getMessage(storage, varName, cache);
    const info = parseInt(data.info, 10);

    const attachments = [...message.attachments.values()];

    if (attachments.length > 0) {
      const attachment = attachments[0];

      const result = [
        attachment.url,
        attachment.name,
        attachment.height,
        attachment.width,
        null,
        Math.floor(attachment.size / 1000),
      ][info];

      if (result !== undefined) {
        const storage2 = parseInt(data.storage2, 10);
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(result, storage2, varName2, cache);
      }
    }
    this.callNextAction(cache);
  },

  mod() {},
};

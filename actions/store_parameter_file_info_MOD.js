module.exports = {
  name: 'Store Parameter File Info',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data, presets) {
    const info = [
      'File Object',
      'File ID',
      'File URL',
      'File Name',
      'File Size',
      'File Type',
      'Image Width',
      'Image height',
    ];
    return `${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    const prse2 = parseInt(data.info, 10);
    const info2 = ['Object', 'ID', 'URL Image', 'Name', 'Size', 'Type', 'Width', 'Height'];
    if (type !== varType) return;
    return [data.varName2, info2[prse2]];
  },

  fields: ['parametro', 'info', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
    <div>
    <div style="float: left; width: 100%;">
        <span class="dbminputlabel">Parameter name</span><br>
        <input id="parametro" class="round" type="text">
    </div>
</div>
<br><br><br>
<div style="padding-top: 8px;">
	<span class="dbminputlabel">Information</span><br>
	<select id="info" class="round">
  <option value="0" selected>File Object</option>
  <option value="1">File ID</option>
  <option value="2">File URL</option>
  <option value="3">File Name</option>
  <option value="4">File Size</option>
	<option value="5">File Type</option>
  <option value="6">Image Width [Pixel]</option>
  <option value="7">Image Height [Pixel]</option>
	</select>
</div>

<br>
<div style="float: left; width: 35%; padding-top: 8px;">
<span class="dbminputlabel">Result in</span><br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
		${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
  <span class="dbminputlabel">Variable Name</span><br>
		<input id="varName2" class="round" type="text">
	</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const interaction = cache.interaction;
    const parametro = this.evalMessage(data.parametro, cache);
    const info = parseInt(data.info, 10);

    let result;
    switch (info) {
      case 0:
        result = interaction.options._hoistedOptions.find(
          (f) => f.type === 'ATTACHMENT' && f.name === parametro,
        ).attachment;
        break;
      case 1:
        result = interaction.options._hoistedOptions.find((f) => f.type === 'ATTACHMENT' && f.name === parametro)
          .attachment.id;
        break;
      case 2:
        result = interaction.options._hoistedOptions.find((f) => f.type === 'ATTACHMENT' && f.name === parametro)
          .attachment.attachment;
        break;
      case 3:
        result = interaction.options._hoistedOptions.find((f) => f.type === 'ATTACHMENT' && f.name === parametro)
          .attachment.name;
        break;
      case 4:
        result = interaction.options._hoistedOptions.find((f) => f.type === 'ATTACHMENT' && f.name === parametro)
          .attachment.size;
        break;
      case 5:
        result = interaction.options._hoistedOptions.find((f) => f.type === 'ATTACHMENT' && f.name === parametro)
          .attachment.contentType;
        break;
      case 6:
        result = interaction.options._hoistedOptions.find((f) => f.type === 'ATTACHMENT' && f.name === parametro)
          .attachment.width;
        break;
      case 7:
        result = interaction.options._hoistedOptions.find((f) => f.type === 'ATTACHMENT' && f.name === parametro)
          .attachment.height;
        break;
      default:
        break;
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};

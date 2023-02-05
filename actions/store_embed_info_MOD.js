module.exports = {
  name: 'Store Embed Info',
  section: 'Embed Message',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_embed_info_MOD.js',
  },

  subtitle(data) {
    return (
      [
        'Object',
        'Title',
        'Description',
        'Author Name',
        'Author Icon URL',
        'Thumbnail URL',
        'Footer Text',
        'Footer Icon URL',
        'Image',
        'Color',
        'Fields',
      ][parseInt(data.info, 10)] || 'Unknown'
    );
  },

  fields: ['message', 'varName', 'info', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
<div>
	<div style="float: left; width: 35%;">
		Source Embed Object:<br>
		<select id="message" class="round" onchange="glob.messageChange(this, 'varNameContainer')">
			${data.messages[isEvent ? 1 : 0]}
		</select>
	</div>
	<div id="varNameContainer" style="display: none; float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName" class="round" type="text" list="variableList"><br>
	</div>
</div><br><br><br>
<div>
	<div style="padding-top: 8px; width: 70%;">
		Source Info:<br>
		<select id="info" class="round">
			<option value="0" selected>Object</option>
			<option value="1">Title</option>
			<option value="2">Description</option>
			<option value="3">Author Name</option>
			<option value="4">Author Icon URL</option>
			<option value="5">Thumbnail URL</option>
			<option value="6">Footer Text</option>
      <option value="7">Footer Icon URL</option>
      <option value="8">Image</option>
			<option value="9">Color</option>
			<option value="10">Fields</option>
		</select>
	</div>
</div><br>
<div>
	<div style="float: left; width: 35%;">
		Store In:<br>
		<select id="storage" class="round">
			${data.variables[1]}
		</select>
	</div>
	<div id="varNameContainer2" style="float: right; width: 60%;">
		Variable Name:<br>
		<input id="varName2" class="round" type="text"><br>
	</div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.messageChange(document.getElementById('message'), 'varNameContainer');
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const varName = this.evalMessage(data.varName, cache);
    const info = parseInt(data.info, 10);
    const embed = this.getVariable(parseInt(data.message, 10), varName, cache);

    if (!embed) {
      console.error('Store Embed Info: Source Embed was not given');
      return this.callNextAction(cache);
    }

    let result;
    switch (info) {
      case 0:
        result = embed;
        break;
      case 1:
        result = embed.title;
        break;
      case 2:
        result = embed.description;
        break;
      case 3:
        result = embed.author.name;
        break;
      case 4:
        result = embed.author.iconURL;
        break;
      case 5:
        result = embed.thumbnail.url;
        break;
      case 6:
        result = embed.footer.text;
        break;
      case 7:
        result = embed.footer.iconURL;
        break;
      case 8:
        result = embed.image.url;
        break;
      case 9:
        result = embed.color;
        break;
      case 10:
        result = embed.fields;
        break;
      default:
        break;
    }
    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      this.storeValue(result, storage, this.evalMessage(data.varName2, cache), cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};

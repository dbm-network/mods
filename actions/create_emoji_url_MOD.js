module.exports = {
  name: 'Create Emoji URL',
  section: 'Emoji/Sticker Control',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data, presets) {
    return `${data.emojiName}`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage2, 10);
    if (type !== varType) return;
    return [data.varName2, 'Emoji'];
  },

  fields: ['emojiName', 'storage', 'varName', 'storage2', 'varName2'],

  html(isEvent, data) {
    return `
<div>
	<span class="dbminputlabel">Emoji name</span><br>
	<input id="emojiName" class="round" type="text">
</div>

<br>

<div>
		<div style="float: left; width: 35%;">
		<span class="dbminputlabel">Image Url</span><br>
			<select id="storage" class="round">
				${data.variables[1]}
			</select>
		</div>
		<div style="float: right; width: 60%;">
		<span class="dbminputlabel">Variable name</span><br>
			<input id="varName" class="round" type="text">
		</div>
	</div>

<br><br><br><br>

<hr class="subtlebar" style="margin-top: 0px;">

<br>

<div>
		<div style="float: left; width: 35%;">
		<span class="dbminputlabel">Store in</span><br>
			<select id="storage2" class="round" onchange="glob.onComparisonChanged(this)">
				${data.variables[0]}
			</select>
		</div>
		<div id="varNameContainer2" style="float: right; width: 60%;">
		<span class="dbminputlabel">Variable name</span><br>
			<input id="varName2" class="round" type="text">
		</div>
	</div>

`;
  },

  init() {
    const { glob, document } = this;

    glob.onComparisonChanged = function (event) {
      if (event.value === '0') {
        document.getElementById('varNameContainer2').style.display = 'none';
      } else {
        document.getElementById('varNameContainer2').style.display = null;
      }
    };

    glob.onComparisonChanged(document.getElementById('storage2'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const server = cache.server;
    if (!server?.emojis) return this.callNextAction(cache);

    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const image = this.getVariable(type, varName, cache);
    server.emojis
      .create(image, this.evalMessage(data.emojiName, cache))
      .then((emoji) => {
        const varName2 = this.evalMessage(data.varName2, cache);
        const storage = parseInt(data.storage, 10);
        this.storeValue(emoji, storage, varName2, cache);
        this.callNextAction(cache);
      })
      .catch((err) => this.displayError(data, cache, err));
  },

  mod() {},
};

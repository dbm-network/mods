module.exports = {
  name: 'Create Server Template MOD',
  section: 'Server Control',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data) {
    return `${data.templatename}`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, 'URL'];
  },

  fields: ['server', 'varName', 'templatename', 'templatedescricao', 'storage', 'varName2'],

  html(isEvent, data) {
    return `
    <div style="position:absolute;bottom:0px;border: 1px solid #222;background:#000;color:#999;padding:3px;right:0px;z-index:999999">Version 0.2</div>
    <div style="position:absolute;bottom:0px;border: 1px solid #222;background:#000;color:#999;padding:3px;left:0px;z-index:999999">DBM-Extended</div>
<div>
<server-input dropdownLabel="Servidor" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>
<br><br><br>
<div style="float: left; width: 100%;">
<span class="dbminputlabel">Template Name</span><br>
<input id="templatename" class="round" type="text">
</div>
<br><br><br>
<div style="padding-top: 3px;">
<span class="dbminputlabel">Description</span><br>
		  <textarea id="templatedescricao" name="templatedescricao" rows="3" placeholder="Insert text here..." style="width: 99%; font-family: monospace; white-space: nowrap;"></textarea>
      Maximum 120 characters
	  </div>
    <br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
  <span class="dbminputlabel">Store in</span><br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
  <span class="dbminputlabel">Variable Name</span><br>
    <input id="varName2" class="round" type="text">
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const targetServer = await this.getServerFromData(data.server, data.varName, cache);
    if (!targetServer) {
      return this.callNextAction(cache);
    }
    const templatename = this.evalMessage(data.templatename, cache);
    const templatedescricao = this.evalMessage(data.templatedescricao, cache);
    let result = targetServer.createTemplate(templatename, templatedescricao).catch((err) => {
      console.log('A template already exists on the server');
      console.error(err);
    });

    if ((result = `https://discord.new/${(await targetServer.fetchTemplates()).map((v) => v.code)}`)) {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
      this.callNextAction(cache);
    }
  },

  mod() {},
};

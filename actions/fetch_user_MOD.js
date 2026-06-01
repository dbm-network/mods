module.exports = {
  name: 'Fetch User MOD',
  section: 'Member Control',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data) {
    return `${data.User}`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'User'];
  },

  fields: ['User', 'storage', 'varName', 'iffalse', 'iffalseVal'],

  html(isEvent, data) {
    return `
    <div style="position:absolute;bottom:0px;border: 1px solid #222;background:#000;color:#999;padding:3px;right:0px;z-index:999999">Version 0.3</div>
    <div style="position:absolute;bottom:0px;border: 1px solid #222;background:#000;color:#999;padding:3px;left:0px;z-index:999999">DBM-Extended</div>
  <div style="padding-top: 8px;">
  <span class="dbminputlabel">Search User By ID</span><br>
    <textarea class="round" id="User" rows="1" placeholder="" style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
  </div><br>
</div>

<div style="padding-top: 8px;">
<div style="float: left; width: 35%">
      <span class="dbminputlabel">If the user does not exist</span><br>
      <select id="iffalse" class="round" onchange="glob.onComparisonChanged(this)">
      <option value="0">Continue Actions</option>
      <option value="1" selected>Stop Action Sequence</option>
      <option value="2">Go to Action</option>
      <option value="3">Skip Actions</option>
      <option value="4">Go To Action Anchor</option>
    </select>
    </div>
    <div id="iffalseContainer" style="display: none; float: right; width: 60%;"><span id="ifName" class="dbminputlabel">For</span><br><input id="iffalseVal" class="round" name="actionxinxyla" type="text"></div>
</div>
<br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
  <span class="dbminputlabel">Store in</span><br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
  <span class="dbminputlabel">Variable Name</span><br>
    <input id="varName" class="round" type="text">
  </div>`;
  },

  init() {
    const { glob, document } = this;

    glob.onComparisonChanged = function (event) {
      if (event.value > '1') {
        document.getElementById('iffalseContainer').style.display = null;
      } else {
        document.getElementById('iffalseContainer').style.display = 'none';
      }
    };

    glob.onComparisonChanged(document.getElementById('iffalse'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const User = this.evalMessage(data.User, cache);
    const client = this.getDBM().Bot.bot;

    try {
      const usuario = await client.users.fetch(User);
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(usuario, storage, varName, cache);
      this.callNextAction(cache);
    } catch (err) {
      this.executeResults(false, data, cache);
    }
  },

  mod() {},
};

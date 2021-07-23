module.exports = {
  name: 'Find Member',
  section: 'Member Control',

  subtitle(data) {
    const op1 = ['Member', 'User'];
    const info = ['ID', 'Username', 'Display Name', 'Tag', 'Color'];
    return `Find ${op1[parseInt(data.find2, 10)]} by ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    const op1 = ['Member', 'User'];
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, `Server ${op1[parseInt(data.find2, 10)]}`];
  },

  fields: ['info', 'find', 'storage', 'varName', 'find2', 'iffalse', 'iffalseVal'],

  html(_isEvent, data) {
    return `
<div><p>This action has been modified by DBM Mods.</p></div><br>
<div style="float: left;">
  <select id="find2" onchange="glob.change()" class="round">
    <option value="0" selected>Find Server Member</option>
    <option value="1">Find Global User</option>
  </select>
</div><br><br>
<div>
  <div style="float: left; width: 40%;">
    Source Field:<br>
    <select id="info" class="round">
      <option value="0" selected>User ID</option>
      <option value="1">User Name</option>
      <option value="2">Member Display Name</option>
      <option value="3">User Tag</option>
      <option value="4">Member Color</option>
    </select>
  </div>
  <div style="float: right; width: 55%;">
    Search Value:<br>
    <input id="find" class="round" type="text">
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div id="varNameContainer" style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text">
  </div>
  <div style="float: left; width: 35%; padding-top: 10px;">
    If Member Wasn't Found:<br>
    <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
      <option value="0" selected>Continue Actions</option>
      <option value="1">Stop Action Sequence</option>
      <option value="2">Jump To Action</option>
      <option value="3">Skip Next Actions</option>
      <option value="4">Jump To Anchor</option>
    </select>
  </div>
  <div id="iffalseContainer" style="display: none; float: right; width: 60%; padding-top: 10px;">
    <span id="iffalseName">Action Number</span>:<br><input id="iffalseVal" class="round" type="text">
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    glob.onChangeFalse = function onChangeFalse(event) {
      switch (parseInt(event.value, 10)) {
        case 0:
        case 1:
          document.getElementById('iffalseContainer').style.display = 'none';
          break;
        case 2:
          document.getElementById('iffalseName').innerHTML = 'Action Number';
          document.getElementById('iffalseContainer').style.display = null;
          break;
        case 3:
          document.getElementById('iffalseName').innerHTML = 'Number of Actions to Skip';
          document.getElementById('iffalseContainer').style.display = null;
          break;
        case 4:
          document.getElementById('iffalseName').innerHTML = 'Anchor ID';
          document.getElementById('iffalseContainer').style.display = null;
          break;
        default:
          break;
      }
    };
    glob.change = function change() {
      try {
        const sel = document.getElementById('find2').value;
        const option = document.getElementById('info');
        if (sel === '0') {
          for (let i = 0; i < option.length; i++) {
            option[i].disabled = false;
            option[i].innerHTML = option[i].innerHTML.replace(/[^\s]*/, 'Member');
          }
        } else if (sel === '1') {
          option[3].disabled = true;
          option[4].disabled = true;
          for (let i = 0; i < option.length; i++) {
            option[i].innerHTML = option[i].innerHTML.replace(/[^\s]*/, 'User');
          }
        }
      } catch (err) {
        alert(err);
      }
    };
    glob.change();
    glob.onChangeFalse(document.getElementById('iffalse'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);
    const query = this.evalMessage(data.find, cache);
    const scope = parseInt(data.find2, 10);
    let objects;
    if (scope === 1) objects = this.getDBM().Bot.bot.users.cache;
    else {
      const { server } = cache;
      if (!server || !server.members) return this.executeResults(false, data, cache);
      try {
        objects = await server.members.fetch();
      } catch {
        return this.displayError.bind(this, data, cache);
      }
    }

    let result;
    switch (info) {
      case 0:
        result = objects.get(query);
        if (!result && scope === 1) {
          try {
            result = await this.getDBM().Bot.bot.users.fetch(query);
          } catch {
            return this.displayError.bind(this, data, cache);
          }
        }
        break;
      case 1:
        result = objects.find((o) => (o.user ? o.user.username === query : o.username === query));
        break;
      case 2:
        result = objects.find((o) => (o.user ? o.displayName === query : o.username === query));
        break;
      case 3:
        result = objects.find((o) => (o.user ? o.user.tag === query : o.tag === query));
        break;
      case 4:
        if (scope === 1) {
          console.error('Find Member: Cannot use Member Color option for Global User');
          return this.executeResults(false, data, cache);
        }
        result = objects.find((m) => m.displayHexColor === query);
        break;
      default:
        break;
    }

    if (!result) return this.executeResults(false, data, cache);
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};

module.exports = {
  name: 'Set Time Restriction',
  section: 'Other Stuff',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/set_time_restriction_MOD.js',
  },

  subtitle(data) {
    const results = [
      'Continue Actions',
      'Stop Action Sequence',
      'Jump To Action',
      'Jump Forward Actions',
      'Jump to Anchor',
    ];
    return `Cooldown | If True: ${results[parseInt(data.iftrue, 10)]} ~ If False: ${
      results[parseInt(data.iffalse, 10)]
    }`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Seconds'];
  },

  fields: [
    'measurement',
    'value',
    'save',
    'restrict',
    'iftrue',
    'iftrueVal',
    'iffalse',
    'iffalseVal',
    'storage',
    'varName',
  ],

  html(_isEvent, data) {
    data.conditions[0] = data.conditions[0]
      .replace(/If True/g, 'If Cooldown is Active')
      .replace(/If False/g, 'If Cooldown is Not Active');
    return `
<div>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Time Measurement:<br>
      <select id="measurement" class="round" onchange="glob.onChange(this)">
        <option value="0">Milliseconds</option>
        <option value="1" selected>Seconds</option>
        <option value="2">Minutes</option>
        <option value="3">Hours</option>
      </select>
    </div>
    <div style="padding-left: 5%; float: left; width: 65%;">
      Cooldown Time:<br>
      <input id="value" class="round" type="text" placeholder="1 = 1 second"><br>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Reset After Restart:<br>
      <select id="save" class="round"><br>
        <option value="0" selected>False</option>
        <option value="1">True</option>
      </select>
    </div>
    <div style="padding-left: 5%; float: left; width: 59%;">
      Restrict By:<br>
      <select id="restrict" class="round"><br>
        <option value="0" selected>Global</option>
        <option value="1">Server</option>
      </select>
    </div>
  </div><br><br><br>
  <div style="padding-top: 8px;">
    ${data.conditions[0]}
  </div><br><br><br>
  <div style="padding-top: 8px;">
    <div style="float: left; width: 35%;">
      Store Left Time In (s):<br>
      <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
        ${data.variables[0]}
      </select>
    </div>
    <div id="varNameContainer" style="float: right; width: 60%; display: none;">
      Variable Name:<br>
      <input id="varName" class="round" type="text"><br>
    </div>
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    const value = document.getElementById('value');

    glob.onChange = function onChange(Measurement) {
      switch (parseInt(Measurement.value, 10)) {
        case 0:
          value.placeholder = '1000 = 1 second';
          break;
        case 1:
          value.placeholder = '1 = 1 second';
          break;
        case 2:
          value.placeholder = '1 = 60 seconds';
          break;
        case 3:
          value.placeholder = '1 = 3600 seconds';
          break;
        default:
          break;
      }
    };

    const option = document.createElement('OPTION');
    option.value = '4';
    option.text = 'Jump to Anchor';
    const iffalse = document.getElementById('iffalse');
    if (iffalse.length === 4) iffalse.add(option);

    const option2 = document.createElement('OPTION');
    option2.value = '4';
    option2.text = 'Jump to Anchor';
    const iftrue = document.getElementById('iftrue');
    if (iftrue.length === 4) iftrue.add(option2);

    glob.onChangeTrue = function onChangeTrue(event) {
      switch (parseInt(event.value, 10)) {
        case 0:
        case 1:
          document.getElementById('iftrueContainer').style.display = 'none';
          break;
        case 2:
          document.getElementById('iftrueName').innerHTML = 'Action Number';
          document.getElementById('iftrueContainer').style.display = null;
          break;
        case 3:
          document.getElementById('iftrueName').innerHTML = 'Number of Actions to Skip';
          document.getElementById('iftrueContainer').style.display = null;
          break;
        case 4:
          document.getElementById('iftrueName').innerHTML = 'Anchor ID';
          document.getElementById('iftrueContainer').style.display = null;
          break;
        default:
          break;
      }
    };
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
    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
    glob.onChangeTrue(document.getElementById('iftrue'));
    glob.onChangeFalse(document.getElementById('iffalse'));
    glob.onChange(document.getElementById('Measurement'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const value = parseInt(this.evalMessage(data.value, cache), 10);

    if (isNaN(value)) return console.error(`${value} is not a valid number.`);

    let cmd;
    for (const command of this.getDBM().Files.data.commands) {
      if (command && JSON.stringify(command.actions) === JSON.stringify(cache.actions)) {
        cmd = command;
        break;
      }
    }

    const TRData = cache.interaction ?? cache.msg;
    const timeLeft = this.TimeRestriction(TRData, cmd, cache);
    if (!timeLeft) {
      this.executeResults(false, data, cache);
    } else {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName, cache);
      this.storeValue(timeLeft, storage, varName2, cache);
      this.executeResults(true, data, cache);
    }
  },

  mod(DBM) {
    let Cooldown;
    DBM.Actions.LoadTimeRestriction = function LoadTimeRestriction(cache) {
      Cooldown = this.getVariable(3, 'DBMCooldown', cache);
      if (typeof Cooldown === 'undefined') {
        Cooldown = {};
      } else if (typeof Cooldown === 'string') {
        Cooldown = JSON.parse(Cooldown);
      }
      for (const command of Object.keys(Cooldown)) {
        if (Cooldown[command].save === 1) {
          delete Cooldown[command];
        }
        if (Cooldown[command]) {
          if (!DBM.Bot.$cmds[command]) {
            delete Cooldown[command];
          } else {
            const action = DBM.Bot.$cmds[command].actions.find((a) => a.name === 'Set Time Restriction');
            if (action !== undefined) {
              if (action.save === '1') {
                delete Cooldown[command];
              }
            } else {
              delete Cooldown[command];
            }
          }
        }
      }
    };

    DBM.Actions.TimeRestriction = function TimeRestriction(TRData, cmd, cache) {
      const author = TRData.author ?? TRData.user;
      const { channel } = TRData;

      if (typeof Cooldown === 'undefined') this.LoadTimeRestriction(cache);
      const { Files } = DBM;
      let value = parseInt(this.evalMessage(cache.actions[cache.index].value, cache), 10);
      const measurement = parseInt(cache.actions[cache.index].measurement, 10);
      const restrict = parseInt(cache.actions[cache.index].restrict, 10);
      switch (measurement) {
        case 1:
          value *= 1000;
          break;
        case 2:
          value *= 60000;
          break;
        case 3:
          value *= 3600000;
          break;
        default:
          break;
      }

      if (!Cooldown[cmd.name]) Cooldown[cmd.name] = {};
      Cooldown[cmd.name].save = parseInt(cache.actions[cache.index].save, 10);
      Cooldown[cmd.name].cooldown = value;
      const now = Date.now();
      switch (restrict) {
        case 0:
          if (typeof Cooldown[cmd.name][author.id] !== 'number') {
            delete Cooldown[cmd.name][author.id];
          }
          if (Cooldown[cmd.name][author.id]) {
            const expirationTime = Cooldown[cmd.name][author.id] + Cooldown[cmd.name].cooldown;
            if (now < expirationTime) {
              return Math.ceil((expirationTime - now) / 1000);
            }
            Cooldown[cmd.name][author.id] = now;
            if (Cooldown[cmd.name].save === 0) Files.saveGlobalVariable('DBMCooldown', JSON.stringify(Cooldown));
            return false;
          }
          Cooldown[cmd.name][author.id] = now;
          if (Cooldown[cmd.name].save === 0) Files.saveGlobalVariable('DBMCooldown', JSON.stringify(Cooldown));
          return false;
        case 1: {
          let channelId;
          if (typeof cache.server !== 'undefined') {
            channelId = cache.server.id;
          } else {
            channelId = channel.id;
          }
          if (typeof Cooldown[cmd.name][author.id] !== 'object') {
            Cooldown[cmd.name][author.id] = {};
          }
          if (Cooldown[cmd.name][author.id][channelId]) {
            const expirationTime = Cooldown[cmd.name][author.id][channelId] + Cooldown[cmd.name].cooldown;
            if (now < expirationTime) {
              return Math.ceil((expirationTime - now) / 1000);
            }
            Cooldown[cmd.name][author.id][channelId] = now;
            if (Cooldown[cmd.name].save === 0) Files.saveGlobalVariable('DBMCooldown', JSON.stringify(Cooldown));
            return false;
          }
          Cooldown[cmd.name][author.id][channelId] = now;
          if (Cooldown[cmd.name].save === 0) Files.saveGlobalVariable('DBMCooldown', JSON.stringify(Cooldown));
          return false;
        }
        default:
          break;
      }
    };
  },
};

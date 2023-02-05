module.exports = {
  name: 'Store Audit Log Info MOD',
  displayName: 'Store Audit Log Info',
  section: 'Server Control',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_audit_log_info_MOD.js',
  },

  subtitle(data) {
    const storage = ['', 'Temp Variable', 'Server Variable', 'Global Variable'];
    const info = [
      'Audit Log Id',
      'Action',
      'Executor',
      'Target',
      'Target Type',
      'Creation Date',
      'Creation Timestamp',
      'Total Key Change',
      'Key Change',
      'Old Value',
      'New Value',
      'Reason',
      'Extra Data',
    ];
    return `${storage[parseInt(data.storage, 10)]} ${data.varName} - ${info[parseInt(data.info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    let dataType = 'Unknown Type';
    switch (parseInt(data.info, 10)) {
      case 0:
      case 6:
      case 7:
        dataType = 'Number';
        break;
      case 1:
        dataType = 'Audit Log Action';
        break;
      case 2:
      case 3:
      case 12:
        dataType = 'Object';
        break;
      case 4:
      case 8:
      case 9:
      case 10:
      case 11:
        dataType = 'Text';
        break;
      case 5:
        dataType = 'Date';
        break;
      default:
        break;
    }
    return [data.varName2, dataType];
  },

  fields: ['storage', 'varName', 'info', 'position', 'storage2', 'varName2'],

  html(_isEvent, data) {
    return `
<div>
  <div style="float: left; width: 35%;">
    Audit Log Entry:<br>
    <select id="storage" class="round" onchange="glob.refreshVariableList(this)">
      ${data.variables[1]}
    </select><br>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div>
  <div style="float: left; width: 94%;">
    Source Info:<br>
    <select id="info" class="round" onchange="glob.onChange0(this)">
    <option value="0" selected>Audit Log Id</option>
    <option value="1">Action</option>
    <option value="2">Executor</option>
    <option value="3">Target</option>
    <option value="4">Target Type</option>
    <option value="5">Creation Date</option>
    <option value="6">Creation Timestamp</option>
    <option value="7">Total Key Change</option>
    <option value="8">Key Change</option>
    <option value="9">Old Value</option>
    <option value="10">New Value</option>
    <option value="11">Reason</option>
    <option value="12">Extra Data</option>
    </select><br>
  </div>
</div><br><br><br>
<div>
  <div id="keyholder" style="float: left; width: 104%; display: none;">
    Position of Key:<br>
    <input id="position" class="round" type="text" placeholder="Position start from 0"><br>
  </div>
</div>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage2" class="round">
      ${data.variables[1]}
    </select>
  </div>
  <div style="float: right; width: 60%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text">
  </div>
</div>`;
  },

  init() {
    const { glob, document } = this;
    const keyholder = document.getElementById('keyholder');

    glob.onChange0 = function onChange0(info) {
      switch (parseInt(info.value, 10)) {
        case 8:
        case 9:
        case 10:
          keyholder.style.display = null;
          break;
        default:
          keyholder.style.display = 'none';
          break;
      }
    };

    glob.onChange0(document.getElementById('info'));
    glob.refreshVariableList(document.getElementById('storage'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { server } = cache;
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const auditLog = this.getVariable(storage, varName, cache);

    if (!server) return this.callNextAction(cache);

    let result = false;
    let position;

    switch (parseInt(data.info, 10)) {
      case 0:
        result = auditLog.id;
        break;
      case 1:
        result = auditLog.action;
        if (!result || typeof result === 'undefined') {
          if (auditLog.target.bot && auditLog.targetType === 'USER') {
            result = 'ADD_BOT';
          } else if (auditLog.targetType === 'MESSAGE') {
            result = 'CHANNEL_MESSAGE_UPDATE';
          }
        }
        break;
      case 2:
        result = server.members.cache.get(auditLog.executor.id);
        break;
      case 3:
        if (auditLog.target.constructor.name === 'User') {
          result = server.members.cache.get(auditLog.executor.id);
        } else {
          result = auditLog.target;
        }
        break;
      case 4:
        result = auditLog.targetType;
        break;
      case 5:
        result = auditLog.createdAt;
        break;
      case 6:
        result = auditLog.createdTimestamp;
        break;
      case 7:
        if (auditLog.changes !== null) {
          result = auditLog.changes.length;
        } else {
          result = undefined;
        }
        break;
      case 8:
        position = parseInt(this.evalMessage(data.position, cache), 10);
        if (!isNaN(position) && auditLog.changes !== null && position <= auditLog.changes.length) {
          result = auditLog.changes[position].key;
        }
        break;
      case 9:
        position = parseInt(this.evalMessage(data.position, cache), 10);
        if (!isNaN(position) && auditLog.changes !== null && position <= auditLog.changes.length) {
          result = auditLog.changes[position].old;
        }
        break;
      case 10:
        position = parseInt(this.evalMessage(data.position, cache), 10);
        if (!isNaN(position) && auditLog.changes !== null && position <= auditLog.changes.length) {
          result = auditLog.changes[position].new;
        }
        break;
      case 11:
        if (auditLog.reason !== null) {
          result = auditLog.reason;
        } else {
          result = undefined;
        }
        break;
      case 12:
        if (auditLog.reason !== null) {
          result = auditLog.extra;
        } else {
          result = undefined;
        }
        break;
      default:
        break;
    }

    const storage2 = parseInt(data.storage2, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    if (result && result !== undefined) this.storeValue(result, storage2, varName2, cache);
    this.callNextAction(cache);
  },
  mod() {},
};

module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Control Member Level',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Economy',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    let operator;
    if (data.changeType === '1') {
      operator = '+';
    } else if (data.changeType === '2') {
      operator = '-';
    } else {
      operator = '=';
    }
    return `${presets.getMemberText(data.member, data.varName)} (${data.dataName}) ${operator} ${data.value}`;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['member', 'varName', 'dataName', 'changeType', 'value'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.0</a></div>
  

  <member-input dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>
  
  <br><br><br>
  
  <div style="padding-top: 8px;">
      <div style="float: left; width: calc(50% - 12px);">
          <span class="dbminputlabel">Data Name</span><br>
          <select id="dataName" class="round">
              <option value="level" selected>Level</option>
              <option value="xp">XP</option>
          </select>
      </div>
      <div style="float: right; width: calc(50% - 12px);">
          <span class="dbminputlabel">Control Type</span><br>
          <select id="changeType" class="round">
              <option value="0" selected>Set Value</option>
              <option value="1">Add Value</option>
              <option value="2">Subtract Value</option>
          </select>
      </div>
  </div>
  
  <br><br><br>
  
  <div style="padding-top: 8px;">
      <span class="dbminputlabel">Value</span><br>
      <input id="value" class="round" type="text" name="is-eval"><br>
  </div>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const member = await this.getMemberFromData(data.member, data.varName, cache);
    if (member?.setData) {
      const dataName = this.evalMessage(data.dataName, cache);
      let val = this.evalMessage(data.value, cache);
      try {
        val = this.eval(val, cache);
      } catch (e) {
        this.displayError(data, cache, e);
      }
      if (val !== undefined) {
        if (Array.isArray(member)) {
          member.forEach(function (mem) {
            if (data.changeType === '1') {
              if (mem?.addData) mem.addData(dataName, val);
            } else if (data.changeType === '2') {
              if (mem?.addData) mem.addData(dataName, -val);
            } else if (mem?.setData) mem.setData(dataName, val);
          });
        } else if (data.changeType === '1') {
          member.addData(dataName, val);
        } else if (data.changeType === '2') {
          member.addData(dataName, -val);
        } else {
          member.setData(dataName, val);
        }
      }
    }
    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};

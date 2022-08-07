module.exports = {

  name: "Timeout Member",

  section: "Member Control",

  subtitle(data, presets) {
    return `${presets.getMemberText(data.member, data.varName)}`;
  },

  meta: { version: "2.1.6", preciseCheck: true, author: 'DBM MODS, money#6283', authorUrl: 'https://github.com/dbm-network/mods/blob/master/actions/timeout_member.js', downloadUrl: 'https://github.com/dbm-network/mods/blob/master/actions/timeout_member.js' },

  fields: ["member", "varName", "time", "amount", "reason"],

  html(isEvent, data) {
    return `
    <div>
    <p>
        <u>Mod Info:</u><br>
        Created by DBM MODS, money#6283<br>
        tempVariables: endtime
    </p>
</div><br>
<member-input dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>

<br><br><br><br>

<div style="float: left; width: 45%;">
<span class="dbminputlabel">Time</span><br>
<select id="time" class="round">
  <option value="1" selected>Seconds</option>
  <option value="2">Minutes</option>
  <option value="3">Hours</option>
  <option value="4">Days</option>
</select>
</div>
<div style="float: right; width: 50%;">
<span class="dbminputlabel">Amount</span><br>
<input id="amount" class="round" type="text">
</div><br><br><br>

<div style="padding-top: 16px;">
  <span class="dbminputlabel">Reason</span><br>
  <textarea id="reason" class="dbm_monospace" rows="5" placeholder="Insert reason here..." style="white-space: nowrap; resize: none;"></textarea>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const member = await this.getMemberFromData(data.member, data.varName, cache);
    const selected = parseInt(data.time, 10)

    let time = this.evalMessage(data.amount, cache);
    const date = this.evalMessage(data.amount, cache)

    switch (selected) {
      case 1: 
      time = time ? Date.now() + time * 1000 : null;
      break;
      case 2: 
      time = time ? Date.now() + time * 60000 : null;
      break;
      case 3:
      time = time ? Date.now() + time * 3600000 : null;
      break;
      case 4:
      time = time ? Date.now() + time * 86400000 : null;
      break;
      default:
      break;
    }
    let dur
    switch (czas) {
      case 1: 
      dur = date * 1e3;
      break;
      case 2: 
      dur = date * 1e3 * 60;
      break;
      case 3:
      dur = date * 1e3 * 60 * 60;
      break;
      case 4:
      dur = date * 1e3 * 60 * 60 * 60;
      break;
      default:
      break;
    }
    const endtimeout = Date.parse(new Date(new Date().getTime() + dur)) / 1000;
    const reason = this.evalMessage(data.reason, cache);

    if (Array.isArray(member)) {
      this.callListFunc(member, "disableCommunicationUntil", [time, reason])
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else if (member?.disableCommunicationUntil) {
      member.disableCommunicationUntil(time, reason)
        .then(() => {
          const endtime = `<t:${endtimeout}:R>`
          this.storeValue(endtime, 1, 'endtime', cache)
          this.callNextAction(cache)
        })
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
  },

  mod() {},
};

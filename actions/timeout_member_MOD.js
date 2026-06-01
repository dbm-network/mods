module.exports = {
  name: 'Timeout Member',

  section: 'Member Management',

  subtitle(data, presets) {
    return `${presets.getMemberText(data.member, data.varName)}`;
  },

  meta: {
    version: '2.1.5',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  fields: ['member', 'varName', 'czas', 'ilosc', 'reason'],

  html(isEvent, data) {
    return `
<member-input dropdownLabel="Member" selectId="member" variableContainerId="varNameContainer" variableInputId="varName"></member-input>

<br><br><br><br>

<div style="float: left; width: 45%;">
<span class="dbminputlabel">Time</span><br>
<select id="czas" class="round">
  <option value="1" selected>Seconds</option>
  <option value="2">Minutes</option>
  <option value="3">Hours</option>
  <option value="4">Days</option>
</select>
</div>
<div style="float: right; width: 50%;">
<span class="dbminputlabel">Amount</span><br>
<input id="ilosc" class="round" type="text">
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
    const czas = parseInt(data.czas, 10);

    let time = this.evalMessage(data.ilosc, cache);

    switch (czas) {
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
    const reason = this.evalMessage(data.reason, cache);

    if (Array.isArray(member)) {
      this.callListFunc(member, 'disableCommunicationUntil', [time, reason])
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else if (member?.disableCommunicationUntil) {
      member
        .disableCommunicationUntil(time, reason)
        .then(() => this.callNextAction(cache))
        .catch((err) => this.displayError(data, cache, err));
    } else {
      this.callNextAction(cache);
    }
  },

  mod() {},
};

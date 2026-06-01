module.exports = {
  name: 'Convert seconds to Y/D/H/M/S',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    short_description: 'Convert seconds to years, months, days, hours, minutes and seconds.',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data) {
    return `Convert ${data.time}`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Date'];
  },

  fields: ['time', 'storage', 'varName'],

  html(isEvent, data) {
    return `
	<div style="float: left; width: 95%; padding-top: 9px;">
		<p>Convert seconds into years, days, hours, minutes and seconds.</p>
	</div>
	<br><br>
	<div style="float: left; width: 70%; padding-top: 8px;">
		Convert seconds:
		<input id="time" class="round" type="text" placeholder="1522672056 or use variables">
	</div>
	<div style="float: left; width: 35%; padding-top: 8px;">
		Result in:<br>
		<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
		${data.variables[0]}
		</select>
	</div>
	<div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
		Variable name:<br>
		<input id="varName" class="round" type="text">
	</div><br><br>
	<div style=" float: left; width: 88%; padding-top: 8px;">
		<br>
	</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  action(cache) {
    const data = cache.actions[cache.index];
    const time = this.evalMessage(data.time, cache);
    var _this = this;

    let d;
    let h;
    let m;
    let s;
    let a;
    let mes;
    let result;

    if (isNaN(time)) {
      result = 'Invalid date';
      console.log('Please enter a number');
    } else {
      s = Number(time);

      m = Math.floor(s / 60);
      s %= 60;
      h = Math.floor(m / 60);
      m %= 60;
      a = Math.floor(time / 60 / 60 / 24 / 365.242214);
      mes = Math.floor(time / 60 / 60 / 24 / 30.43685116666667 - a * 12);
      d = Math.floor(h / 24 - a * 365.242214 - 30.43685116666667 * mes);
      h %= 24;

      result =
        (a > 1 ? `${String(a)} years ` : '') +
        (a === 1 ? `${String(a)} year ` : '') +
        (mes > 1 ? `${String(mes)} months ` : '') +
        (mes === 1 ? `${String(mes)} month ` : '') +
        (d > 1 ? `${d} days ` : '') +
        (d === 1 ? `${String(d)} day ` : '') +
        (h > 1 ? `${h} hours ` : '') +
        (h === 1 ? `${String(h)} hour ` : '') +
        (m > 0 ? `${m} min ` : '') +
        (s > 0 ? `${s} sec ` : '');
    }

    if (result === 'Invalid date') result = undefined;

    // Storage.
    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  mod(DBM) {},
};

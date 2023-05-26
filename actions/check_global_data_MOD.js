module.exports = {
  name: 'Check Global Data',
  section: 'Data',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/check_global_data_MOD.js',
  },

  subtitle(data) {
    const comparison = ['Exists', 'Equals', 'Equals Exactly', 'Less Than', 'Greater Than', 'Includes', 'Matches Regex'];
    return `${data.dataName} ${comparison[parseInt(data.comparison, 10)]} ${data.value}`;
  },

  fields: ['dataName', 'comparison', 'value', 'branch'],

  html() {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: calc(50% - 12px);">
  <span class="dbminputlabel">Data Name</span><br>
    <input id="dataName" class="round" type="text">
  </div>
  <div style="float: right; width: calc(50% - 12px);">
  <span class="dbminputlabel">Comparison Type</span><br>
    <select id="comparison" class="round" onchange="glob.onComparisonChanged(this)">
      <option value="0">Exists</option>
      <option value="1" selected>Equals</option>
      <option value="2">Equals Exactly</option>
      <option value="3">Less Than</option>
      <option value="4">Greater Than</option>
      <option value="5">Includes</option>
      <option value="6">Matches Regex</option>
    </select>
  </div>
</div>

<br><br><br>

<div id="directValue" style="padding-top: 8px;">
  <span class="dbminputlabel">Value to Compare to</span><br>
  <input id="value" class="round" type="text" name="is-eval">
</div>

<br>

<hr class="subtlebar">

<conditional-input id="branch" style="padding-top: 16px;"></conditional-input>`;
  },

  init() {
    const { glob, document } = this;
    glob.onComparisonChanged = function onComparisonChanged(event) {
      if (event.value === '0') {
        document.getElementById('directValue').style.display = 'none';
      } else {
        document.getElementById('directValue').style.display = null;
      }
    };

    glob.onComparisonChanged(document.getElementById('comparison'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const dataName = this.evalMessage(data.dataName, cache);
    const compare = parseInt(data.comparison, 10);
    const { Globals } = this.getDBM();
    const val1 = Globals.data(dataName);
    let val2 = this.evalMessage(data.value, cache);
    if (compare !== 6) val2 = this.eval(val2, cache);
    if (val2 === false) val2 = this.evalMessage(data.value, cache);

    let result = false;
    switch (compare) {
      case 0:
        result = val1 !== undefined;
        break;
      case 1:
        // eslint-disable-next-line eqeqeq
        result = val1 == val2;
        break;
      case 2:
        result = val1 === val2;
        break;
      case 3:
        result = val1 < val2;
        break;
      case 4:
        result = val1 > val2;
        break;
      case 5:
        if (typeof val1.includes === 'function') {
          result = val1.includes(val2);
        }
        break;
      case 6:
        result = Boolean(val1.match(new RegExp(`^${val2}$`, 'i')));
        break;
      default:
        break;
    }
    this.executeResults(result, data?.branch ?? data, cache);
  },

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  mod() {},
};

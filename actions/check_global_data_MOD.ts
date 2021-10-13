import type { Action } from '../typings/globals';

const action: Action<
  'dataName' | 'comparison' | 'value' | 'iftrue' | 'iftrueVal' | 'iffalse' | 'iffalseVal' | 'Jump to Anchor'
> = {
  name: 'Check Global Data',
  section: 'Data',
  fields: ['dataName', 'comparison', 'value', 'iftrue', 'iftrueVal', 'iffalse', 'iffalseVal', 'Jump to Anchor'],

  subtitle(data) {
    const results = [
      'Continue Actions',
      'Stop Action Sequence',
      'Jump To Action',
      'Jump Forward Actions',
      'Jump to Anchor',
    ];
    return `If True: ${results[parseInt(data.iftrue, 10)]} ~ If False: ${results[parseInt(data.iffalse, 10)]}`;
  },

  html(_isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: 50%;">
    Data Name:<br>
    <input id="dataName" class="round" type="text">
  </div>
  <div style="float: left; width: 45%;">
    Comparison Type:<br>
    <select id="comparison" class="round">
      <option value="0">Exists</option>
      <option value="1" selected>Equals</option>
      <option value="2">Equals Exactly</option>
      <option value="3">Less Than</option>
      <option value="4">Greater Than</option>
      <option value="5">Includes</option>
      <option value="6">Matches Regex</option>
    </select>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  Value to Compare to:<br>
  <input id="value" class="round" type="text" name="is-eval">
</div>
<div style="padding-top: 16px;">
  ${data.conditions[0]}
</div>`;
  },

  init(this: any) {
    const { glob, document } = this;
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

    glob.onChangeTrue = function onChangeTrue(event: any) {
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
    glob.onChangeFalse = function onChangeFalse(event: any) {
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
    glob.onChangeTrue(document.getElementById('iftrue'));
    glob.onChangeFalse(document.getElementById('iffalse'));
  },

  action(this, cache) {
    const data = cache.actions[cache.index];
    const dataName = this.evalMessage(data.dataName, cache);
    const compare = parseInt(data.comparison, 10);
    const { Globals } = this.getDBM();
    const val1 = Globals.data(dataName);
    let val2 = this.evalMessage(data.value, cache);
    if (compare !== 6) val2 = this.eval(val2, cache);
    if (!val2) val2 = this.evalMessage(data.value, cache);

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
    this.executeResults(result, data, cache);
  },

  mod() {},
};

module.exports = action;

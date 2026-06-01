module.exports = {
  name: 'Number of Items in a List MOD',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data, presets) {
    const info = [
      'Exists',
      'Equals to',
      'Exactly equal',
      'Less than',
      'Less than or equal to',
      'Greater than',
      'Greater than or equal to',
      'Includes',
      'Matches Regex',
      'Matches Full Regex',
      'Length is greater than',
      'Length is less than',
      'Length is equal to',
      'Starts with',
      'Ends with',
      'Between',
      'Does it have accents? ',
      'Includes the words ["a" , "b" , "c"]',
      'Equals the words ["a" , "b" , "c"]',
      'Is it an even number?',
      'Is it an odd number?',
      'Is it a number?',
      'Is it a list?',
      'Is it an image URL?',
      'Is it text?',
      'Is it a URL?',
    ];
    const prse = parseInt(data.comparison, 10);
    return `Contar "${info[prse]}" em "${data.varName}"`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, 'Number'];
  },

  fields: ['storage', 'varName', 'varName2', 'comparison', 'list', 'value', 'value2'],

  html(isEvent, data) {
    return `
      <div style="position:absolute;bottom:0px;border: 1px solid #222;background:#000;color:#999;padding:3px;right:0px;z-index:999999">Version 0.2</div>
      <div style="position:absolute;bottom:0px;border: 1px solid #222;background:#000;color:#999;padding:3px;left:0px;z-index:999999">DBM-Extended</div>
      
      
      <div style="float: left; width: 100%;"><br>
      <div style="float: left; width: 35%;">
              <span class="dbminputlabel">List</span><br>
                  <select id="list" class="round" onchange="glob.onComparisonChanged2(this)">
            ${data.lists[isEvent ? 1 : 0]}
                  </select><br>
              </div>
              <div id="varNameContainer2" style=" float: right; width: 60%;">
              <span class="dbminputlabel">Variable Name</span><br>
                  <input id="varName" class="round" type="text" list="variableList"><br>
              </div>
      </div>

      <br>
  
      <div style="padding-top: 8px;">
      <div style="float: left; width: 35%;">
          <span class="dbminputlabel">Comparison Type</span><br>
          <select id="comparison" class="round" onchange="glob.onComparisonChanged(this)">
                <option value="0">Exists</option>
                <option value="1" selected>Equals</option>
                <option value="2">Exactly the same</option>
                <option value="3">Less than</option>
                <option value="4">Less than or equal to</option>
                <option value="5">Greater than</option>
                <option value="6">Greater than or equal to</option>
                <option value="7">Includes</option>
                <option value="8">Matches Regex</option>
                <option value="9">Matches Full Regex</option>
                <option value="10">Length is greater than</option>
                <option value="11">Length is less than</option>
                <option value="12">Length is equal to</option>
                <option value="13">Starts with</option>
                <option value="14">Ends with</option>
                <option value="15">Between</option>
                <option value="16">Does it have accents?</option>
                <option value="17">Includes the words ["a" , "b" , "c"]</option>
                <option value="18">Equals the words ["a" , "b" , "c"]</option>
                <option value="19">Is it an even number?</option>
                <option value="20">Is it an odd number?</option>
                <option value="21">Is it a number?</option>
                <option value="24">Is it text?</option>
                <option value="22">Is it a list?</option>
                <option value="23">Is it an image URL?</option>
                <option value="25">Is it a URL?</option>
          </select>
      </div>
      <table style="float: right;width: 65%;"><tr><td style="padding:0px 8px"><div style="width: 100%" id="directValue">
          <span id="item" class="dbminputlabel">Item</span>
          <input id="value" class="round" type="text">
      </div></td><td style="padding:0px 3px";> <div style="width: 100%;" id="containerxin">
    <span class="dbminputlabel">and</span><br>
    <input id="value2" class="round" type="text"></td></tr></table>
  </div></div>
  
  <br><br><br><br><br><br>
  <div style="float: left; width: 35%; padding-top: 8px;">
      <span class="dbminputlabel">Result in</span><br>
      <select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
      ${data.variables[1]}
      </select>
  </div>
  <div id="varNameContainer" style="float: right; display: none; width: 60%; padding-top: 8px;">
      <span class="dbminputlabel">Variable Name</span><br>
      <input id="varName2" class="round" type="text">
  </div><br><br>
  <div style=" float: left; width: 88%; padding-top: 8px;">
      <br>
  </div>`;
  },

  init() {
    const { glob, document } = this;

    glob.variableChange(document.getElementById('storage'), 'varNameContainer');

    glob.onComparisonChanged2 = function (event) {
      if (event.value < '7') {
        document.getElementById('varNameContainer2').style.display = 'none';
      } else {
        document.getElementById('varNameContainer2').style.display = null;
      }
    };

    glob.onComparisonChanged2(document.getElementById('list'));

    glob.onComparisonChanged = function (event) {
      if (event.value === '0') {
        document.getElementById('directValue').style.display = 'none';
        document.getElementById('containerxin').style.display = 'none';
      } else {
        document.getElementById('directValue').style.display = null;
        document.getElementById('containerxin').style.display = 'none';
      }
      if (event.value === '15') {
        document.getElementById('directValue').style.display = null;
        document.getElementById('containerxin').style.display = null;
      }
      if (
        event.value === '16' ||
        event.value === '19' ||
        event.value === '20' ||
        event.value === '21' ||
        event.value === '22' ||
        event.value === '23' ||
        event.value === '24' ||
        event.value === '25'
      ) {
        document.getElementById('directValue').style.display = 'none';
        document.getElementById('containerxin').style.display = 'none';
      }
      if (
        event.value === '3' ||
        event.value === '4' ||
        event.value === '5' ||
        event.value === '6' ||
        event.value === '10' ||
        event.value === '11' ||
        event.value === '12' ||
        event.value === '15'
      ) {
        document.getElementById('item').innerHTML = 'Valor';
      } else if (event.value === '8' || event.value === '9') {
        document.getElementById('item').innerHTML = 'Regex';
      } else {
        document.getElementById('item').innerHTML = 'Item';
      }
    };

    glob.onComparisonChanged(document.getElementById('comparison'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const comparison = parseInt(data.comparison, 10);
    const item = this.evalMessage(data.value, cache);
    const list = await this.getListFromData(data.list, data.varName, cache);
    let contagem = 0;
    let result;

    if (Array.isArray(list)) {
      switch (comparison) {
        case 0:
          for (var i = 0; i < list.length; i++) {
            if (list[i].length === undefined || list[i].length === null || list[i] === '') {
            } else {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 1:
          for (var i = 0; i < list.length; i++) {
            if (list[i] === item) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 2:
          for (var i = 0; i < list.length; i++) {
            if (list[i] === item) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 3:
          for (var i = 0; i < list.length; i++) {
            if (list[i] < parseFloat(item.toString().replace(',', '.'))) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 4:
          for (var i = 0; i < list.length; i++) {
            if (list[i] <= parseFloat(item.toString().replace(',', '.'))) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 5:
          for (var i = 0; i < list.length; i++) {
            if (list[i] > parseFloat(item.toString().replace(',', '.'))) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 6:
          for (var i = 0; i < list.length; i++) {
            if (list[i] >= parseFloat(item.toString().replace(',', '.'))) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 7:
          for (var i = 0; i < list.length; i++) {
            if (list[i].toString().includes(item.toString())) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 8:
          for (var i = 0; i < list.length; i++) {
            if (list[i].toString().match(new RegExp(`^${item}$`, 'i'))) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 9:
          for (var i = 0; i < list.length; i++) {
            if (list[i].toString().match(new RegExp(item))) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 10:
          for (var i = 0; i < list.length; i++) {
            if (list[i].toString().length > parseFloat(item.toString().replace(',', '.'))) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 11:
          for (var i = 0; i < list.length; i++) {
            if (list[i].toString().length < parseFloat(item.toString().replace(',', '.'))) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 12:
          for (var i = 0; i < list.length; i++) {
            if (list[i].toString().length === parseFloat(item.toString().replace(',', '.'))) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 13:
          for (var i = 0; i < list.length; i++) {
            if (list[i].toString().startsWith(item)) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 14:
          for (var i = 0; i < list.length; i++) {
            if (list[i].toString().endsWith(item)) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 15:
          const item2 = this.evalMessage(data.value2, cache);
          for (var i = 0; i < list.length; i++) {
            if (
              list[i] >= parseFloat(item.toString().replace(',', '.')) &&
              list[i] <= parseFloat(item2.toString().replace(',', '.'))
            ) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 16:
          const conditions = [
            'Ä',
            'Å',
            'Á',
            'Â',
            'À',
            'Ã',
            'Ā',
            'Ă',
            'Ą',
            'ā',
            'ă',
            'ą',
            'ä',
            'á',
            'â',
            'à',
            'ã',
            'É',
            'Ê',
            'Ë',
            'È',
            'Ė',
            'Ę',
            'Ě',
            'Ĕ',
            'Ē',
            'ė',
            'ę',
            'ě',
            'ĕ',
            'ē',
            'é',
            'ê',
            'ë',
            'è',
            'Í',
            'Î',
            'Ï',
            'Ì',
            'İ',
            'Į',
            'Ī',
            'ı',
            'į',
            'ī',
            'í',
            'î',
            'ï',
            'ì',
            'Ö',
            'Ó',
            'Ô',
            'Ò',
            'Õ',
            'Ő',
            'Ō',
            'ő',
            'ō',
            'ö',
            'ó',
            'ô',
            'ò',
            'õ',
            'Ü',
            'Ú',
            'Û',
            'Ų',
            'Ű',
            'Ů',
            'Ū',
            'ų',
            'ű',
            'ů',
            'ū',
            'ü',
            'ú',
            'û',
            'ù',
            'Ç',
            'Ć',
            'Č',
            'ç',
            'ć',
            'č',
            'Ñ',
            'Ň',
            'Ņ',
            'Ń',
            'ñ',
            'ň',
            'ņ',
            'ń',
            'Ÿ',
            'Ý',
            'ý',
            'Ź',
            'Ż',
            'Ž',
            'ź',
            'ż',
            'ž',
            'Ł',
            'Ľ',
            'Ļ',
            'Ĺ',
            'ł',
            'ľ',
            'ĺ',
            'Ķ',
            'ķ',
            'Ģ',
            'Ğ',
            'ģ',
            'ğ',
            'Ď',
            'ď',
            'Ś',
            'Š',
            'Ş',
            'ś',
            'š',
            'ş',
            'Ť',
            'Ț',
            'Ţ',
            'ť',
            'ț',
            'ţ',
            'Ŕ',
            'Ř',
            'ŕ',
            'ř',
          ];
          for (var i = 0; i < list.length; i++) {
            if (conditions.some((el) => list[i].toString().includes(el))) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 17:
          const conditionsX = this.evalIfPossible(item, cache);
          for (var i = 0; i < list.length; i++) {
            if (conditionsX.some((els) => list[i].toString().includes(els))) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 18:
          const conditionsZ = this.evalIfPossible(item, cache);
          for (var i = 0; i < list.length; i++) {
            if (conditionsZ.some((elz) => list[i] === elz)) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 19:
          for (var i = 0; i < list.length; i++) {
            if (list[i] % 2 === 0) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 20:
          for (var i = 0; i < list.length; i++) {
            if (list[i] % 2 === 1) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 21:
          for (var i = 0; i < list.length; i++) {
            if (!isNaN(parseFloat(list[i].toString().replace(',', '.')))) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 22:
          for (var i = 0; i < list.length; i++) {
            if (Array.isArray(list[i])) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 23:
          const isImageUrl = require('is-image-url');
          for (var i = 0; i < list.length; i++) {
            if (isImageUrl(list[i])) {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 24:
          for (var i = 0; i < list.length; i++) {
            if (typeof list[i] === 'string') {
              contagem++;
            }
          }

          result = contagem;
          break;
        case 25:
          const isUrl = require('is-url');
          for (var i = 0; i < list.length; i++) {
            if (isUrl(list[i])) {
              contagem++;
            }
          }

          result = contagem;
          break;
      }
    } else {
      result = 0;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName2 = this.evalMessage(data.varName2, cache);
      this.storeValue(result, storage, varName2, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};

module.exports = {
  name: 'Store Member Data List',
  section: 'Member Control',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/member_data_list_MOD.js',
  },

  subtitle(data) {
    return `${[data.dataName]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName2, 'Array'];
  },

  fields: [
    'debu',
    'numbefst2',
    'numbefst',
    'numbefstselect',
    'sort',
    'start',
    'middle',
    'end',
    'getresults',
    'dataName',
    'varName2',
    'storage',
  ],

  html(isEvent, data) {
    return `
<div id="wrexdiv2" style="width: 550px; height: 350px; overflow-y: scroll;">
  <div>
    <div style="padding-top: 8px;">
      <div style="float: left; width: 50%;">
        Data Name:<br>
        <input id="dataName" class="round" type="text">
      </div>
    </div>
    Number before start
    <select id="numbefstselect" class="round" style="width:33%" onchange="glob.onChange1(this)">
      <option value="1" >No</option>
      <option value="2"selected>Yes</option>
    </select><br>
    <div id="numbefst" style=" width: 80%; display: none;">
      Char after Number:<br>
      <input id="numbefst2" class="round" type="text" value=")">
    </div><br>
    Start:
    <select id="start" class="round" style="width:33%">
      <option value="result" >Result</option>
      <option value="username"selected>Username</option>
    </select><br>
    <div style="display: table-cell;">
      Middle:
      <input id="middle" style="width:80%"  class="round" type="text" value="-"></input><br>
      End:
      <select id="end" class="round" style="width:100%">
        <option value="result" selected>Result</option>
        <option value="username">Username</option>
      </select><br>
    </div>
    <select id="sort" class="round" style="width: 90%;">
      <option value="0" selected>Don't Sort</option>
      <option value="1" selected>Sort from Descending</option>
      <option value="2">Sort from Ascending</option>
    </select><br>
    <div style="float: left; width: 50%; font-family: monospace; white-space: nowrap; resize: none;">
      Result Limit:
      <input id="getresults" class="round" type="text" placeholder="If blank it gets all results.">
    </div><br><br><br>
    <div style="float: left; width: 35%; font-family: monospace; white-space: nowrap; resize: none;"">
      Store In:<br>
      <select id="storage" class="round">
        ${data.variables[1]}
      </select>
    </div>
    <div id="varNameContainer2" style="float: right; width: 60%;">
      Variable Name:<br>
      <input id="varName2" class="round" type="text"><br>
    </div>
  </div>
  <select id="debu" class="round" style="width: 90%;">
    <option value="0" selected>Debug</option>
    <option value="1" selected>Don't Debug</option>
  </select>
</div>`;
  },

  init() {
    const { document, glob } = this;
    glob.onChange1 = function onChange1(event) {
      const value = parseInt(event.value, 10);
      const dom = document.getElementById('numbefst');

      if (value === 1) {
        dom.style.display = 'none';
      } else if (value === 2) {
        dom.style.display = null;
      }
    };
    glob.onChange1(document.getElementById('numbefstselect'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { msg } = cache;
    const storage = parseInt(data.storage, 10);
    const varName2 = this.evalMessage(data.varName2, cache);
    const st = this.evalMessage(data.start, cache);
    const mid = this.evalMessage(data.middle, cache);
    const selectionsnum = parseInt(data.numbefstselect, 10);

    const en = this.evalMessage(data.end, cache);
    const sortType = parseInt(data.sort, 10);
    const debug = parseInt(data.debu, 10);
    const Mods = this.getMods();

    const { sort } = Mods.require('fast-sort');
    const { JSONPath } = Mods.require('jsonpath-plus');
    const fs = require('fs');
    let file = fs.readFileSync('./data/players.json', 'utf8');

    if (file) {
      let dataName = this.evalMessage(data.dataName, cache);
      dataName = `['${dataName}']`;

      const val = this.evalMessage(data.value, cache);
      const list2 = [];
      let list4 = [];
      const list5 = [];
      let result;

      if (val !== undefined) {
        file = JSON.parse(file);
        try {
          const list = [];
          result = JSONPath({
            path: `$.[?(@${dataName} || @${dataName} > -9999999999999999999999999999999999999999999999999999999)]*~`,
            json: file,
          });

          for (let i = 0; i < result.length; i++) {
            const result2 = JSONPath({
              path: `$.${result[i]}${dataName}`,
              json: file,
            });

            try {
              const user = msg.guild.members.cache.get(result[i]);
              const { tag } = user.user;

              list.push({
                id: tag,
                name2: result2,
              });
            } catch (err) {
              if (debug === 0) console.error(err);
            }
          }

          switch (sortType) {
            case 1:
              result = sort(list).desc((u) => parseInt(u.name2, 10));
              break;
            case 2:
              result = sort(list).asc((u) => parseInt(u.name2, 10));
              break;
            case 0:
              result = list;
              break;
            default:
              break;
          }

          let result2 = JSON.stringify(result);
          let getres = parseInt(this.evalMessage(data.getresults, cache), 10);

          if (!getres) getres = result.length;
          if (getres > result.length) getres = result.length;

          for (let i = 0; i < getres; i++) {
            result2 = JSON.stringify(result[i]);

            try {
              const file = JSON.parse(result2);

              const res = JSONPath({
                path: '$..name2',
                json: file,
              });

              const res2 = JSONPath({
                path: '$..id',
                json: file,
              });

              /* eslint-disable */
              const username = res2;
              const result = res;
              eval(`${st}`);
              const middle = ` ${mid} `;
              eval(`${en}`);
              const en2 = eval(en);
              const st2 = eval(st);
              /* eslint-enable */

              list5.push('easter egg :eyes:');
              switch (selectionsnum) {
                case 1:
                  list2.push(`${st2 + middle + en2}\n`);
                  break;
                case 2:
                  list2.push(`${list5.length + this.evalMessage(data.numbefst2, cache)} ${st2}${middle}${en2}\n`);
                  break;
              }
            } catch (err) {
              if (debug === 0) console.error(err);
            }

            list4 = list2.join('');
          }

          this.storeValue(list4, storage, varName2, cache);
          this.callNextAction(cache);
        } catch (err) {
          if (debug === 0) console.error(err);
        }
      }
    }
  },

  mod() {},
};

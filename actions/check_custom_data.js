module.exports = {
  name: 'Check Custom Data',
  section: 'Data',
  fields: ['filePath', 'value', 'branch', 'jsonPath', 'comparison', 'varName', 'storage'],

  meta: {
    version: '2.1.2',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods/tree/main/actions/check_custom_data.js',
  },

  subtitle(data, presets) {
    return `${presets.getConditionsText(data)}`;
  },

  html() {
    return `
    <div style="padding-bottom: 12px">
    <div style="width: 40%; float: left;">
      <span class="dbminputlabel">Path</span> <br>
      <input placeholder="./data/" value="./data/" id="filePath" class="round" type="text">
    </div>
    <!-- ----------------------------- -->
    <div style="width: 60%; float: left; padding-left: 5%;">
      <span class="dbminputlabel">Data</span> <br>
      <input id="jsonPath" class="round" type="text">
    </div>
    </div> <br><br><br>
    <!-- ----------------------------- -->
    <div style="padding-bottom: 12px">
      <div style="float: left; width: 40%;">
      <span class="dbminputlabel">Comparison Type</span><br>
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
    <!-- ----------------------------- -->
      <div style="float: left; width: 60%; padding-left: 5%;">
        <span class="dbminputlabel">Value to Compare to</span><br>
        <input id="value" class="round" type="text" name="is-eval">
      </div>
    </div> <br><br><br>
    <!-- ----------------------------- -->

    <hr class="subtlebar">

    <conditional-input id="branch" style="padding-top: 16px;"></conditional-input>
`;
  },

  preInit(data, formatters) {
    return formatters.compatibility_2_0_0_iftruefalse_to_branch(data);
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const Mods = this.getMods();
    const fs = Mods.require('fs-extra');
    const path = Mods.require('path');
    const filepath = data.filePath;
    const fpath = this.evalMessage(filepath, cache);
    const compare = parseInt(data.comparison, 10);
    const fileformat = path.extname(filepath);
    let file = '';
    let val1 = '';
    const val2 = this.evalMessage(data.value, cache);

    let result = '';

    if (fileformat === '.json') {
      try {
        let jsonPath = this.evalMessage(data.jsonPath, cache);
        const split = jsonPath.split('/');

        for (let tt = 1; tt <= split.length - 1; tt++) {
          jsonPath = jsonPath.replace('/', '"]["');
        }

        jsonPath = jsonPath !== '' ? `json["${jsonPath}"]` : 'json';

        try {
          if (fileformat === '.json') {
            file = fs.readFileSync(fpath, 'utf8');
            const _json = JSON.parse(file);
            eval(`val1 = ${jsonPath}`);
          } else {
            console.error(`the file format should be .json!`);
          }
        } catch (e) {
          console.error(e);
        }
      } catch (err) {
        val1 = undefined;
      }
    }

    switch (compare) {
      case 0:
        result = val1 !== undefined;
        break;
      case 1:
        result = val1 === val2;
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
    }
    this.executeResults(result, data?.branch ?? data, cache);
  },

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  mod() {},
};

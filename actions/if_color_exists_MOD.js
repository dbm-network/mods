module.exports = {
  name: 'Check if Hex Color Code Exists',
  section: 'Raikin Mods',
  meta: {
    version: '2.1.7',
    author: 'raikin',
    authorUrl: 'Your GitHub URL',
  },

  subtitle(data, presets) {
    return `Check if Hex Color Code is Valid: ${presets.getConditionsText(data)}`;
  },

  fields: ['colorCode', 'branch'],

  html() {
    return `
<div style="float: left; width: 60%">
  <span class="dbminputlabel">Hex Color Code</span>
  <input id="colorCode" class="round" type="text" placeholder="Enter hex color code">
</div>
<br><br><br>

<conditional-input id="branch" style="padding-top: 8px;"></conditional-input>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const colorCode = this.evalMessage(data.colorCode, cache);
    let result;

    if (isValidHexColorCode(colorCode)) result = true;
    else result = false;

    this.executeResults(result, data?.branch ?? data, cache);
  },

  modInit(data) {
    this.prepareActions(data.branch?.iftrueActions);
    this.prepareActions(data.branch?.iffalseActions);
  },

  mod() {},
};

function isValidHexColorCode(hexColorCode) {
  // Regular expression to check if the provided input is a valid hex color code
  const hexColorRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
  return hexColorRegex.test(hexColorCode);
}

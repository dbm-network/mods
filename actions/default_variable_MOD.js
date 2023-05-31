module.exports = {
  name: 'Default Variable',
  section: 'Variable Things',
  fields: ['storage', 'varName', 'mode', 'defaultTo'],
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/default_variable_MOD.js',
  },

  subtitle(data, presets) {
    return `${data.mode
      .split('')
      .map((c, i) => (i === 0 ? c.toUpperCase() : c))
      .join('')} Mode - ${presets.getVariableText(data.storage, data.varName)} - Default: ${data.defaultTo || 'None'}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Unknown Type'];
  },

  html() {
    return `
<p>This action sets a variable to a default value if it's empty.</p>
<retrieve-from-variable dropdownLabel="Variable" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></retrieve-from-variable>
<br><br><br><br>
<span class="dbminputlabel">Mode</span>
<select id="mode" class="round">
  <option value="normal">Normal (null, undefined)</option>
  <option value="strict">Strict (null, undefined, 0, false)</option>
</select>
<br>
<span class="dbminputlabel">Default Value</span>
<input id="defaultTo" class="round" type="text">
`;
  },

  action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const variable = this.getVariable(type, varName, cache);
    const defaultTo = this.evalMessage(data.defaultTo, cache);

    const { mode } = data;

    switch (mode) {
      case 'normal':
        if (variable === undefined || variable === null) this.storeValue(defaultTo, type, varName, cache);
        break;
      case 'strict':
        if (variable === undefined || variable === null || variable === 0 || variable === false)
          this.storeValue(defaultTo, type, varName, cache);
        break;
      default:
        break;
    }

    this.callNextAction(cache);
  },
};

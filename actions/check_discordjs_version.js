module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Check Discord.js Version',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Bot Control',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return 'Store Discord.js version information';
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: null,
    authorUrl: 'https://github.com/master3395/dbm-mods',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['infoType', 'storage', 'varName'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
<div style="padding-top: 8px;">
  <span class="dbminputlabel">Information Type</span><br>
  <select id="infoType" class="round">
    <option value="full">Full Version (e.g., "14.11.0")</option>
    <option value="major">Major Version (e.g., "14")</option>
    <option value="minor">Minor Version (e.g., "11")</option>
    <option value="patch">Patch Version (e.g., "0")</option>
    <option value="isV14">Is v14? (true/false)</option>
    <option value="isV13">Is v13? (true/false)</option>
  </select>
</div>

<br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  action(cache) {
    const data = cache.actions[cache.index];
    const DBM = this.getDBM();
    const DiscordJS = DBM.DiscordJS;
    const version = DiscordJS.version || '0.0.0';
    const versionParts = version.split('.').map((v) => parseInt(v, 10) || 0);
    const majorVersion = DBM.getDiscordJSMajorVersion ? DBM.getDiscordJSMajorVersion() : versionParts[0];
    const isV14 = DBM.isDiscordJSv14 ? DBM.isDiscordJSv14() : majorVersion >= 14;
    const isV13 = DBM.isDiscordJSv13 ? DBM.isDiscordJSv13() : majorVersion === 13;

    let result;
    switch (data.infoType) {
      case 'full':
        result = version;
        break;
      case 'major':
        result = majorVersion.toString();
        break;
      case 'minor':
        result = versionParts[1]?.toString() || '0';
        break;
      case 'patch':
        result = versionParts[2]?.toString() || '0';
        break;
      case 'isV14':
        result = isV14;
        break;
      case 'isV13':
        result = isV13;
        break;
      default:
        result = version;
    }

    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    this.storeValue(result, storage, varName, cache);
    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};

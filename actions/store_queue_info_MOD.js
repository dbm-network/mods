module.exports = {
  name: 'Store Queue Info',
  section: 'Music Control',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_queue_info_MOD.js',
  },
  requiresAudioLibraries: true,
  fields: ['queueObject', 'varName0', 'info', 'storage', 'varName'],

  subtitle({ info }) {
    const names = [
      'Tracks',
      'Previous Tracks',
      'Is Playing?',
      'Repeat Mode',
      'Progress Bar',
      'REMOVED OPTION',
      'Current Track',
      'Queue Channel',
      'Queue Object',
    ];
    return `${names[parseInt(info, 10)]}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [
      data.varName,
      [
        'Tracks',
        'Previous Tracks',
        'Is Playing?',
        'Repeat Mode',
        'Progress Bar',
        'REMOVED OPTION',
        'Current Track',
        'Queue Channel',
        'Queue Object',
      ][parseInt(data.info, 10)] || 'Queue Info',
    ];
  },

  html(isEvent) {
    return `
    ${
      isEvent
        ? '<retrieve-from-variable dropdownLabel="Queue" selectId="queueObject" variableContainerId="varNameContainer0" variableInputId="varName0"></retrieve-from-variable>'
        : ''
    }

<div style="float: left; width: 100%;">
  <span class="dbminputlabel">Queue Info</span><br>
  <select id="info" class="round">
    <option value="0">Tracks</option>
    <option value="1">Previous Tracks</option>
    <option value="2">Is Playing?</option>
    <option value="3">Repeat Mode</option>
    <option value="4">Progress Bar</option>
    <option value="6">Current Track</option>
    <option value="7">Queue Channel</option>
    <option value="8">Queue Object</option>
  </select>
</div>

<div style="float: left; width: 100%; padding-top: 16px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>
`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);

    const type = parseInt(data.queueObject, 10);
    const varName = this.evalMessage(data.varName0, cache);
    let queue = this.getVariable(type, varName, cache);

    if (!queue) {
      const { useQueue } = require('discord-player');

      const server = cache.server;
      if (!server) return this.callNextAction(cache);

      queue = useQueue(server.id);
      if (!queue) return this.callNextAction(cache);
    }

    let result;
    switch (info) {
      case 0:
        result = queue.tracks;
        break;
      case 1:
        result = queue.history.tracks;
        break;
      case 2:
        result = queue.node.isPlaying();
        break;
      case 3:
        result = queue.repeatMode;
        break;
      case 4:
        result = queue.node.createProgressBar({ timecodes: true });
        break;
      case 6:
        result = queue.currentTrack;
        break;
      case 7:
        result = queue.metadata.channel;
        break;
      case 8:
        result = queue;
        break;
      default:
        break;
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(result, storage, varName, cache);
    }
    this.callNextAction(cache);
  },

  mod() {},
};

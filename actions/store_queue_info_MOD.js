module.exports = {
  name: 'Store Queue Info',
  section: 'Audio Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_queue_info_MOD.js',
  },
  requiresAudioLibraries: true,
  fields: ['info', 'storage', 'varName'],

  subtitle({ info }) {
    const names = [
      'Tracks',
      'Previous Tracks',
      'Is Playing?',
      'Repeat Mode',
      'Progress Bar',
      'Formatted Track List',
      'Now Playing',
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
        'Formatted Track List',
        'Now Playing',
      ][parseInt(data.info, 10)] || 'Queue Info',
    ];
  },

  html() {
    return `
<div style="float: left; width: 80%; padding-top: 8px;">
<span class="dbminputlabel">Queue Info</span><br>
  <select id="info" class="round">
    <option value="0">Tracks</option>
    <option value="1">Previous Tracks</option>
    <option value="2">Is Playing?</option>
    <option value="3">Repeat Mode</option>
    <option value="4">Progress Bar</option>
    <option value="5">Formatted Track List</option>
    <option value="6">Now Playing</option>
  </select>
</div>
<br><br><br><br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
`;
  },

  init() {},

  async action(cache) {
    const { Bot } = this.getDBM();
    const data = cache.actions[cache.index];
    const server = cache.msg?.guildId ?? cache.interaction?.guildId;
    const queue = Bot.bot.player.getQueue(server);
    const info = parseInt(data.info, 10);
    let result;

    if (!queue) return this.callNextAction(cache);

    switch (info) {
      case 0:
        result = queue.tracks;
        break;
      case 1:
        result = queue.previousTracks;
        break;
      case 2:
        result = queue.playing;
        break;
      case 3:
        result = queue.repeatMode;
        break;
      case 4:
        result = queue.createProgressBar({ timecodes: true });
        break;
      case 5:
        result = queue.toString();
        break;
      case 6:
        result = queue.nowPlaying();
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

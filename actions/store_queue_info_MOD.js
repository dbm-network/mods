module.exports = {
  name: 'Store Queue Info',
  section: 'Audio Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/store_queue_info_MOD.js'
  },
  requiresAudioLibraries: true,

  subtitle ({ info }) {
    const names = [
      'Tracks',
      'Previous Tracks',
      'Is Playing?',
      'Repeat Mode',
      'Progress Bar'
    ]
    return `${names[parseInt(info, 10)]}`
  },

  fields: ['server', 'info', 'varName', 'storage', 'varName2'],

  variableStorage (data, varType) {
    if (parseInt(data.storage, 10) !== varType) return
    return [
      data.varName2,
      ['Tracks', 'Previous Tracks', 'Is Playing?', 'Repeat Mode', 'Progress Bar'][parseInt(data.info, 10)] || 'Queue Info'
    ]
  },

  html (_isEvent, _data) {
    return `
<server-input dropdownLabel="Source Server" selectId="server" variableContainerId="varNameContainer" variableInputId="varName"></server-input>
<br><br><br>

<div style="float: left; width: 80%; padding-top: 8px;">
<span class="dbminputlabel">Queue Info</span><br>
  <select id="info" class="round">
    <option value="0">Tracks</option>
    <option value="1">Previous Tracks</option>
    <option value="2">Is Playing?</option>
    <option value="3">Repeat Mode</option>
    <option value="4">Progress Bar</option>
  </select>
</div>
<br><br><br><br>

<store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
`
  },

  init () {},

  async action (cache) {
    const { Bot } = this.getDBM()
    const data = cache.actions[cache.index]
    const server = await this.getServerFromData(data.server, data.varName, cache)
    const queue = Bot.bot.player.getQueue(server)
    const info = parseInt(data.info, 10)
    let result

    switch (info) {
      case 0:
        result = queue
        break
      case 1:
        result = queue.tracks
        break
      case 2:
        result = queue.previousTracks
        break
      case 3:
        result = queue.playing
        break
      case 4:
        result = queue.repeatMode
        break
      case 5:
        result = queue.createProgressBar({ timecodes: true })
        break
    }

    if (result !== undefined) {
      const storage = parseInt(data.storage, 10)
      const varName2 = this.evalMessage(data.varName2, cache)
      this.storeValue(result, storage, varName2, cache)
    }
    this.callNextAction(cache)
  },

  mod () {}
}

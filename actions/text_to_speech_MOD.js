module.exports = {
  name: 'Text To Speech',
  section: 'Messaging',
  meta: {
    version: '2.0.11',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/text_to_speech_MOD.js',
  },

  subtitle() {
    return 'Make your Discord bot talk.';
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Audio URL'];
  },

  fields: ['text', 'lang', 'storage', 'varName'],

  html(_isEvent, data) {
    return `
<div>
  <p>This action can not deal with texts which are over than 200 characters.</p>
</div><br>
<div style="width: 90%;">
  Message (to be converted to speech):<br>
  <input id="text" class="round" type="text">
</div><br>
<div style="width: 90%;">
  Language:<br>
  <input id="lang" class="round" type="text">
</div><br>
<div style="float: left; width: 35%;">
  Store Audio URL In:<br>
  <select id="storage" class="round">
    ${data.variables[1]}
  </select>
</div>
<div id="varNameContainer" style="float: right; width: 60%;">
  Variable Name:<br>
  <input id="varName" class="round" type="text">
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const text = this.evalMessage(data.text, cache);
    const language = this.evalMessage(data.lang, cache);
    const Mods = this.getMods();
    const tts = Mods.require('google-tts-api');

    const play = await tts.getAudioUrl(text, {
      lang: language,
      slow: false,
      host: 'https://translate.google.com',
    });
    this.storeValue(play, storage, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};

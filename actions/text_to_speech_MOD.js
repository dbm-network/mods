module.exports = {
  name: 'Text To Speech',
  section: 'Messaging',
  meta: {
    version: '2.1.7',
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

  html() {
    return `
<div>
  <p>This action can not deal with texts which are over than 200 characters.</p>
</div>
<br>

<div style="width: 100%;">
  <span class="dbminputlabel">Message</span>
  <input id="text" class="round" type="text" placeholder="to be converted to speech">
</div>
<br>

<div style="width: 100%;">
  <span class="dbminputlabel">Language</span>
  <input id="lang" class="round" type="text">
</div>
<br>

<div>
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
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

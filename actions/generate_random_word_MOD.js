module.exports = {
  name: 'Generate Random Word(s)',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/generate_random_word_MOD.js',
  },

  subtitle() {
    return 'Generate Random Word(s)';
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Text'];
  },

  fields: ['storage', 'varName', 'min', 'max', 'wps'],

  html() {
    return `
<div>
  <div style="float: left; width: 45%;">
    <span class="dbminputlabel">Minimum Range</span>
    <input id="min" class="round" type="text"><br>
  </div>
  <div style="padding-left: 5%; float: left; width: 50%;">
    <span class="dbminputlabel">Maximum Range</span>
    <input id="max" class="round" type="text"><br>
  </div>
  <br>
  
  <div style="float: left; width: 45%;">
    <span class="dbminputlabel">Words per string</span>
    <input id="wps" class="round" type="text"><br>
  </div><br><br><br>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>`;
  },

  init() {},

  async action(cache) {
    const Mods = this.getMods();
    const randomWords = Mods.require('random-words');
    const data = cache.actions[cache.index];
    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const wps = parseInt(this.evalMessage(data.wps, cache), 10);
    const min = parseInt(this.evalMessage(data.min, cache), 10);
    const max = parseInt(this.evalMessage(data.max, cache), 10) + 1;

    if (isNaN(min)) {
      console.log(`Error with Generate Random Word(s), Action #${cache.index}: min is not a number`);
      return this.callNextAction(cache);
    } else if (isNaN(max)) {
      console.log(`Error with Generate Random Word(s), Action #${cache.index}: max is not a number`);
      return this.callNextAction(cache);
    } else if (isNaN(wps)) {
      console.log(`Error with Generate Random Word(s), Action #${cache.index}: Words Per Sentence is not a number`);
      return this.callNextAction(cache);
    }

    const words = randomWords({ min, max, wordsPerString: wps });
    this.storeValue(words, type, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};

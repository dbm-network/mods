module.exports = {
  name: 'Slice',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/slice_MOD.js',
  },

  subtitle() {
    return 'Slice anything!';
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Sliced Result'];
  },

  fields: ['slice', 'startingNumber', 'sliceLength', 'storage', 'varName'],

  html() {
    return `
<div>
  <span class="dbminputlabel">Slice Text</span><br>
  <textarea id="slice" rows="2" placeholder="Insert message here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
</div>

<div style="float: left; width: 45%; padding-top: 8px;">
  <span class="dbminputlabel">Slice Starting Number</span><br>
  <input id="startingNumber" class="round" type="text">
</div>
<div style="float: right; width: 45%; padding-top: 8px;">
  <span class="dbminputlabel">Slice Length</span><br>
  <input id="sliceLength" class="round" type="text">
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></store-in-variable>
</div>
<br><br><br><br>

<div id="RandomText" style="padding-top: 8px;">
  <p>
  example text: you are the best<br>
  If you want to slice <b>you</b>, starting number = 0, slice length = 3.
  </p>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const type = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const sliceText = this.evalMessage(data.slice, cache);
    const startingFrom = parseInt(this.evalMessage(data.startingNumber, cache), 10);
    const sliceLength = parseInt(this.evalMessage(data.sliceLength, cache), 10);

    if (startingFrom < 0) return console.log('Your number can not be less than 0.');
    if (sliceLength === 0) return console.log('Slice length can not be 0.');
    if (!sliceText) return console.log('Please write something to slice.');
    if (!startingFrom && startingFrom !== 0) return console.log('Please write a starting number.');
    if (!sliceLength) return console.log('Slice length can not be empty');

    const result = `${sliceText}`.slice(`${startingFrom}`, `${sliceLength + startingFrom}`);

    this.storeValue(result, type, varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};

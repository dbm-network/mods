module.exports = {
  name: 'Action Anchor',
  section: 'Other Stuff',
  
  meta: {
    version: '2.0.9',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadUrl: null,
  },

  subtitle(data) {
    return data.anchorName
      ? `<font color="${data.color}">${data.anchorName}</font>`
      : `Create ${
          data.anchorName
            ? `the "<font color="${data.color}">${data.anchorName}</font>" anchor at the current position!`
            : 'an anchor!'
        }`;
  },

  fields: ['anchorName', 'color'],

  html() {
    return `
<span class="dbminputlabel">Anchor Name</span><br>
<input id="anchorName" class="round" type="text">

<br>

<div style="float: left; width: calc(25%);">
<span class="dbminputlabel">Anchor Color</span><br>
<input id="color" class="round" type="color"><br>
</div>`;
  },

  init() {},

  action(cache) {
    this.callNextAction(cache);
  },

  modInit(data, customData, index) {
    if (!customData.anchors) {
      customData.anchors = {};
    }
    customData.anchors[data.anchorName] = index;
  },

  mod() {},
};

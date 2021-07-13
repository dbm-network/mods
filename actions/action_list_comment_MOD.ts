interface SubtitleData {
  color: string;
  comment: string;
}

module.exports = {
  name: 'Comment',
  section: 'Other Stuff',

  subtitle(data: SubtitleData) {
    return `<font color="${data.color}">${data.comment}</font>`;
  },

  fields: ['comment', 'color'],

  html() {
    return `
<div style="float: left; width: 99%;">
  Text Color:<br>
  <input type="color" id="color"><br>
  Comment To Show: (Supports some HTML Tags)<br>
  <input id="comment" class="round" type="text"><br>
</div>`;
  },

  init() {},

  action(cache: any) {
    this.callNextAction(cache);
  },

  mod() {},
};

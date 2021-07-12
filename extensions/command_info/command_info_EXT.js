module.exports = {
  name: 'Command Info',
  isCommandExtension: true,
  isEventExtension: false,
  isEditorExtension: false,

  fields: ['category', 'description', 'include'],

  defaultFields: {
    category: 'None',
    description: 'No Description',
    include: 'No',
  },

  size() {
    return { height: 425, width: 500 };
  },

  html(data) {
    let options = '<option value="Yes">Yes</option><option value="No">No</option>';
    if (data.include === 'No') {
      options = '<option value="No">No</option><option value="Yes">Yes</option>';
    }

    return `
<div style="float: left; width: 99%; margin-left: auto; margin-right: auto; padding:10px;">
  <h2 style="text-align: center;">Command Info</h2>
  <p>
    <u>Extention Info:</u><br>
    This will add an additional field to your raw data for use in an automatic help command<br>
    <a href="#" onclick="require('child_process').execSync('start https://www.silversunset.net/paste/raw/231')">This RAW DATA</a> is <b>required</b> to use this extention.<br>
  </p>

  Category:
  <input id="category" class="round" type="text" value=${data.category} style="width:99%"><br>
  Description:
  <textarea id="description" rows="3" placeholder="Insert description here..." style="width: 99%; font-family: monospace; white-space: nowrap; resize: none;">${data.description}</textarea><br>
  Include in Auto Help:
  <select style="width:33%;" id="include" class="round">
    ${options}
  </select>
</div>`;
  },

  init() {},

  close(document, data) {
    data.category = document.getElementById('category').value;
    data.description = document.getElementById('description').value;
    data.include = document.getElementById('include').value;
  },

  mod() {},
};

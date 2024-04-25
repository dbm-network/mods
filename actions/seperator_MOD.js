module.exports = {
  name: 'Separator',
  section: 'Other',
  fields: ['separator', 'color', 'bold', 'underline', 'fontSize'],

  meta: {
    version: '2.1.7',
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/seperator_MOD.js',
  },

  subtitle(data) {
    let style = '';
    if (data.bold === 'true') style += 'font-weight: bold;';
    if (data.underline === 'true') style += 'text-decoration: underline;';
    if (data.fontSize) style += `font-size: ${parseInt(data.fontSize, 10)}px;`;
    const separator = data.separator || 'No separator provided';
    const color = data.color || '#000000';
    return `<span style="color: ${color};${style}">${separator}</span>`;
  },

  html() {
    return `
    <div style="padding-bottom: 50px; padding: 5px 15px 5px 5px">
      <div id="separatorArea" style="float: left; width: 100%;">
        <span class="dbminputlabel">Separator</span>
        <textarea id="separator" placeholder="Enter separator text" class="round" type="textarea" rows="3"></textarea><br>
        Color:<br>
        <input type="color" id="color"><br><br>
        Bold:<br>
        <select id="bold" class="round">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select><br>
        Underline:<br>
        <select id="underline" class="round">
          <option value="true">Yes</option>
          <option value="false">No</option>
        </select><br>
        Font Size (px):<br>
        <input type="number" id="fontSize" class="round" style="width: 80px;" min="1" step="1"><br><br>
      </div>
    </div>`;
  },

  init() {
    const { document } = this;
    const separatorField = document.getElementById('separator');
    const colorField = document.getElementById('color');
    const boldField = document.getElementById('bold');
    const underlineField = document.getElementById('underline');
    const fontSizeField = document.getElementById('fontSize');

    function updateSubtitle() {
      const separatorValue = separatorField.value.trim();
      const colorValue = colorField.value;
      const boldValue = boldField.value === 'true';
      const underlineValue = underlineField.value === 'true';
      const fontSizeValue = fontSizeField.value;
      const subtitle = document.querySelector('.subtitle');
      let style = '';
      if (boldValue) style += 'font-weight: bold;';
      if (underlineValue) style += 'text-decoration: underline;';
      if (fontSizeValue) style += `font-size: ${parseInt(fontSizeValue, 10)}px;`;
      subtitle.innerHTML = `<span style="color: ${colorValue};${style}">${
        separatorValue || 'No separator provided'
      }</span>`;
    }

    separatorField.addEventListener('input', updateSubtitle);
    colorField.addEventListener('input', updateSubtitle);
    boldField.addEventListener('change', updateSubtitle);
    underlineField.addEventListener('change', updateSubtitle);
    fontSizeField.addEventListener('input', updateSubtitle);

    // Trigger subtitle update on initialization
    updateSubtitle();
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const separator = this.evalMessage(data.separator, cache);
    const color = this.evalMessage(data.color, cache);
    const bold = data.bold === 'true';
    const underline = data.underline === 'true';

    // Store separator value if provided
    if (separator !== undefined) {
      cache.separator = separator;
    }

    // Store color value if provided
    if (color !== undefined) {
      cache.color = color;
    }

    // Store bold value if provided
    if (bold !== undefined) {
      cache.bold = bold;
    }

    // Store underline value if provided
    if (underline !== undefined) {
      cache.underline = underline;
    }

    this.callNextAction(cache);
  },

  mod() {},
};

// ---------------------------------------------------------------------
// Defining global array of partials so they are not repeated later on.
// ---------------------------------------------------------------------
const PARTIALS = ['USER', 'GUILD_MEMBER', 'MESSAGE', 'REACTION', 'CHANNEL'];

module.exports = {
  // ---------------------------------------------------------------------
  // Editor Extension Name
  //
  // This is the name of the editor extension displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Bot Partials',

  // ---------------------------------------------------------------------
  // Is Editor Extension
  //
  // Must be true to appear in the main editor context menu.
  // This means there will only be one copy of this data per project.
  // ---------------------------------------------------------------------

  isEditorExtension: true,

  // ---------------------------------------------------------------------
  // Save Button Text
  //
  // Customizes the text of the "Save Extension" at the bottom
  // of the extension window.
  // ---------------------------------------------------------------------

  saveButtonText: 'Save Partials',

  // ---------------------------------------------------------------------
  // Extension Fields
  //
  // These are the fields for the extension. These fields are customized
  // by creating elements with corresponding Ids in the HTML. These
  // are also the names of the fields stored in the command's/event's JSON data.
  // ---------------------------------------------------------------------

  fields: [],

  // ---------------------------------------------------------------------
  // Default Fields
  //
  // The default values of the fields.
  // ---------------------------------------------------------------------

  defaultFields: {
    partials: [],
  },

  // ---------------------------------------------------------------------
  // Extension Dialog Size
  //
  // Returns the size of the extension dialog.
  // ---------------------------------------------------------------------

  size() {
    return { width: 320, height: 190 };
  },

  // ---------------------------------------------------------------------
  // Extension HTML
  //
  // This function returns a string containing the HTML used for
  // the context menu dialog.
  // ---------------------------------------------------------------------

  html(data) {
    if (!data.partials) {
      data.partials = [];
    }

    let result = `
      <div style="padding: 24px 16px 16px 16px;">
        <div style="padding: 0px 24px 0px 24px; text-align: left;">
          <div style="width: 50%; float: left;">
            <input type="radio" id="None" name="RatioButton" value="None" ${
              data.partials.length === 0 ? 'checked' : ''
            }>
            <label for="None">No Partials</label>
          </div>

          <div style="width: 50%; float: left;">
            <input type="radio" id="Custom" name="RatioButton" value="Custom" ${
              data.partials.length > 0 ? 'checked' : ''
            }>
            <label for="Custom">Custom</label>
          </div>
        </div>

        <br><br>

        <hr>

        <br>

        <div style="padding: 0px 24px 0px 24px;">
    `;

    const partialNames = ['User', 'Guild Member', 'Message', 'Reaction', 'Channel (Enables DMs)'];
    for (let i = 0; i < PARTIALS.length; i++) {
      const partial = PARTIALS[i];
      result += `
        <div style="${i === 4 ? 'width: 100%' : 'width: 50%'}; float: left">
          <input type="checkbox" id="${partial}" name="${partial}" value="${partial}" ${
        data.partials.includes(partial) ? 'checked' : ''
      }>
          <label for="${partial}">${partialNames[i]}</label>
        </div>
        ${i % 2 === 1 ? `<div style="height: 24px;"><br></div>` : ''}
      `;
    }

    result += `</div><br></div>`;

    return result;
  },

  // ---------------------------------------------------------------------
  // Extension Dialog Init Code
  //
  // When the HTML is first applied to the extension dialog, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  // ---------------------------------------------------------------------

  init(document, globalObject) {
    function EnableAll(enable) {
      for (let i = 0; i < PARTIALS.length; i++) {
        const val = document.getElementById(PARTIALS[i]);
        val.disabled = !enable;
      }
    }
    document.getElementById('None').onclick = function () {
      EnableAll(false);
      for (let i = 0; i < PARTIALS.length; i++) {
        const val = document.getElementById(PARTIALS[i]);
        val.checked = false;
      }
    };
    document.getElementById('Custom').onclick = function () {
      EnableAll(true);
    };
    if (document.getElementById('Custom').checked) {
      document.getElementById('Custom').onclick();
    } else {
      document.getElementById('None').checked = true;
      document.getElementById('None').onclick();
    }
  },

  // ---------------------------------------------------------------------
  // Extension Dialog Close Code
  //
  // When the dialog is closed, this is called. Use it to save the data.
  // ---------------------------------------------------------------------

  close(document, data, globalObject) {
    const result = [];
    if (document.getElementById('Custom').checked) {
      for (let i = 0; i < PARTIALS.length; i++) {
        const partial = PARTIALS[i];
        const val = document.getElementById(partial).checked;
        if (val) result.push(partial);
      }
    }
    data.partials = result;
  },

  // ---------------------------------------------------------------------
  // Editor Extension Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  //
  // This is absolutely necessary for editor extensions since it
  // allows us to setup modifications for the necessary functions
  // we want to change.
  //
  // The client object can be retrieved from: `const bot = DBM.Bot.bot;`
  // Classes can be retrieved also using it: `const { Actions, Event } = DBM;`
  // ---------------------------------------------------------------------

  mod(DBM) {
    DBM.Bot.usePartials = function () {
      const partialData = DBM.Files?.data.settings?.['Bot Partials'];
      const partials = partialData?.customData?.['Bot Partials']?.partials;
      return partials?.length > 0;
    };

    DBM.Bot.partials = function () {
      const partialData = DBM.Files?.data.settings?.['Bot Partials'];
      const partials = partialData?.customData?.['Bot Partials']?.partials;
      return partials;
    };
  },
};

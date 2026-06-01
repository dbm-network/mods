module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Show Modal Window',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Messaging',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    if (!data.uniq || data.inputs.length === 0 || !data.title) {
      return 'You have not filled in the required fields!';
    }
    const title = data.title;
    const inputs = data.inputs.length;
    return `Open a modal window "${title}" with ${inputs} fields`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType, cache) {
    if (varType !== 1) return;
    return [data.uniq.replace('msg-', 'modal-'), 'Input Text'];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  //
  // Helps check for updates and provides info if a custom mod.
  // If this is a third-party mod, please set "author" and "authorUrl".
  //
  // It's highly recommended "preciseCheck" is set to false for third-party mods.
  // This will make it so the patch version (0.0.X) is not checked.
  // ---------------------------------------------------------------------

  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods/tree/main/actions/show_modal.js',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  // ---------------------------------------------------------------------

  fields: ['inputs', 'title', 'uniq'],

  // ---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `

        <div style="margin-right: 5%; float: left; width: 55%;">
          <span class="dbminputlabel">Window Title</span><br>
          <input id="title" class="round" type="text" placeholder="My First Modal Window!">
        </div>
        <div style="float: left; width: 40%;">
          <span class="dbminputlabel">Unique ID</span><br>
          <input id="uniq" class="round" type="text" placeholder="Leave blank to auto-generate" ">
        </div><br><br><br>
        <dialog-list 
            id="inputs" 
            fields='["label", "uniqID", "type", "min", "max", "val", "plholder", "req", "ssd"]' 
            dialogTitle="Inputs" 
            dialogWidth="540" 
            dialogHeight="460" 
            listLabel="Inputs" 
            listStyle="height: calc(100vh - 450px);" 
            itemName="Input" 
            itemCols="1" itemHeight="30px;" 
            itemTextFunction="data.label + '['+data.uniqID+']' + ' - '+data.type + '[min: '+data.min + ' | max: ' + data.max + ']'" 
            itemStyle="text-align: left; line-height: 30px;">
          <div style="padding: 4%">
              <div style="margin-right: 5%; float: left; width: 55%;">
                <span class="dbminputlabel">Label</span><br>
                <input id="label" class="round" type="text">
              </div>
              <div style="float: left; width: 40%;">
                <span class="dbminputlabel">Unique ID</span><br>
                <input id="uniqID" class="round" type="text" placeholder="Leave blank to auto-generate" ">
              </div><br><br><br>
              <div style="margin-right: 5%; margin-top: 15px; float: left; width: 28%;">
                <span class="dbminputlabel">Type</span><br>
                <select id="type" class="round">
                  <option value="SHORT" selected>Short</option>
                  <option value="LONG">Long</option>
                </select>
              </div>
              <div style="float: left; width: 33%; margin-top: 15px; margin-top: 15px;">
              <style>
              .minmax {
                  width: 65px !important;
                  float: left;
                  border: 1px solid rgba(240, 240, 240, 0.5) !important;
                  color: #ccc;
                  border-radius: 4px;
                  box-sizing: border-box;
                  display: inline-flex;
                  height: 28px;
                  padding-left: 8px;
                  background-color: #36393e;
              }

              .minmax[id="min"] {
                border-end-end-radius: 0px !important;
                border-start-end-radius: 0px !important;
              }
              .minmax[id="max"] {
                border-start-start-radius: 0px !important;
                border-end-start-radius: 0px !important;
              }
            </style>
                <span class="dbminputlabel">Text Length</span><br>
                <input id="min" class="minmax" type="number" placeholder="min">
                <input id="max" class="minmax" type="number" placeholder="max">
              </div>
              <div style="margin-top: 15px; float: left; width: 33%;">
                <span class="dbminputlabel">Start Value</span><br>
                <input id="val" class="round" type="text">
              </div><br><br><br>
              <div style="margin-top: 15px; margin-right: 5%; float: left; width: 55%;">
                <span class="dbminputlabel">Placeholder</span><br>
                <input id="plholder" class="round" type="text">
              </div>
              <div style="margin-top: 15px; float: left; width: 40%;">
                <span class="dbminputlabel">Set Required</span><br>
                <select id="req" class="round">
                  <option value="true" selected>True</option>
                  <option value="false">False</option>
                </select>
              </div><br><br><br><br>
              <style>
          .blacktable {
              border: 1px solid rgba(240, 240, 240, 0.5) !important;
              color: #ccc;
              border-radius: 4px;
              width: 100%;
              height: 100%;
              padding: 8px;
              background-color: #36393e;
          }
        </style>
              <div class="blacktable">
                  <span>Text from this field will be saved in</span>
                  <input id="ssd" style="border: none;
                  background-color: transparent;
                  box-shadow: none;
                  width: auto;
                  text-decoration: underline;" type="text">
              </div>
          </div>
        </dialog-list><br>
        <style>
          .blacktable {
              border: 1px solid rgba(240, 240, 240, 0.5) !important;
              color: #ccc;
              border-radius: 4px;
              width: 100%;
              height: 100%;
              padding: 8px;
              background-color: #36393e;
          }
        </style>
        <div class="blacktable">
        Modal windows can only be opened with a slash command or a button or select menu
        </div><br>
        <div class="blacktable">
        Attention!<br>
        Modal windows are an event they don't support "reply" and "ephemeral" messages<br>
        but it support buttons and select menus<br>
        </div>
    `;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Editor On Save
  //
  // When the data for the action is saved, this function is called.
  // It provides the ability to modify the final data associated with
  // the action by retrieving it as an argument and returning a modified
  // version through the return value. This can be used to verify the
  // data and fill required entries the user did not.
  //
  // Its inclusion within action mods is optional.
  // ---------------------------------------------------------------------

  onSave(data, helpers, cache) {
    for (let i = 0; i < data.inputs.length; i++) {
      data.inputs[i].ssd = `\$\{tempVars("${data.uniq.replace('msg-', 'modal-')}")[${i}]}`;
      if (data.inputs[i].uniqID === '') {
        data.inputs[i].uniqID = `msg-modal-${helpers.generateUUID().substring(0, 7)}`;
      }
    }
    return data;
  },

  // ---------------------------------------------------------------------
  // Action Editor On Paste
  //
  // When the data for the action is pasted, this function is called.
  // It provides the ability to modify the final data associated with
  // the action by retrieving it as an argument and returning a modified
  // version through the return value.
  //
  // Its inclusion within action mods is optional.
  // ---------------------------------------------------------------------

  onPaste(data, helpers) {
    if (data.uniq === '') {
      data.uniq = `msg-${helpers.generateUUID().substring(0, 7)}`;
    }

    for (let i = 0; i < data.inputs.length; i++) {
      data.inputs[i].ssd = `\$\{tempVars("${data.uniq.replace('msg-', 'modal-')}")[${i}]}`;
      if (data.inputs[i].uniqID === '') {
        data.inputs[i].uniqID = `msg-modal-${helpers.generateUUID().substring(0, 7)}`;
      }
    }
    return data;
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const { Modal, TextInputComponent, showModal } = require('discord-modals'); // Now we extract the showModal method
    const discordModals = require('discord-modals');
    const title = this.evalMessage(data.title, cache);
    const CustomId = this.evalMessage(data.uniq, cache);
    const components = [];

    const Bot = this.getDBM().Bot;
    const client = Bot.bot;
    discordModals(client);

    for (let i = 0; i < data.inputs.length; i++) {
      const uniqueId = this.evalMessage(data.inputs[i].uniqID, cache);
      const label = this.evalMessage(data.inputs[i].label, cache);
      const min = this.evalMessage(data.inputs[i].min, cache);
      const max = this.evalMessage(data.inputs[i].max, cache);
      const placeholder = this.evalMessage(data.inputs[i].plholder, cache);

      components.push(
        new TextInputComponent() // We create a Text Input Component
          .setCustomId(uniqueId)
          .setLabel(label)
          .setStyle(data.inputs[i].type) // IMPORTANT: Text Input Component Style can be 'SHORT' or 'LONG'
          .setMinLength(min)
          .setMaxLength(max)
          .setPlaceholder(placeholder)
          .setRequired(data.inputs[i].req), // If it's required or not
      );
    }

    const resultd = [];
    const modal = new Modal().setTitle(title).setCustomId(CustomId).addComponents(components);
    showModal(modal, {
      client, // Client to show the Modal through the Discord API.
      interaction: cache.interaction, // Show the modal with interaction data.
    });

    Bot.bot.on('modalSubmit', async (modal) => {
      if (modal.customId === CustomId) {
        for (let i = 0; i < data.inputs.length; i++) {
          resultd.push(modal.getTextInputValue(data.inputs[i].uniqID));
        }
        await modal.reply({ ephemeral: true }).catch((e) => console.log(''));
        await modal.deleteReply().catch((e) => console.log(''));
        await this.storeValue(resultd, 1, CustomId.replace('msg-', 'modal-'), cache);
        await this.callNextAction(cache);
      }
    });
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  // ---------------------------------------------------------------------

  mod() {},
};

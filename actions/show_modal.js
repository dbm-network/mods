module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Show Modal',

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
    return `"${data.title}" with ${data.textInputs.length} Text Inputs`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    if (varType !== 1) return;
    if (!data.textInputs) return;
    const result = [];
    for (let i = 0; i < data.textInputs.length; i++) {
      if (data.textInputs[i].id) {
        result.push(data.textInputs[i].id);
        result.push('Text from Input');
      }
    }
    return result;
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

  meta: { version: '2.2.0', preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  // ---------------------------------------------------------------------

  fields: ['title', 'textInputs'],

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
<span class="dbminputlabel">Modal Title</span><br>
<input id="title" class="round" type="text" value="My Modal">

<br><br>

<dialog-list id="textInputs" fields='["name", "placeholder", "minLength", "maxLength", "id", "row", "style", "required"]' dialogTitle="Text Input Info" dialogWidth="600" dialogHeight="370" listLabel="Text Inputs" listStyle="height: calc(100vh - 300px);" itemName="Text Input" itemCols="1" itemHeight="40px;" itemTextFunction="data.name + ' (' + (data.style === 'PARAGRAPH' ? 'Paragraph)' : 'One-Line)')" itemStyle="line-height: 40px;">
	<div style="padding: 16px;">
		<div style="width: calc(50% - 12px); float: left;">
			<span class="dbminputlabel">Name</span>
			<input id="name" class="round" type="text">

			<br>

			<span class="dbminputlabel">Placeholder</span><br>
			<input id="placeholder" class="round" type="text">

			<br>

			<span class="dbminputlabel">Minimum Length</span>
			<input id="minLength" placeholder="0" class="round" type="text" value="0">

			<br>

			<span class="dbminputlabel">Maximum Length</span>
			<input id="maxLength" placeholder="1000" class="round" type="text" value="1000">

			<br>
		</div>
		<div style="width: calc(50% - 12px); float: right;">
			<span class="dbminputlabel">Temp Var ID</span>
			<input id="id" placeholder="Leave blank to disallow..." class="round" type="text">

			<br>

			<span class="dbminputlabel">Action Row (1 - 5)</span>
			<input id="row" placeholder="Leave blank for default..." class="round" type="text">

			<br>

			<span class="dbminputlabel">Style</span>
			<select id="style" class="round">
				<option value="SHORT">One Line</option>
				<option value="PARAGRAPH">Paragraph</option>
			</select>

			<br>

			<span class="dbminputlabel">Required?</span>
			<select id="required" class="round">
				<option value="true">Yes</option>
				<option value="false">No</option>
			</select>
		</div>

	</div>
</dialog-list>`;
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
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];

    const tempVariableNames = [];
    let componentsArr = [];

    if (Array.isArray(data.textInputs)) {
      const existingTempVars = [];
      for (let i = 0; i < data.textInputs.length; i++) {
        const textInput = data.textInputs[i];

        const unusedNameTemplate = 'unusedTempVarName';
        let j = 0;
        let unusedName = `${unusedNameTemplate}0`;
        while (existingTempVars.includes(unusedName)) {
          unusedName = unusedNameTemplate + ++j;
        }

        const textInputData = this.generateTextInput(textInput, unusedName, cache);
        this.addTextInputToActionRowArray(componentsArr, this.evalMessage(textInput.row, cache), textInputData, cache);
        existingTempVars.push(textInputData.customId);
        if (textInput.id) {
          tempVariableNames.push(textInputData.customId);
        }
      }
    }

    // if select components ever become valid components for modals
    // in the future, copy the html from send_message.js,
    // remove the action input, and uncomment the following code:
    /*
		if (Array.isArray(data.selectMenus)) {
			for (let i = 0; i < data.selectMenus.length; i++) {
				const select = data.selectMenus[i];
				const selectData = this.generateSelectMenu(select, cache);
				this.addSelectToActionRowArray(componentsArr, this.evalMessage(select.row, cache), selectData, cache);
			}
		}
		*/

    if (componentsArr.length > 0) {
      const { ComponentType } = this.getDBM().DiscordJS;
      componentsArr = componentsArr
        .filter((comps) => comps.length > 0)
        .map(function (comps) {
          return {
            type: ComponentType.ActionRow,
            components: comps,
          };
        });
    }

    if (cache.interaction) {
      if (cache.interaction.showModal) {
        const modalData = {
          customId: cache.interaction.id,
          title: this.evalMessage(data.title, cache),
          components: componentsArr,
        };

        this.registerModalSubmitResponses(cache.interaction.id, (newInteraction) => {
          newInteraction.__originalInteraction = cache.interaction;
          cache.interaction = newInteraction;

          for (let i = 0; i < tempVariableNames.length; i++) {
            const name = tempVariableNames[i];
            const val = newInteraction.fields.getTextInputValue(name);
            if (typeof val === 'string') {
              this.storeValue(val, 1, name, cache);
            }
          }

          this.callNextAction(cache);
        });

        cache.interaction.showModal(modalData);
      } else {
        this.displayError(
          data,
          cache,
          'Cannot show modal from current interaction, perhaps attempting to show modal multiple times?',
        );
        this.callNextAction(cache);
      }
    } else {
      this.callNextAction(cache);
    }
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

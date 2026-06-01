module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Loop Through Numbers',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Lists and Loops',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    if (Math.abs(parseInt(data.increment, 10)) === 1) {
      return `Call ${data.actions?.length ?? 0} actions ${Math.abs(data.endNum - data.startNum) + 1} times.`;
    }
    return `Call ${data.actions?.length ?? 0} actions while counting by ${data.increment}, from ${data.startNum} to ${
      data.endNum
    }.`;
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

  fields: ['startNum', 'endNum', 'increment', 'tempVarName', 'type', 'actions'],

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
<tab-system>
	<tab label="Iteration Options" icon="align right">
		<div style="padding: 12px;">
			<div style="display: flex; justify-content: space-between;">
				<div style="width: calc(33% - 8px);">
					<span class="dbminputlabel">Start Number</span><br>
					<input id="startNum" class="round" type="text" value="1">
				</div>

				<div style="width: calc(33% - 8px);">
					<span class="dbminputlabel">End Number</span><br>
					<input id="endNum" class="round" type="text" value="5">
				</div>

				<div style="width: calc(33% - 8px);">
					<span class="dbminputlabel">Increment By</span><br>
					<input id="increment" class="round" type="text" value="1">
				</div>
			</div>
		</div>
	</tab>

	<tab label="Loop Options" icon="cogs">
		<div style="padding: 12px;">
			<div style="display: flex; justify-content: space-between;">
				<div style="width: calc(50% - 12px);">
					<span class="dbminputlabel">Temp Var. Name (stores number)</span><br>
					<input id="tempVarName" class="round" type="text" placeholder="Leave blank for none...">
				</div>

				<div style="width: calc(50% - 12px);">
					<span class="dbminputlabel">Call Type</span><br>
					<select id="type" class="round">
						<option value="true" selected>Wait for Completion</option>
						<option value="false">Process Simultaneously</option>
					</select>
				</div>
			</div>
		</div>
	</tab>
</tab-system>

<br><br><br><br><br><br><br><br>

<action-list-input id="actions" height="calc(100vh - 360px)">
	<script class="setupTempVars">
		const elem = document.getElementById("tempVarName");
		if(elem?.value) {
			tempVars.push([elem.value, "Number"]);
		}
	</script>
</action-list-input>`;
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

  action(cache) {
    const data = cache.actions[cache.index];

    const actions = data.actions;
    if (!actions || actions.length <= 0) {
      this.callNextAction(cache);
      return;
    }

    const startNumText = this.evalMessage(data.startNum, cache);
    const endNumText = this.evalMessage(data.endNum, cache);
    const incrementText = this.evalMessage(data.increment, cache);
    const startNum = parseInt(startNumText, 10);
    const endNum = parseInt(endNumText, 10);
    const increment = parseInt(incrementText, 10);

    let valid = isNaN(startNum) ? 1 : isNaN(endNum) ? 2 : isNaN(increment) ? 3 : 0;
    if (valid === 0) {
      if (increment === 0) {
        valid = 4;
      } else if (increment > 0 && startNum > endNum) {
        valid = 5;
      } else if (increment < 0 && startNum < endNum) {
        valid = 6;
      }
    }

    switch (valid) {
      case 1: {
        this.displayError(data, cache, `Start Number (${startNumText}) is not a valid number.`);
        break;
      }
      case 2: {
        this.displayError(data, cache, `End Number (${endNumText}) is not a valid number.`);
        break;
      }
      case 3: {
        this.displayError(data, cache, `Increment (${incrementText}) is not a valid number.`);
        break;
      }
      case 4: {
        this.displayError(data, cache, `Increment cannot be 0.`);
        break;
      }
      case 5:
      case 6: {
        this.displayError(data, cache, `Increment detected to cause infinite loop.`);
        break;
      }
    }

    if (valid !== 0) {
      this.callNextAction(cache);
      return;
    }

    const waitForCompletion = data.type === 'true';

    const looper = (i) => {
      if ((startNum < endNum && i > endNum) || (startNum > endNum && i < endNum)) {
        if (waitForCompletion) {
          this.callNextAction(cache);
        }
        return;
      }

      this.storeValue(i, 1, data.tempVarName, cache);
      this.executeSubActions(actions, cache, () => looper(i + increment));
    };

    looper(startNum);

    if (!waitForCompletion) {
      this.callNextAction(cache);
    }
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod Init
  //
  // An optional function for action mods. Upon the bot's initialization,
  // each command/event's actions are iterated through. This is to
  // initialize responses to interactions created within actions
  // (e.g. buttons and select menus for Send Message).
  //
  // If an action provides inputs for more actions within, be sure
  // to call the `this.prepareActions` function to ensure all actions are
  // recursively iterated through.
  // ---------------------------------------------------------------------

  modInit(data) {
    this.prepareActions(data.actions);
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

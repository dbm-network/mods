module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Loop Through List',

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
    const list = presets.lists;
    return `Loop ${list[parseInt(data.list, 10)]} through ${data.actions?.length ?? 0} actions.`;
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

  fields: ['list', 'varName', 'tempVarName', 'type', 'actions'],

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
				<div style="width: calc(40% - 12px);">
					<span class="dbminputlabel">Source List</span><br>
					<select id="list" class="round" onchange="glob.onChange1(this)">
						${data.lists[isEvent ? 1 : 0]}
					</select>
				</div>
				<div id="varNameContainer" style="width: calc(60% - 12px);">
					<span class="dbminputlabel">Variable Name</span><br>
					<input id="varName" class="round" type="text" list="variableList">
				</div>
			</div>
		</div>
	</tab>

	<tab label="Loop Options" icon="cogs">
		<div style="padding: 12px;">
			<div style="display: flex; justify-content: space-between;">
				<div style="width: calc(50% - 12px);">
					<span class="dbminputlabel">Temp Var. Name (stores <span id="tempName">member</span>)</span><br>
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
			const typeElem = document.getElementById("list");
			let result = "Unknown Type";
			switch (typeElem.value) {
				case "0":
					result = "Member";
					break;
				case "1":
					result = "Channel";
					break;
				case "4":
					result = "Server";
					break;
				case "2":
				case "5":
				case "6":
					result = "Role";
					break;
				case "3":
					result = "Emoji";
					break;
			}
			tempVars.push([elem.value, result]);
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

  init() {
    const { glob, document } = this;

    glob.onChange1 = function (event) {
      this.listChange(event, 'varNameContainer');
      const id = parseInt(event.value, 10);
      let result = '';
      switch (id) {
        case 0:
          result = 'member';
          break;
        case 1:
          result = 'channel';
          break;
        case 4:
          result = 'server';
          break;
        case 2:
        case 5:
        case 6:
          result = 'role';
          break;
        case 3:
          result = 'emoji';
          break;
        case 7:
        case 8:
        case 9:
          result = 'item';
          break;
      }
      document.getElementById('tempName').innerHTML = result;
    };

    glob.onChange1(document.getElementById('list'));
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

    const actions = data.actions;
    if (!actions) {
      this.callNextAction(cache);
      return;
    }

    const list = await this.getListFromData(data.list, data.varName, cache);

    const waitForCompletion = data.type === 'true';

    const act = actions[0];
    if (list && act && this.exists(act.name)) {
      const looper = (i) => {
        if (!list[i]) {
          if (waitForCompletion) {
            this.callNextAction(cache);
          }
          return;
        }

        this.storeValue(list[i], 1, data.tempVarName, cache);
        this.executeSubActions(actions, cache, () => looper(i + 1));
      };

      looper(0);

      if (!waitForCompletion) {
        this.callNextAction(cache);
      }
    } else {
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

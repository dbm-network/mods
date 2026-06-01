module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Await Interaction',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'DBM-Extended',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },
  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    if (data.time >= 1) {
      return `Await Interaction For ${data.time / 1000} Seconds`;
    }
    return `Await Interaction For 60 Seconds (Default)`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName, 'Unknown Type'];
  },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  // ---------------------------------------------------------------------

  fields: ['type', 'msgvar', 'msgvarname', 'time', 'code', 'timeout', 'storage', 'varName'],

  // ---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  //
  // The "data" parameter stores constants for select elements to use.
  // Each is an array: index 0 for commands, index 1 for events.
  // The names are: sendTargets, members, roles, channels,
  //                messages, servers, variables
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
	<style>
table.scroll {
  width: 525px;
  /* 140px * 5 column + 16px scrollbar width */
  border-spacing: 0;
  border: 2px solid #47494c;
}

table.scroll tbody,
table.scroll thead tr {
  display: block;
}

table.scroll tbody {
  height: 100px;
  overflow-y: auto;
  overflow-x: hidden;
}

table.scroll tbody td,
table.scroll thead th {
  width: 176px;
}

table.scroll thead th:last-child {
  width: 180px;
  /* 140px + 16px scrollbar width */
}

thead tr th {
  height: 30px;
  line-height: 30px;
  /*text-align: left;*/
}

tbody {
  border-top: 2px solid #47494c;
}

.embed {
  position: relative;
}

.embedinfo {
  background: rgba(46, 48, 54, .45) fixed;
  border: 1px solid #2f3237;
  border-radius: 0 3px 3px 0;
  padding: 10px;
  margin: 0 4px 0 7px;
  border-radius: 0 3px 3px 0;
}

embedleftline {
  background-color: #e74c3c;
  width: 4px;
  border-radius: 3px 0 0 3px;
  border: 0;
  height: 100%;
  margin-left: 4px;
  position: absolute;
}

span {
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

span.embed-auth {
  color: rgb(255, 255, 255);
}

span.embed-desc {
  color: #afafaf;
}

span.wrexlink2,
span.wrexlink3 {
  color: #0096cf;
  text-decoration: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: inherit;
}

span.wrexlink2:hover,
span.wrexlink3:hover {
  text-decoration: underline;
}

span.discord_channel {
  background-color: rgba(114, 137, 218, .1);
  color: #7289da;
  cursor: pointer;
  font-family: sans-serif;
  padding: 2px;
}

span.discord_channel:hover {
  background-color: rgba(114, 137, 218, .7);
  color: #fff;
}

span.discord_code_blocks {
  background: #2f3136;
  border: 1.5px solid #2b2c31;
  border-radius: 7px;
  box-sizing: border-box;
  overflow: hidden;
  padding: 8px 10px;
  color: #839496;
  font-family: Consolas
}
</style>


<div>
<p>
<h1>How To Use:</h1>
  ● Put This Action After Your <b>Send Message.</b><br>
  ● If Await Time Runs Out, Result Will Be <b>timeout</b> by "<b>Default</b>"
<br><br>

	<div style="padding-left: 0%; float: left; width: 45%;">
		<span class="dbminputlabel">Interaction Type</span><br>
		<select id="type" class="round">
			<option value="0" selected>Buttons & Menus</option>
		</select>
	</div>
  <div style="padding-left: 5%; float: left; width: 55%;">
  <span class="dbminputlabel">Source Message (ID ONLY)</span><br>
  <input id="msgvar" class="round" type="text" placeholder="Blank = Any Message">
</div>
    <br><br><br>
	<div style="padding-left: 0%; float: left; width: 45%;">
		<span class="dbminputlabel">Await Time (Miliseconds)</span><br>
		<input id="time" class="round" type="text" placeholder="Default = 60,000 Miliseconds">
	</div>
    <div style="padding-left: 5%; float: left; width: 55%;">
		<span class="dbminputlabel">Await Timeout Value</span><br>
		<input id="timeout" class="round" type="text" placeholder="Default = timeout">
	</div>
</div>

<br><br><br>



<store-in-variable allowNone selectId="storage" variableInputId="varName" variableContainerId="varNameContainer"></store-in-variable><br><br><br><br>
	<span class="discord_code_blocks">A DBM-E Modification | Install <a href="https://github.com/DBM-Extended/mods"><b>DBM-E</b></a></span>`;
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

    const msgvar = this.evalMessage(data.msgvar, cache) || 0;
    {
      if (isNaN(msgvar)) {
        console.log(
          `------------ DBME ERROR ------------\n-> \"${msgvar}\" Is not a Message's ID!\n--------- Await Interaction --------\n`,
        );
        return;
      }
    }
    let time = this.evalMessage(data.time, cache) || 60000;
    const timeout = this.evalMessage(data.timeout, cache) || 'timeout';
    const varName = this.evalMessage(data.varName, cache);
    const storage = parseInt(data.storage, 10);

    if (msgvar === 0) {
      var path = `last-interaction`;
    } else {
      var path = `${msgvar}-interaction`;
    }

    const member = await this.getMemberFromData(1, undefined, cache);
    (async () => {
      const sleep = require('sleep-promise');
      member.setData(path, undefined);
      do {
        await sleep(500);
        time -= 500;
        if (time < 500) {
          this.storeValue(timeout, storage, varName, cache);
          break;
        }
        const result = member.data(path);
        if (Boolean(result)) {
          member.setData(path, undefined);
          if (msgvar !== 0) {
            const path2 = member.data(`message-interaction`);
            if (Boolean(path2)) member.setData(path2, undefined);
          }
          this.storeValue(result, storage, varName, cache);
          break;
        } else {
          continue;
        }
      } while (1);
      this.callNextAction(cache);
    })();
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

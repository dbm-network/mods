module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Translation of Info',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: '#Info Translation',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data) {
    const info = [
      'DBMEX Mod Pack',
      'DBMEX Mod Pack',
      'DBMEX Mod Pack',
      'DBMEX Mod Pack',
      'DBMEX Mod Pack',
      'DBMEX Mod Pack',
    ];
    return `${info[parseInt(data.info, 10)]}`;
  },

  // ---------------------------------------------------------------------
  // DBM Mods Manager Variables (Optional but nice to have!)
  //
  // These are variables that DBM Mods Manager uses to show information
  // about the mods for people to see in the list.
  // ---------------------------------------------------------------------

  // Who made the mod (If not set, defaults to "DBM Mods")
  author: 'Giingu',

  // The version of the mod (Defaults to 1.0.0)
  version: '2.1.6', // Added in 2.1.6

  // A short description to show on the mod line for this mod (Must be on a single line)
  short_description: 'DBMEX Mod Pack Information.',

  long_description: '2D > 3D',

  // If it depends on any other mods by name, ex: WrexMODS if the mod uses something from WrexMods

  // ---------------------------------------------------------------------

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    const info = parseInt(data.info, 10);
    let dataType = 'Unknown Type';
    switch (info) {
      case 0:
        dataType = 'Credits';
        break;
      case 1:
        dataType = 'DBMEX';
        break;
    }
    return [data.varName, dataType];
  },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  // ---------------------------------------------------------------------

  fields: ['serverip', 'gametype', 'info', 'storage', 'varName'],

  // ---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editting actions.
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
		<div style="width: 550px; height: 350px; overflow-y: scroll;">
        <div>
		<div class="embed">
            <embedleftline style="background-color: #2b9696;"></embedleftline>
        <div class="embedinfo">
	    <span class="embed-auth"><u>Translation information</u><br>Created by <b>DBM Extended</b></span><br>
	    <span class="embed-desc">You will find the updates <a href="https://github.com/DBM-Extended/mods">here</a><br>Version: 2.1.1 for <br>Mods version: 2.1.6</span>
        </div>
        </div><br>
	<div style="width: 95%; padding-top: 8px;">
		The main creator<br>
		<textarea id="serverip" rows="2" placeholder="Gii#1995" style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
	 </div>
	 <div style="width: 95%; padding-top: 8px;">
	 	Many thanks to<br>
	 	<textarea id="gametype" rows="2" placeholder="MY PARENTS who let me sit for a long time" style="width: 95%; font-family: monospace; white-space: nowrap; resize: none;"></textarea>
		 </div>
	<div style="float: left; width: 55%; padding-top: 8px;">
		Info:<br>
		<select id="info" class="round">
			<option value="0" selected>---Creator---</option>
			<option value="1">DBM Extended</option>
			<option value="2">---Helpers---</option>
			<option value="3">Anime Girls</option>
			<option value="4">nobody</option>
			<option value="5">nobody</option>
				</select>
			</div>
		</div><br><br><br>
	<div>
		<div style="float: left; width: 35%; padding-top: 8px;">
			IGNORE THIS<br>
			<select id="storage" class="round" onchange="glob.variableChange(this, 'varNameContainer')">
				${data.variables[1]}
			</select>
		</div>
		<div id="varNameContainer" style="float: right; width: 60%; padding-top: 8px;">
			IGNORE THIS TOO<br>
			<input id="varName" class="round" type="text"><br>
	</div>
</div>
	<div style="float: left; width: 88%; padding-top: 8px;">
		<br>
		<p>
			<a href="https://discord.gg/shiba
			">DBMEX Support</a><br><a href="https://discord.gg/shiba">DBM Network</a>
		</p>
	<div>
</div>
        
        <style>
        /* START OF EMBED CSS */
        div.embed { /* <div class="embed"></div> */
            position: relative;
        }
            embedleftline { /* <embedleftline></embedleftline> OR if you wan't to change the Color: <embedleftline style="background-color: #HEXCODE;"></embedleftline> */
                background-color: #eee;
                width: 4px;
                border-radius: 3px 0 0 3px;
                border: 0;
                height: 100%;
                margin-left: 4px;
                position: absolute;
            }
            div.embedinfo { /* <div class="embedinfo"></div> */
                background: rgba(46,48,54,.45) fixed;
                border: 1px solid hsla(0,0%,80%,.3);
                padding: 10px;
                margin:0 4px 0 7px;
                border-radius: 0 3px 3px 0;
            }
                span.embed-auth { /* <span class="embed-auth"></span> (Title thing) */
                    color: rgb(255, 255, 255);
                }
                span.embed-desc { /* <span class="embed-desc"></span> (Description thing) */
                    color: rgb(128, 128, 128);
                }
        
                span { /* Only making the text look, nice! */
                    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
                }
                </style>`;
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

    glob.variableChange(document.getElementById('storage'), 'varNameContainer');
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existance.
  // ---------------------------------------------------------------------

  action(cache) {
    const _this = this; // To fix error
    const data = cache.actions[cache.index];
    const info = parseInt(data.info, 10);
    const gametype = _this.evalMessage(data.gametype, cache);
    const host = _this.evalMessage(data.serverip, cache);

    // Main code:
    const WrexMODS = _this.getWrexMods(); // as always.
    WrexMODS.CheckAndInstallNodeModule('game-server-query');
    const query = WrexMODS.require('game-server-query');

    query(
      {
        type: `${gametype}`,
        host: `${host}`,
      },
      function (state) {
        if (state.error) {
          console.log('[Store Game Server Info Mod] Server is offline.');
        } else {
          let result;
          switch (info) {
            case 0:
              result = state.name;
              break;
            case 1:
              result = state.map;
              break;
            case 2:
              result = state.raw.numplayers;
              break;
            case 3:
              result = state.maxplayers;
              break;
            case 4:
              result = state.raw.tags;
              break;
            case 5:
              result = state.password;
              break;
            default:
              break;
          }

          if (result !== undefined) {
            const storage = parseInt(data.storage, 10);
            const varName2 = _this.evalMessage(data.varName, cache);
            _this.storeValue(result, storage, varName2, cache);
            _this.callNextAction(cache);
          } else {
            _this.callNextAction(cache);
          }
        }
      },
    );
  },
  // ---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflictions between mods, be sure to alias
  // functions you wish to overwrite.
  // ---------------------------------------------------------------------

  mod(DBM) {},
}; // End of module

module.exports = {
  //---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  //---------------------------------------------------------------------

  name: 'Await Response Call Action',

  //---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  //---------------------------------------------------------------------

  section: 'Messaging',

  //---------------------------------------------------------------------
  // DBM Mods Manager Variables (Optional but nice to have!)
  //
  // These are variables that DBM Mods Manager uses to show information
  // about the mods for people to see in the list.
  //---------------------------------------------------------------------

  // Who made the mod (If not set, defaults to 'DBM Mods')
  author: 'MrGold, Almeida, General Wrex & EliteArtz', // Code: General Wrex, Style: EliteArtz, New Design and Code: MrGold, Yet New Redesign and Bug Fixes: Almeida & Danno3817

  // The version of the mod (Defaults to 1.0.0)
  version: '1.9.4', // Added in 1.8.8

  // A short description to show on the mod line for this mod (Must be on a single line)
  short_description: 'Awaits Message',

  //---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  //---------------------------------------------------------------------

  fields: ['storage', 'varName', 'filter', 'max', 'time', 'iftrue', 'iftrueVal', 'iffalse', 'iffalseVal', 'storage2', 'varName2'],

  //---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflictions between mods, be sure to alias
  // functions you wish to overwrite.
  //---------------------------------------------------------------------

  mod: function () {},

  //---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  //---------------------------------------------------------------------

  subtitle: function (data) {
    return `Await ${data.max} message${Number(data.max) === 1 ? '' : 's'} for ${data.time} milisecond${Number(data.time) === 1 ? '' : 's'}`;
  },

  //---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  //---------------------------------------------------------------------

  variableStorage: function (data, varType) {
    const type = parseInt(data.storage2);
    if (type !== varType) return;
    return ([data.varName2, 'Message List']);
  },

  //---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editting actions.
  //
  // The 'isEvent' parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  //
  // The 'data' parameter stores constants for select elements to use.
  // Each is an array: index 0 for commands, index 1 for events.
  // The names are: sendTargets, members, roles, channels,
  //                messages, servers, variables
  //---------------------------------------------------------------------

  html: function (isEvent, data) {
    return `
    <div id="wrexdiv2" style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
      <div style="padding: 15px 0;">
        <p>
          <u>Mod Info:</u><br>
          Created by General Wrex & EliteArtz<br>
          Redesign and bug fixes by MrGold, Almeida, Danno3817
        </p>
      </div>
      <div class="codeblock">
        <span style="color: white"><b>Filters Examples:</b><br><br>
          <span style="color:#9b9b9b">
            <span><b>Available variables:</b></span>
            <li>user // Command message author</li>
            <li>user // Command message author</li>
            <li>server // Guild where the command was used</li><br>
            <span><b>Message variables (Message that is being awaited):</b></span>
            <li>content // The message content</li>
            <li>author // The message author</li>
            <li>msg // The message object</li><br>
            <span><b>Content Examples:</b></span>
            <li>content.equals('I accept')<br></li>
            <li>content.includes('DBM is')</li>
            <li>content.startsWith('Hello')</li>
            <li>content.endsWith('bye')</li>
            <li>content.match(/response/)</li>
            <li>content.length > 0 // Take any response</li><br>
            <span><b>Author Examples:</b></span>
            <li>author.id === '123456789012345678'</li>
            <li>author.username === 'Example'</li>
            <li>author.tag === 'Example#1234'</li>
            <li>author.id === user.id</li><br>
            <span><b>Content && Author Examples:</b></span>
            <li>content.length > 0 && author.id === user.id // Take any response from the command message author</li>
            <li>content.length > 0 && author.id === tempVars('some variable') // Take any response from a member with an ID stored in a temp variable</li>
            <u><span class="wrexlink2" data-url2="https://www.w3schools.com/js/js_comparisons.asp">JavaScript Comparison and Logical Operators</span></u>
          </span>
        </span>
      </div><br>
      <div style="width: 100vw;">
        <div style="margin-right: 25px">
          <div style="float: left; width: 35%;">
            Source Channel:<br>
            <select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">${data.channels[isEvent ? 1 : 0]}</select>
          </div>
          <div id="varNameContainer" style="display: none; float: right; width: 60%;">
            Variable Name:<br>
            <input id="varName" class="round" type="text" list="variableList">
          </div>
        </div><br><br><br>
        <div style="margin: 15px 0;">
          <div style="float: left; width: 100%;">
            JavaScript Filter Eval:
            <input id="filter" class="round" type="text" value="content.length > 0 && author.id === user.id">
          </div>
        </div><br><br><br><br>
        <div>
          <div>
            <div style="float: left; width: 37%;">
              Max Messages:<br>
              <input id="max" class="round" type="text" value="1" placeholder="Optional (set to 0 if no limit)"><br>
            </div>
            <div style="float: right; width: 58%; margin-right: 25px;">
              Max Time (miliseconds):<br>
              <input id="time" class="round" type="text" value="60000" placeholder="Optional"><br>
            </div>
          </div><br><br><br>
          <div>
            <div style="float: left; width: 35%;">
              On Respond:<br>
              <select id="iftrue" class="round" onchange="glob.onChangeTrue(this)">
                <option value="0" selected>Continue Actions</option>
                <option value="1">Stop Action Sequence</option>
                <option value="2">Jump To Action</option>
                <option value="3">Skip Next Actions</option>
              </select>
            </div>
            <div id="iftrueContainer" style="display: block; float: right; width: 58%; margin-right: 25px;">
              <span id="iftrueName">Action Number</span>:<br><input id="iftrueVal" class="round" type="text">
            </div>
          </div><br><br><br><br>
          <div>
            <div style="float: left; width: 35%;">
              On Timeout:<br>
              <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
                <option value="0">Continue Actions</option>
                <option value="1" selected>Stop Action Sequence</option>
                <option value="2">Jump To Action</option>
                <option value="3">Skip Next Actions</option>
              </select>
            </div>
            <div id="iffalseContainer" style="display: block; float: right; width: 58%; margin-right: 25px;">
              <span id="iffalseName">Action Number</span>:<br><input id="iffalseVal" class="round" type="text">
            </div>
          </div><br><br><br><br>
          <div>
            <div style="float: left; width: 35%;">
              Store Message/List To:<br>
              <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">${data.variables[0]}</select>
            </div>
            <div id="varNameContainer2" style="display: block; float: right; width: 58%; margin-right: 25px;">
              Variable Name:<br>
              <input id="varName2" class="round" type="text">
            </div>
          </div>
        </div>
      </div>
    </div>
    <style>
      .codeblock {
        margin-right: 25px; background-color: rgba(0,0,0,0.20); border-radius: 3.5px; border: 1px solid rgba(255,255,255,0.15); padding: 4px 8px; font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; transition: border 175ms ease;
      }
      span.wrexlink {
        color: #99b3ff;
        text-decoration:underline;
        cursor:pointer;
      }
      span.wrexlink:hover {
        color:#4676b9;
      }
      span.wrexlink2 {
        color: #99b3ff;
        text-decoration:underline;
        cursor:pointer;
      }
      span.wrexlink2:hover {
        color:#4676b9;
      }
    </style>`
  },

  //---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  //---------------------------------------------------------------------

  init: function () {
    const { glob, document } = this;
    const { execSync } = require('child_process');

    glob.channelChange(document.getElementById('storage'), 'varNameContainer');
    glob.variableChange(document.getElementById('storage2'), 'varNameContainer2');
    glob.onChangeTrue(document.getElementById('iftrue'));
    glob.onChangeFalse(document.getElementById('iffalse'));

    const wrexlink = document.getElementsByClassName('wrexlink');
    for (let i = 0; i < wrexlink.length; i++) {
      const { getAttribute, setAttribute, addEventListener } = wrexlink[i];
      const url = getAttribute('data-url');
      if (url) {
        setAttribute('title', url);
        addEventListener('click', function ({ stopImmediatePropagation }) {
          stopImmediatePropagation();
          console.log(`Launching URL: [${url}] in your default browser.`);
          execSync(`start ${url}`);
        });
      }
    }

    const wrexlink2 = document.getElementsByClassName('wrexlink2');
    for (let i = 0; i < wrexlink2.length; i++) {
      const { getAttribute, setAttribute, addEventListener } = wrexlinks[i];
      const url = getAttribute('data-url2');
      if (url) {
        setAttribute('title', url2);
        addEventListener('click', function ({ stopImmediatePropagation }) {
          stopImmediatePropagation();
          console.log(`Launching URL: [${url}] in your default browser.`)
          execSync(`start ${url}`);
        });
      }
    }
  },

  //---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the 'msg' parameter,
  // so be sure to provide checks for variable existance.
  //---------------------------------------------------------------------

  action: function (cache) {
    const data = cache.actions[cache.index];

    const varName = this.evalMessage(data.varName, cache);
    const channel = this.getChannel(parseInt(data.storage), varName, cache);
    const storage = parseInt(data.storage2);
    const varName2 = this.evalMessage(data.varName2, cache);

    if (channel) {
      const filter = this.evalMessage(data.filter, cache);
      const max = parseInt(this.evalMessage(data.max, cache));
      const time = parseInt(this.evalMessage(data.time, cache));

      channel.awaitMessages(function (msg) {
        const user = cache.msg.author, member = cache.msg.member, server = cache.server;
        const content = msg.content, author = msg.author;

        try {
          return !!eval(filter);
        } catch (_) {
          return false;
        }
      }, { max, time, errors: ['time'] }).then((collected) => {
        this.storeValue(collected.size === 1 ? collected.first() : collected.array(), storage, varName2, cache);
        this.executeResults(true, data, cache);
      }).catch(() => {
        this.executeResults(false, data, cache);
      }).catch((err) => {
        console.error(err.stack || err);
      });
    }
  },
}

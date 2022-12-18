/* eslint-disable no-unused-vars */

module.exports = {
  name: 'Await Response Call Action',
  displayName: 'Await Response',
  section: 'Messaging',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/await_response_call_action_MOD.js',
  },
  fields: [
    'storage',
    'varName',
    'filter',
    'max',
    'time',
    'iftrue',
    'iftrueVal',
    'iffalse',
    'iffalseVal',
    'storage2',
    'varName2',
  ],

  subtitle({ max, time }) {
    const getPlural = (n) => (n !== '1' ? 's' : '');
    return `Await ${max} message${getPlural(max)} for ${time} millisecond${getPlural(time)}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName2, parseInt(data.max, 10) === 1 ? 'Message' : 'Message List'];
  },

  html(isEvent, data) {
    return `
  <div style="width: 550px; height: 350px; overflow-y: scroll; overflow-x: hidden;">
    <div>
    <details>
      <summary><span style="color: white"><b>Filter Examples:</b></summary>
      <div class="codeblock">
        <span style="color:#9b9b9b">
          <span><b>Available variables:</b></span>
          <li>user // Command message author</li>
          <li>server // Guild where the command was used</li><br>
          <span><b>Message variables (Message that is being awaited):</b></span>
          <li>content // The message content</li>
          <li>author // The message author</li>
          <li>msg // The message object</li><br>
          <span><b>Content Examples:</b></span>
          <li>content === 'insert content here'<br></li>
          <li>content.includes('insert something here')</li>
          <li>content.startsWith('Start')</li>
          <li>content.endsWith('end.')</li>
          <li>content.match(/^\\d+$/g) // Responses with numbers only</li>
          <li>content.length > 0 // Take any response</li><br>
          <span><b>Author Examples:</b></span>
          <li>author.id === '123467823521843898'</li>
          <li>author.username === 'Clyde'</li>
          <li>author.tag === 'Clyde#0000'</li>
          <li>author.id === user.id</li><br>
          <span><b>Content + Author examples:</b></span>
          <li>content.length > 0 && author.id === user.id // Take any response from the command message author</li>
          <li>content.length > 0 && author.id === tempVars('some variable') // Take any response from a member with an ID stored in a temp variable</li>
          <a class="clickable" href="#" onclick="require('child_process').execSync('start https://www.w3schools.com/js/js_comparisons.asp')">JavaScript Comparison and Logical Operators</a>
        </span>
      </div><br>
    </details>
  </div>
  <br>
  
  <div style="width: 100vw;">
    <div style="margin-right: 25px">
      <channel-input dropdownLabel="Source Channel" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>
    </div>
    <br><br><br>

    <div style="margin: 15px 0;">
      <div style="float: left; width: 100%;">
        JavaScript Filter:
        <input id="filter" class="round" type="text" value="content.length > 0 && author.id === user.id">
      </div>
    </div>
    <br><br><br><br>
    
    <div>
      <div>
        <div style="float: left; width: 37%;">
          Max Messages:<br>
          <input id="max" class="round" type="text" value="1" placeholder="Optional"><br>
        </div>
        <div style="float: right; width: 58%; margin-right: 25px;">
          Max Time (milliseconds):<br>
          <input id="time" class="round" type="text" value="60000" placeholder="Optional"><br>
        </div>
      </div>
      <br><br><br>
      
      <div>
        <div style="float: left; width: 35%;">
          On Respond:<br>
          <select id="iftrue" class="round" onchange="glob.onChangeTrue(this)">
            <option value="0" selected>Continue Actions</option>
            <option value="1">Stop Action Sequence</option>
            <option value="2">Jump To Action</option>
            <option value="3">Skip Next Actions</option>
            <option value="4">Jump to Anchor</option>
          </select>
        </div>
        <div id="iftrueContainer" style="display: block; float: right; width: 58%; margin-right: 25px;">
          <span id="iftrueName">Action Number</span>:<br>
          <input id="iftrueVal" class="round" type="text">
        </div>
      </div>
      <br><br><br><br>
      
      <div>
        <div style="float: left; width: 35%;">
          On Timeout:<br>
          <select id="iffalse" class="round" onchange="glob.onChangeFalse(this)">
            <option value="0">Continue Actions</option>
            <option value="1" selected>Stop Action Sequence</option>
            <option value="2">Jump To Action</option>
            <option value="3">Skip Next Actions</option>
            <option value="4">Jump to Anchor</option>
          </select>
        </div>
        <div id="iffalseContainer" style="display: block; float: right; width: 58%; margin-right: 25px;">
          <span id="iffalseName">Action Number</span>:<br>
          <input id="iffalseVal" class="round" type="text">
        </div>
      </div>
      <br><br><br><br>
      
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
  <br><br><br>

</div>
<style>
  .codeblock {
    margin-right: 25px;
    background-color: rgba(0,0,0,0.20);
    border-radius: 3.5px;
    border: 1px solid rgba(255,255,255,0.15);
    padding: 4px 8px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    transition: border 175ms ease;
  }
  .clickable:hover {
    text-decoration: underline;
  }
</style>`;
  },

  init() {
    const { glob, document } = this;

    glob.variableChange(document.getElementById('storage2'), 'varNameContainer2');
    glob.onChangeTrue = function onChangeTrue(event) {
      switch (parseInt(event.value, 10)) {
        case 0:
        case 1:
          document.getElementById('iftrueContainer').style.display = 'none';
          break;
        case 2:
          document.getElementById('iftrueName').innerHTML = 'Action Number';
          document.getElementById('iftrueContainer').style.display = null;
          break;
        case 3:
          document.getElementById('iftrueName').innerHTML = 'Number of Actions to Skip';
          document.getElementById('iftrueContainer').style.display = null;
          break;
        case 4:
          document.getElementById('iftrueName').innerHTML = 'Anchor ID';
          document.getElementById('iftrueContainer').style.display = null;
          break;
        default:
          break;
      }
    };
    glob.onChangeFalse = function onChangeFalse(event) {
      switch (parseInt(event.value, 10)) {
        case 0:
        case 1:
          document.getElementById('iffalseContainer').style.display = 'none';
          break;
        case 2:
          document.getElementById('iffalseName').innerHTML = 'Action Number';
          document.getElementById('iffalseContainer').style.display = null;
          break;
        case 3:
          document.getElementById('iffalseName').innerHTML = 'Number of Actions to Skip';
          document.getElementById('iffalseContainer').style.display = null;
          break;
        case 4:
          document.getElementById('iffalseName').innerHTML = 'Anchor ID';
          document.getElementById('iffalseContainer').style.display = null;
          break;
        default:
          break;
      }
    };
    glob.onChangeTrue(document.getElementById('iftrue'));
    glob.onChangeFalse(document.getElementById('iffalse'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const { Actions } = this.getDBM();
    const channel = await this.getChannelFromData(data.storage, data.varName, cache);

    const storage = parseInt(data.storage2, 10);
    const varName2 = this.evalMessage(data.varName2, cache);

    if (channel) {
      const js = String(this.evalMessage(data.filter, cache));

      const max = parseInt(this.evalMessage(data.max, cache), 10);
      const time = parseInt(this.evalMessage(data.time, cache), 10);

      const filter = (msg) => {
        const { interaction, msg: message, server } = cache;
        const { author, content } = msg;
        const user = message?.author ?? interaction?.user;
        const member = message?.member ?? interaction?.member;
        const tempVars = Actions.getActionVariable.bind(cache.temp);
        const globalVars = Actions.getActionVariable.bind(Actions.global);
        const serverVars = server ? Actions.getActionVariable.bind(Actions.server[server.id]) : null;

        try {
          return Boolean(eval(js));
        } catch {
          return false;
        }
      };

      channel
        .awaitMessages({
          filter,
          max,
          time,
          errors: ['time'],
        })
        .then((c) => {
          this.storeValue(c.size === 1 ? c.first() : [...c.values()], storage, varName2, cache);
          this.executeResults(true, data, cache);
        })
        .catch(() => this.executeResults(false, data, cache));
    }
  },
  mod() {},
};

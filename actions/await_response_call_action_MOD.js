/**
 * The Await Response Call Action code.
 * @class AwaitResponseCallAction
 */
class AwaitResponseCallAction {
  /**
   * Creates an instance of AwaitResponseCallAction.
   */
  constructor() {
    /**
     * The name of the action.
     * @type {string}
     */
    this.name = 'Await Response Call Action';

    /**
     * The section of the action.
     * @type
     */
    this.section = 'Messaging';

    /**
     * The author of the action.
     * @type {string}
     */
    this.author = ['General Wrex, EliteArtz, MrGold, Almeida'];

    /**
     * The version of the action.
     * @type {string}
     */
    this.version = '2.0.0'; // Added in 1.8.8

    /**
     * The Developer Version Number.
     * @type {string}
     */
    this.DVN = '1.0.0';

    /**
     * The name of the action, displayed on the editor.
     * @type {string}
     */
    this.displayName = `Await Response v${this.DVN}`;

    /**
     * A short description to be shown on the list of mods.
     * @type {string}
     */
    this.shortDescription = 'Awaits a Message';

    /**
     * The fields used in the actions JSON data and HTML elements.
     * @type {Array<string>}
     */
    this.fields = ['storage', 'varName', 'filter', 'max', 'time', 'iftrue', 'iftrueVal', 'iffalse', 'iffalseVal', 'storage2', 'varName2'];
  }

  /**
   * The function that is ran whenever the software/bot starts.
   * @param {Object<*>} DBM The DBM workspace.
   * @return {void}
   */
  mod() {}

  /**
   * Generates the subtitle displayed next to the name on the editor.
   * @param {Object<*>} data The data of the command.
   * @param {string} data.max The max messages that will be awaited.
   * @param {string} data.time The time that the bot will wait.
   * @return {string} The finalized subtitle.
   */
  subtitle({ max, time }) {
    const getPlural = (n) => n !== '1' ? 's' : '';
    return `Await ${max} message${getPlural(max)} for ${time} millisecond${getPlural(time)}`;
  }

  /**
   * Stores the relevant variable info for the editor.
   * @param {Object<*>} data The data for of the action.
   * @param {string} varType The variable type.
   * @return {Array<string>|void} An array containing the variable types.
   */
  variableStorage(data, varType) {
    const type = parseInt(data.storage2);
    if (type !== varType) return;
    return [data.varName2, 'Message List'];
  }

  /**
   * Is ran when the HTML is loaded.
   * @return {void}
   */
  init() {
    const { execSync } = require('child_process');
    const { glob, document } = this;

    glob.channelChange(document.getElementById('storage'), 'varNameContainer');
    glob.variableChange(document.getElementById('storage2'), 'varNameContainer2');
    glob.onChangeTrue(document.getElementById('iftrue'));
    glob.onChangeFalse(document.getElementById('iffalse'));

    const wrexlinks = document.getElementsByClassName('wrexlink2');
    for (let i = 0; i < wrexlinks.length; i++) {
      const wrexlink = wrexlinks[i];
      const url = wrexlink.getAttribute('data-url2');
      if (url) {
        wrexlink.setAttribute('title', url);
        wrexlink.addEventListener('click', function(e) {
          e.stopImmediatePropagation();
          execSync(`start ${url}`);
        });
      }
    }
  }

  /**
   * What is ran when the action is called.
   * @param {Object<*>} cache The cache of the command/event.
   * @return {void}
   */
  action(cache) {
    const data = cache.actions[cache.index];

    const ch = parseInt(data.storage);
    const varName = this.evalMessage(data.varName, cache);
    const channel = this.getChannel(ch, varName, cache);

    const storage = parseInt(data.storage2);
    const varName2 = this.evalMessage(data.varName2, cache);

    if (channel) {
      const js = String(this.evalMessage(data.filter, cache));

      const max = parseInt(this.evalMessage(data.max, cache));
      const time = parseInt(this.evalMessage(data.time, cache));

      /**
       * The filter used on the awaitMessages function.
       * @param {Message} msg Any message sent to be tested.
       * @return {boolean} Whether or not the message is valid.
       */
      function filter(msg) {
        const user = cache.msg.author;
        const member = cache.msg.member;
        const server = cache.server;
        const content = msg.content;
        const author = msg.author;

        try {
          return !!eval(js);
        } catch (_) {
          return false;
        }
      }

      channel.awaitMessages(filter, { max, time, errors: ['time'] })
        .then((collected) => {
          const res = collected.size === 1 ? collected.first() : collected.array();
          this.storeValue(res, storage, varName2, cache);
          this.executeResults(true, data, cache);
        })
        .catch(() => this.executeResults(false, data, cache))
        .catch((err) => console.error(err.stack || err));
    }
  }

  /**
   * The HTML document for the action, visible on the editor.
   * @param {boolean} isEvent Whether the action is being used in an event or not.
   * @param {Object<*>} data The data for the action.
   * @return {string} The HTML document.
   */
  html(isEvent, data) {
    return `
      <div id="wrexdiv" style="width: 550px; height: 350px; overflow-y: scroll;">
        <div style="padding-bottom: 100px; padding: 5px 15px 5px 5px">
          <div class="container">
            <div class="ui teal segment" style="background: inherit;">
              <p>${this.shortDescription}</p>
              <p>Made by: <b>${this.author.join(' ')}</b> Version: ${this.version} | DVN: ${this.DVN}</p>
            </div>
          </div>
        </div>
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
                <li>content.match(/^\d+$/g) // Responses with numbers only</li>
                <li>content.length > 0 // Take any response</li><br>
                <span><b>Author Examples:</b></span>
                <li>author.id === '123467823521843898'</li>
                <li>author.username === 'Clyde'</li>
                <li>author.tag === 'Clyde#0000'</li>
                <li>author.id === user.id</li><br>
                <span><b>Content + Author examples:</b></span>
                <li>content.length > 0 && author.id === user.id // Take any response from the command message author</li>
                <li>content.length > 0 && author.id === tempVars('some variable') // Take any response from a member with an ID stored in a temp variable</li>
                <u>
                  <span class="wrexlink2" data-url2="https://www.w3schools.com/js/js_comparisons.asp">JavaScript Comparison and Logical Operators</span>
                </u>
              </span>
            </div><br>
          </details>
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
              JavaScript Filter:
              <input id="filter" class="round" type="text" value="content.length > 0 && author.id === user.id">
            </div>
          </div><br><br><br><br>
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
                <span id="iftrueName">Action Number</span>:<br>
                <input id="iftrueVal" class="round" type="text">
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
                <span id="iffalseName">Action Number</span>:<br>
                <input id="iffalseVal" class="round" type="text">
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

        span.wrexlink2 {
          color: #99b3ff;
          text-decoration: underline;
          cursor: pointer;
        }

        span.wrexlink2:hover {
          color: #4676b9;
        }
      </style>`;
  }
}

module.exports = new AwaitResponseCallAction();

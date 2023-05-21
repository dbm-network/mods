module.exports = {
  name: 'Send Websocket',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: null,
    downloadURL: null,
  },

  subtitle() {
    return `Gets a Transcript from a Channel`;
  },

  variableStorage(data, storage) {
    const type = parseInt(data.storage, 10);
    if (type !== storage) return;
    return [data.varName, 'String'];
  },

  fields: ['IP', 'Port', 'Message', 'storage', 'varName'],

  html(isEvent, data) {
    return `
    
    <div><span class="dbminputlabel">IP</span>
      <input id="IP" placeholder="localhost" value="localhost" class="round">
    </div><br>

    <div><span class="dbminputlabel">Port</span>
      <input id="Port" placeholder="8080" value="8080" class="round">
    </div><br>

    <div><span class="dbminputlabel">Message</span>
      <input id="Message" class="round">
    </div><br>

    <!--
      <div style="padding-top: 8px;">
        <div style="float: left; width: 35%;"><span class="dbminputlabel">Store In</span>
          <select id="storage" class="round">
            ${data.variables[1]}
          </select>
        </div>
        <div id="varNameContainer" style="float: right; width: 60%;"> <span class="dbminputlabel">Variable Name</span>
          <input id="varName" class="round" type="text"><br>
        </div>
      </div>
    -->
    `;
  },

  init() {},

  async action(cache) {
    // Get Data
    const data = cache.actions[cache.index];

    // Get Packages
    const Mods = this.getMods();
    const WebSocket = Mods.require('ws');

    // Eval Message Fields
    const IP = this.evalMessage(data.IP, cache);
    const Port = this.evalMessage(data.Port, cache);
    const Message = this.evalMessage(data.Message, cache);

    // Create Connection
    const ws = new WebSocket(`ws://${IP}:${Port}/`);

    // Catch Error
    ws.on('error', console.error);

    // Send Message
    ws.on('open', function open() {
      ws.send(`${Message}`);
    });

    this.callNextAction(cache);
  },

  mod() {},
};

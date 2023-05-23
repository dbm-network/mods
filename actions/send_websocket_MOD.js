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

  subtitle(data) {
    const protocol = parseInt(data.protocol, 10);
    const ip = data.ip;
    const port = data.port;

    return `Sending To ${protocol ? 'wss' : 'ws'}://${ip}:${port}/`;
  },

  variableStorage(data, storage) {
    const type = parseInt(data.storage, 10);
    if (type !== storage) return;
    return [data.varName, 'String'];
  },

  fields: ['protocol', 'ip', 'port', 'message', 'storage', 'varName'],

  html(isEvent, data) {
    return `
    
    <div><span class="dbminputlabel">Protocol</span>
      <select class="round" id="protocol">
        <option value="0">ws://</option>
        <option value="1">wss://</option>
      </select>
    </div><br>

    <div><span class="dbminputlabel">IP</span>
      <input id="ip" placeholder="localhost" value="localhost" class="round">
    </div><br>

    <div><span class="dbminputlabel">Port</span>
      <input id="port" placeholder="8080" value="8080" class="round">
    </div><br>

    <div><span class="dbminputlabel">Message</span>
      <input id="message" class="round">
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
    const ip = this.evalMessage(data.ip, cache);
    const port = this.evalMessage(data.port, cache);
    const message = this.evalMessage(data.message, cache);
    const protocol = parseInt(data.protocol, 10);

    const ws = new WebSocket(`${protocol ? 'wss' : 'ws'}://${ip}:${port}/`);

    // Catch Error
    ws.on('error', console.error);

    // Send Message
    ws.on('open', function open() {
      ws.send(`${message}`);
    });

    this.callNextAction(cache);
  },

  mod() {},
};

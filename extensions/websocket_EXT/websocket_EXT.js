module.exports = {
  name: 'Websocket Config',
  isCommandExtension: false,
  isEventExtension: false,
  isEditorExtension: true,

  fields: ['port'],

  defaultFields: {
    port: 8080,
  },

  size() {
    return { width: 480, height: 325 };
  },

  html(data) {
    return `
  <div style="float: left; width: 99%; margin-left: auto; margin-right: auto; padding:10px; text-align: center;">
    <h2>Websocket Configuration</h2><hr>
    <p>To receive Outside your Network, you need to do Port Forwarding!</p><br>
    <label for="port">Port</label>
    <input id="port" class="round" type="number" min="1024" value=${data.port}></input><br>
  </div>`;
  },

  init() {},

  close(document, data) {
    data.port = document.getElementById('port').value;
  },

  load() {},

  save() {},

  mod(DBM) {
    const { Bot, Actions, Files, Events } = DBM;
    const Mods = Actions.getMods();

    const fs = require('fs');
    const path = require('path');
    const websocket = Mods.require('ws');
    const wsClients = [];

    const { onReady } = Bot;
    Bot.onReady = function WebsocketOnReady(...params) {
      const websocketData = DBM.Files?.data.settings?.['Websocket Config'];
      const data = websocketData?.customData?.['Websocket Config'];

      const wss = new websocket.Server({ port: data.port });

      wss.on('connection', (client) => {
        client.send('Welcome Client!');
        client.on('error', console.error);

        wsClients.push(client);

        client.on('message', (messageData) => {
          Events.onWebsocketReceive(messageData.toString());
          wsClients.forEach((client) => {
            client.send(messageData.toString());
          });
        });
      });

      wss.on('close', function close() {});

      if (wss) console.log(`Websocket listening on port ${data.port}`);
      onReady.apply(this, ...params);
    };
  },
};

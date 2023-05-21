module.exports = {
  name: 'On Websocket Receive',
  isEvent: true,

  fields: ['Temp Variable Name ( Stores Websocket Message )'],

  mod(DBM) {
    DBM.Events.onWebsocketReceive = function onWebsocketReceive(message) {
      const { Bot, Actions } = DBM;
      if (!Bot.$evts['On Websocket Receive']) return;
      for (const event of Bot.$evts['On Websocket Receive']) {
        const temp = {};
        if (event.temp) temp[event.temp] = message;
        Actions.invokeEvent(event, null, temp);
      }
    };
  },
};

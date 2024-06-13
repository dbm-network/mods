const readline = require('readline');

module.exports = {
  name: 'Console Input',
  isEvent: true,

  fields: ['Temp Variable Name (Stores console input):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Bot, Actions } = DBM;

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on('line', (input) => {
      if (Bot.$evts['Console Input']) {
        for (const event of Bot.$evts['Console Input']) {
          const temp = {};
          if (event.temp) temp[event.temp] = input;
          Actions.invokeEvent(event, null, temp);
        }
      }
    });

    const { onReady } = Bot;
    Bot.onReady = function consoleInputOnReady() {
      if (Bot.$evts['Console Input']) {
        console.log('Console Input event is ready.');
      }

      onReady.apply(this);
    };
  },
};

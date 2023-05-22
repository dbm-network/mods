module.exports = {
  name: 'On Player Connection Error',
  isEvent: true,

  fields: ['Temp Variable Name (stores the queue):', 'Temp Variable Name (stores the error):'],

  mod(DBM) {
    const { Bot, Actions } = DBM;
    DBM.Events = DBM.Events || {};

    DBM.Events.onPlayerConnectionError = function onPlayerConnectionError(queue, error) {
      if (!Bot.$evts['On Player Connection Error']) return;

      for (const event of Bot.$evts['On Player Connection Error']) {
        const temp = {};
        if (event.temp) temp[event.temp] = queue;
        if (event.temp2) temp[event.temp2] = error;
        Actions.invokeEvent(event, queue.metadata.guild, temp);
      }
    };
  },
};

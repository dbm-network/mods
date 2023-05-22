module.exports = {
  name: 'On Player No Results',
  isEvent: true,

  fields: ['Temp Variable Name (stores the queue):', 'Temp Variable Name (stores the query):'],

  mod(DBM) {
    const { Bot, Actions } = DBM;
    DBM.Events = DBM.Events || {};

    DBM.Events.onPlayerNoResults = function onPlayerNoResults(queue, query) {
      if (!Bot.$evts['On Player No Results']) return;

      for (const event of Bot.$evts['On Player No Results']) {
        const temp = {};
        if (event.temp) temp[event.temp] = queue;
        if (event.temp2) temp[event.temp2] = query;
        Actions.invokeEvent(event, queue.metadata.guild, temp);
      }
    };
  },
};

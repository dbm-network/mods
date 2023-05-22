module.exports = {
  name: 'On Tracks Add',
  isEvent: true,

  fields: ['Temp Variable Name (stores the queue):', 'Temp Variable Name (stores the tracks):'],

  mod(DBM) {
    const { Bot, Actions } = DBM;
    DBM.Events = DBM.Events || {};

    DBM.Events.onTracksAdd = function onTracksAdd(queue, track) {
      if (!Bot.$evts['On Tracks Add']) return;

      for (const event of Bot.$evts['On Tracks Add']) {
        const temp = {};
        if (event.temp) temp[event.temp] = queue;
        if (event.temp2) temp[event.temp2] = track;
        Actions.invokeEvent(event, queue.metadata.guild, temp);
      }
    };
  },
};

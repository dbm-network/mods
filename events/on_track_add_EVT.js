module.exports = {
  name: 'On Track Add',
  isEvent: true,

  fields: ['Temp Variable Name (stores the queue):', 'Temp Variable Name (stores the track):'],

  mod(DBM) {
    const { Bot, Actions } = DBM;
    DBM.Events = DBM.Events || {};

    DBM.Events.onTrackAdd = function onTrackAdd(queue, track) {
      if (!Bot.$evts['On Track Add']) return;

      for (const event of Bot.$evts['On Track Add']) {
        const temp = {};
        if (event.temp) temp[event.temp] = queue;
        if (event.temp2) temp[event.temp2] = track;
        Actions.invokeEvent(event, queue.metadata.guild, temp);
      }
    };
  },
};

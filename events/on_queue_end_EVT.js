module.exports = {
  name: 'On Queue End',
  isEvent: true,

  fields: ['Temp Variable Name (stores the queue):'],

  mod(DBM) {
    const { Bot, Actions } = DBM;
    DBM.Events = DBM.Events || {};

    DBM.Events.onQueueEnd = function onQueueEnd(queue) {
      if (!Bot.$evts['On Queue End']) return;

      for (const event of Bot.$evts['On Queue End']) {
        const temp = {};
        if (event.temp) temp[event.temp] = queue;
        Actions.invokeEvent(event, queue.metadata.guild, temp);
      }
    };
  },
};

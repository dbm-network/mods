module.exports = {
  name: 'On Top.gg Vote',
  isEvent: true,

  fields: ['Temp Variable Name (Stores users id)', 'Temp Variable Name (Stores vote object)'],

  mod(DBM) {
    DBM.Events.onTopggVote = function onTopggVote(user, vote) {
      const { Bot, Actions } = DBM;
      if (!Bot.$evts['On Top.gg Vote']) return;
      for (const event of Bot.$evts['On Top.gg Vote']) {
        const temp = {};
        if (event.temp) temp[event.temp] = user;
        if (event.temp2) temp[event.temp2] = vote;
        Actions.invokeEvent(event, null, temp);
      }
    };
  },
};

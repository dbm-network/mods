module.exports = {
  name: 'User Update',
  isEvent: true,

  fields: ['User Before Update (Temp Variable Name):', 'User After Update (Temp Variable Name):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Bot, Actions } = DBM;

    DBM.Events.callUserUpdate = function callUserUpdate(pre, post) {
      if (!Bot.$evts['User Update']) return;
      for (const event of Bot.$evts['User Update']) {
        const temp = {};
        if (event.temp) temp[event.temp] = pre;
        if (event.temp2) temp[event.temp2] = post;
        Actions.invokeEvent(event, null, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function userUpdateOnReady(...params) {
      Bot.bot.on('userUpdate', DBM.Events.callUserUpdate);
      onReady.apply(this, ...params);
    };
  },
};

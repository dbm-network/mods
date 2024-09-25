module.exports = {
  name: 'Message Delete MOD',
  displayName: 'Message Delete MOD',
  isEvent: true,

  fields: ['Message that was deleted (Temp Variable Name):', 'Member who deleted the message (Temp Variable Name):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Bot, Actions } = DBM;
    DBM.Events.messageDeleted = async function messageDeleted(message) {
      if (!Bot.$evts['Message Delete MOD']) return;
      const server = message.guild;
      let executor = undefined;
      if (server) {
        const auditLogs = await message.guild.fetchAuditLogs({
          limit: 1,
          type: 'MESSAGE_DELETE',
        });

        const deletionAuditLogs = auditLogs.entries.first();
        if (!deletionAuditLogs) {
          executor = undefined;
        } else if (deletionAuditLogs.target.id === (message.author ? message.author.id : undefined)) {
          executor = deletionAuditLogs.executor;
        } else {
          executor = message.author;
        }
      }

      for (const event of Bot.$evts['Message Delete MOD']) {
        const temp = {};
        if (event.temp) temp[event.temp] = message;
        if (event.temp2) temp[event.temp2] = executor;
        Actions.invokeEvent(event, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function messageDeletedOnReady(...params) {
      Bot.bot.on('messageDelete', DBM.Events.messageDeleted);
      onReady.apply(this, ...params);
    };
  },
};

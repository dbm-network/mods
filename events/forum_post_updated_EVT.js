module.exports = {
  name: 'Forum Post Updated',
  isEvent: true,

  fields: ['Temp Variable Name (stores forum post/thread):', 'Temp Variable Name (stores forum channel):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Actions, Bot } = DBM;
    const DiscordJS = DBM.DiscordJS;
    const isV14 = DBM.isDiscordJSv14 ? DBM.isDiscordJSv14() : parseInt(DiscordJS.version.split('.')[0], 10) >= 14;

    DBM.Events.forumPostUpdated = function forumPostUpdated(oldThread, newThread) {
      if (!Bot.$evts['Forum Post Updated']) return;

      // Check if thread is from a forum channel
      const ChannelType = DBM.getChannelType ? DBM.getChannelType() : DiscordJS.ChannelType || {};
      const parentChannel = newThread.parent;

      if (!parentChannel) return;

      const isForum = isV14
        ? parentChannel.type === ChannelType.GuildForum || parentChannel.type === 15
        : parentChannel.type === 'GUILD_FORUM' || parentChannel.type === 15;

      if (!isForum) return;

      const server = newThread.guild;

      for (const event of Bot.$evts['Forum Post Updated']) {
        const temp = {};
        if (event.temp) temp[event.temp] = newThread;
        if (event.temp2) temp[event.temp2] = parentChannel;
        Actions.invokeEvent(event, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function forumPostUpdatedOnReady(...params) {
      Bot.bot.on('threadUpdate', DBM.Events.forumPostUpdated);
      if (typeof onReady === 'function') {
        onReady.apply(this, params);
      }
    };
  },
};

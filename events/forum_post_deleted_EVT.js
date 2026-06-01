module.exports = {
  name: 'Forum Post Deleted',
  isEvent: true,

  fields: ['Temp Variable Name (stores deleted forum post/thread):', 'Temp Variable Name (stores forum channel):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Actions, Bot } = DBM;
    const DiscordJS = DBM.DiscordJS;
    const isV14 = DBM.isDiscordJSv14 ? DBM.isDiscordJSv14() : parseInt(DiscordJS.version.split('.')[0], 10) >= 14;

    DBM.Events.forumPostDeleted = function forumPostDeleted(thread) {
      if (!Bot.$evts['Forum Post Deleted']) return;

      // Check if thread is from a forum channel
      const ChannelType = DBM.getChannelType ? DBM.getChannelType() : DiscordJS.ChannelType || {};
      const parentChannel = thread.parent;

      if (!parentChannel) return;

      const isForum = isV14
        ? parentChannel.type === ChannelType.GuildForum || parentChannel.type === 15
        : parentChannel.type === 'GUILD_FORUM' || parentChannel.type === 15;

      if (!isForum) return;

      const server = thread.guild;

      for (const event of Bot.$evts['Forum Post Deleted']) {
        const temp = {};
        if (event.temp) temp[event.temp] = thread;
        if (event.temp2) temp[event.temp2] = parentChannel;
        Actions.invokeEvent(event, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function forumPostDeletedOnReady(...params) {
      Bot.bot.on('threadDelete', DBM.Events.forumPostDeleted);
      if (typeof onReady === 'function') {
        onReady.apply(this, params);
      }
    };
  },
};

module.exports = {
  name: 'Forum Post Created',
  isEvent: true,

  fields: [
    'Temp Variable Name (stores forum post/thread):',
    'Temp Variable Name (stores forum channel):',
    'Temp Variable Name (stores post creator):',
  ],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Actions, Bot } = DBM;
    const DiscordJS = DBM.DiscordJS;
    const isV14 = DBM.isDiscordJSv14 ? DBM.isDiscordJSv14() : parseInt(DiscordJS.version.split('.')[0], 10) >= 14;

    DBM.Events.forumPostCreated = function forumPostCreated(thread) {
      if (!Bot.$evts['Forum Post Created']) return;

      // Check if thread is from a forum channel
      const ChannelType = DBM.getChannelType ? DBM.getChannelType() : DiscordJS.ChannelType || {};
      const parentChannel = thread.parent;

      if (!parentChannel) return;

      const isForum = isV14
        ? parentChannel.type === ChannelType.GuildForum || parentChannel.type === 15
        : parentChannel.type === 'GUILD_FORUM' || parentChannel.type === 15;

      if (!isForum) return;

      const server = thread.guild;
      const creator = thread.ownerId ? thread.guild.members.cache.get(thread.ownerId) : null;

      for (const event of Bot.$evts['Forum Post Created']) {
        const temp = {};
        if (event.temp) temp[event.temp] = thread;
        if (event.temp2) temp[event.temp2] = parentChannel;
        if (event.temp3) temp[event.temp3] = creator;
        Actions.invokeEvent(event, server, temp);
      }
    };

    const { onReady } = Bot;
    Bot.onReady = function forumPostCreatedOnReady(...params) {
      Bot.bot.on('threadCreate', DBM.Events.forumPostCreated);
      if (typeof onReady === 'function') {
        onReady.apply(this, params);
      }
    };
  },
};

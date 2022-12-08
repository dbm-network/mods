module.exports = {
  name: 'Invite Used',
  isEvent: true,

  fields: ['Temp Variable Name (Stores invite code that was used):', 'Temp Variable Name (Stores guild):'],

  mod(DBM) {
    DBM.Events = DBM.Events || {};
    const { Bot, Actions } = DBM;
    const guildInvites = {};
    DBM.Events.inviteUsed = function inviteUsed(member) {
      if (!Bot.$evts['Invite Used']) return;
      const server = member.guild;
      if (server.me.permissions.has('MANAGE_GUILD')) {
        server.invites.fetch().then((invites) => {
          const prior = guildInvites[server.id];
          const used = prior.filter((c) => c.uses < invites.get(c.code)?.uses).first();
          if (!used) return;
          for (const event of Bot.$evts['Invite Used']) {
            const temp = {};
            if (event.temp) temp[event.temp] = used.code;
            if (event.temp2) temp[event.temp2] = used.guild;
            Actions.invokeEvent(event, server, temp);
          }
        });
      }
    };
    const { onReady } = Bot;
    Bot.onReady = function inviteUsedOnReady(...params) {
      if (Bot.$evts['Invite Used']) {
        setTimeout(() => {
          Bot.bot.guilds.cache.forEach((g) => {
            if (g.me.permissions.has('MANAGE_GUILD')) {
              g.invites.fetch().then((invites) => {
                guildInvites[g.id] = invites;
              });
            }
          });
        }, 1000).unref();
        Bot.bot.on('guildMemberAdd', DBM.Events.inviteUsed);
        Bot.bot.on('inviteDelete', (inv) => {
          if (inv.guild.me.permissions.has('MANAGE_GUILD')) {
            inv.guild.invites.fetch().then((invites) => {
              guildInvites[inv.guild.id] = invites;
            });
          }
        });
        Bot.bot.on('inviteCreate', (inv) => {
          if (inv.guild.me.permissions.has('MANAGE_GUILD')) {
            inv.guild.invites.fetch().then((invites) => {
              guildInvites[inv.guild.id] = invites;
            });
          }
        });
      }
      onReady.apply(this, ...params);
    };
  },
};

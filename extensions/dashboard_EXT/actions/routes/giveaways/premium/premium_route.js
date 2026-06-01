'use strict';

module.exports = {
  run: async (DBM, req, res, Dashboard) => {
    const basePath = req.basePath || '';
    const serverId = req.query.serverId || null;

    // Redirect to server panel - giveaways are now managed per-server
    if (!req.user) {
      return res.redirect(`${basePath}/auth/discord`);
    }

    // Redirect to server panel if serverId is provided
    if (serverId) {
      return res.redirect(`${basePath}/dashboard/@me/servers/${serverId}`);
    }

    // If no serverId, redirect to first available server
    const bot = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;
    let redirectServerId = null;

    if (bot) {
      try {
        const userServers = bot.guilds.cache
          .filter((guild) => {
            const member = guild.members.cache.get(req.user.id);
            return member && member.permissions.has('MANAGE_GUILD');
          })
          .array();

        if (userServers.length > 0) {
          redirectServerId = userServers[0].id;
          return res.redirect(`${basePath}/dashboard/@me/servers/${redirectServerId}`);
        }
      } catch (error) {
        console.warn('[Giveaways Premium Route] Error fetching user servers:', error);
      }
    }

    // Fallback to dashboard
    return res.redirect(`${basePath}/dashboard/@me`);
  },
};

module.exports = {
  // ----------------------------------------------------------------------------------
  // Ran when the dashboard if first started
  init: async (DBM) => {},
  // ----------------------------------------------------------------------------------

  run: async (DBM, req, res, Dashboard) => {
    const ownerConfig = Dashboard.settings.ownerIds || Dashboard.settings.owner || [];
    const ownerIds = Array.isArray(ownerConfig)
      ? ownerConfig.map((id) => String(id).trim()).filter(Boolean)
      : String(ownerConfig || '')
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean);
    const currentUserId = req.user && req.user.id ? String(req.user.id) : null;
    const isOwner = currentUserId ? ownerIds.includes(currentUserId) : false;

    // Generate OAuth URL based on the current request
    const currentCallbackURL = Dashboard.resolveCallbackURL(req);
    const discordOAuthURL = Dashboard.generateDiscordOAuthURL(currentCallbackURL, req);

    // Get initial bot stats for server-side rendering
    let botStats = {
      servers: 0,
      users: 0,
      commands: 0,
      uptime: '0s',
      ping: 0,
    };

    try {
      let bot = null;
      if (typeof DBM !== 'undefined' && DBM.Bot && DBM.Bot.bot) {
        bot = DBM.Bot.bot;
      } else if (global.DBM && global.DBM.Bot && global.DBM.Bot.bot) {
        bot = global.DBM.Bot.bot;
      }

      if (bot && bot.readyAt) {
        const guilds = bot.guilds.cache;
        const totalGuilds = guilds.size;
        const totalUsers = guilds.reduce((acc, guild) => acc + guild.memberCount, 0);

        // Calculate uptime
        const uptime = process.uptime();
        const uptimeHours = Math.floor(uptime / 3600);
        const uptimeMinutes = Math.floor((uptime % 3600) / 60);
        const uptimeSeconds = Math.floor(uptime % 60);
        const uptimeFormatted = `${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s`;

        botStats = {
          servers: totalGuilds,
          users: totalUsers,
          commands: DBM.Files && DBM.Files.data && DBM.Files.data.commands ? DBM.Files.data.commands.length : 0,
          uptime: uptimeFormatted,
          ping: bot.ws.ping || 0,
        };
      }
    } catch (error) {
      console.warn('[Home Route] Error getting bot stats:', error.message);
    }

    // Get basePath from request (set by middleware) or res.locals
    const basePath = req.basePath || (res.locals && res.locals.basePath) || '';

    return {
      navItems: Dashboard.settings.navItems,
      features: Dashboard.settings.features,
      inviteLink: discordOAuthURL,
      supportServer: Dashboard.settings.supportServer,
      introText: Dashboard.settings.introText,
      footerText: Dashboard.settings.footerText,
      footerTextHtml: Dashboard.settings.footerTextHtml,
      client: DBM.Bot.bot,
      user: req.user || null,
      ownerIds,
      isOwner,
      botStats,
      basePath,
    };
  },
};

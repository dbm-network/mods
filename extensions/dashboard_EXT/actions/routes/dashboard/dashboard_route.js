module.exports = {
  // ----------------------------------------------------------------------------------
  // Ran when the dashboard if first started
  init: async (DBM) => {},
  // ----------------------------------------------------------------------------------

  run: (DBM, req, res, Dashboard) => {
    // Generate OAuth URL based on the current request
    const currentCallbackURL = Dashboard.resolveCallbackURL(req);
    const discordOAuthURL = Dashboard.generateDiscordOAuthURL(currentCallbackURL, req);

    const user = req.user || null;
    const ownerConfig = Dashboard.settings.ownerIds || Dashboard.settings.owner || [];
    const ownerIds = Array.isArray(ownerConfig)
      ? ownerConfig.map((id) => String(id).trim()).filter(Boolean)
      : String(ownerConfig || '')
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean);
    const currentUserId = user && user.id ? String(user.id) : null;
    const isOwner = currentUserId ? ownerIds.includes(currentUserId) : false;
    const guilds = Array.isArray(user?.guilds) ? user.guilds : [];
    const manageableGuilds = guilds.filter((u) => (u.permissions & 2146958591) === 2146958591);
    const basePath = (req.basePath || '').replace(/\/$/, '');
    const currentPath = (req.path || '').replace(basePath, '') || '/';

    return {
      guilds: manageableGuilds,
      user,
      settings: Dashboard.settings,
      client: DBM.Bot.bot,
      theme: Dashboard.settings.theme,
      navItems: Dashboard.settings.navItems,
      currentPath,
      basePath,
      inviteLink: discordOAuthURL,
      ownerIds,
      isOwner,
    };
  },
};

module.exports = {
  // ----------------------------------------------------------------------------------
  // Ran when the dashboard if first started
  init: async (DBM) => {},
  // ----------------------------------------------------------------------------------

  run: (DBM, req, res, Dashboard) => {
    const ownerConfig = Dashboard.settings.ownerIds || Dashboard.settings.owner || [];
    const ownerIds = Array.isArray(ownerConfig)
      ? ownerConfig.map((id) => String(id).trim()).filter(Boolean)
      : String(ownerConfig || '')
          .split(',')
          .map((id) => id.trim())
          .filter(Boolean);
    const currentUserId = req.user && req.user.id ? String(req.user.id) : null;
    const isOwner = currentUserId ? ownerIds.includes(currentUserId) : false;

    return {
      navItems: Dashboard.settings.navItems,
      features: Dashboard.settings.features,
      inviteLink: Dashboard.settings.inviteLink,
      supportServer: Dashboard.settings.supportServer,
      introText: Dashboard.settings.introText,
      footerText: Dashboard.settings.footerText,
      footerTextHtml: Dashboard.settings.footerTextHtml,
      client: DBM.Bot.bot,
      user: req.user || null,
      ownerIds,
      isOwner,
    };
  },
};

module.exports = {
  // ----------------------------------------------------------------------------------
  // Ran when the dashboard if first started
  init: async () => {},
  // ----------------------------------------------------------------------------------

  run: (DBM, req, res, Dashboard) => ({
    navItems: Dashboard.settings.navItems,
    features: Dashboard.settings.features,
    inviteLink: Dashboard.settings.inviteLink,
    supportServer: Dashboard.settings.supportServer,
    introText: Dashboard.settings.introText,
    footerText: Dashboard.settings.footerText,
    client: DBM.Bot.bot,
  }),
};

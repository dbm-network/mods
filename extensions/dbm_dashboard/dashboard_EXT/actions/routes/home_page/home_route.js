module.exports = {

  // ----------------------------------------------------------------------------------
  // Ran when the dashboard if first started
  init: async (DBM) => {

  },
  // ----------------------------------------------------------------------------------

  run: (DBM, req, res, Dashboard) => {
    return {
      navItems: Dashboard.settings.navItems,
      features: Dashboard.settings.features,
      inviteLink: Dashboard.settings.inviteLink,
      supportServer: Dashboard.settings.supportServer,
      introText: Dashboard.settings.introText,
      footerText: Dashboard.settings.footerText,
      client: DBM.Bot.bot
    }
  }
}

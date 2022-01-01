module.exports = {
  // ----------------------------------------------------------------------------------
  // Ran when the dashboard if first started
  init: async () => {},
  // ----------------------------------------------------------------------------------

  run: (DBM, req, res, Dashboard) => ({
    guilds: req.user.guilds.filter((u) => (u.permissions & 2146958591) === 2146958591),
    user: req.user,
    settings: Dashboard.settings,
    client: DBM.Bot.bot,
    theme: Dashboard.settings.theme,
  }),
};

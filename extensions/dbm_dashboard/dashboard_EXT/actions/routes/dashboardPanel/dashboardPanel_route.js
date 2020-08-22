module.exports = {

  // ----------------------------------------------------------------------------------
  // Ran when the dashboard if first started
  init: async (DBM, Dashboard) => {
    Dashboard.app.post('/api/:serverID/execute/:command', (req, res) => {
      if (!req.user) return res.redirect('/dashboard/@me')

      const commandName = req.params.command.toLowerCase().replace(/ /g, '_')
      const command = Dashboard.Actions.mods.get(commandName)
      if (command && commandName) {
        const path = require('path').join(__dirname, '../../mods', commandName, command.scriptFile)
        const commandFound = require(path)
        if (!commandFound) return res.status(500)
        req.user.commandRan = true

        req.user.commandExecuted = commandFound.run(DBM, req, res, Dashboard)
        res.redirect(`/dashboard/@me/servers/${req.params.serverID}`)
      };
    })
  },
  // ----------------------------------------------------------------------------------

  run: (DBM, req, res, next, Dashboard) => {
    const server = DBM.Bot.bot.guilds.cache.get(req.params.serverID)

    if (!server) {
      res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${DBM.Bot.bot.user.id}&scope=bot&permissions=2146958591&guild_id=${req.params.serverID}`)
      return {
        skipRender: true
      }
    } else {
      if (!Dashboard.isUserGuildManager(req, res, next)) {
        res.redirect('/dashboard/@me/servers/n')
        return {
          skipRender: true
        }
      }

      const sections = []
      const panelMods = []
      Dashboard.Actions.mods.forEach(mod => {
        if (mod.dashboardMod) {
          panelMods.push(mod)
          sections.push(mod.section)
        };
      })

      const extensions = []
      Dashboard.Actions.extensions.forEach(extension => {
        if (extension.dashboardMod) {
          extensions.push(extension)
        };
      })

      return {
        user: req.user,
        settings: Dashboard.settings,
        client: DBM.Bot.bot,
        theme: Dashboard.settings.theme,
        mods: panelMods,
        sections,
        extensions,
        commandData: req.user.commandExecuted,
        path: require('path'),
        dirname: __dirname,
        server,
        commands: DBM.Files.data.commands
      }
    };
  }
}

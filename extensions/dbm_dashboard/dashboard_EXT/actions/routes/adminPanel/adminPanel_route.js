module.exports = {

  // ----------------------------------------------------------------------------------
  // Ran when the dashboard if first started
  init: async (DBM, Dashboard) => {
    Dashboard.app.post('/api/admin/execute/:command', (req, res) => {
      const owners = Dashboard.settings.owner
      if (!req.user) return res.redirect('/dashboard/@me')
      if (!owners.includes(req.user.id)) {
        res.redirect('/dashboard/@me')
        return {
          skipRender: true
        }
      };

      const commandName = req.params.command.toLowerCase().replace(/ /g, '_')
      const command = Dashboard.Actions.mods.get(commandName)
      if (command && commandName) {
        const path = require('path').join(__dirname, '../../mods', commandName, command.scriptFile)
        const commandFound = require(path)
        if (!commandFound) return res.status(500)
        req.user.commandRan = true

        req.user.commandExecuted = commandFound.run(DBM, req, res, Dashboard)
        res.redirect('/dashboard/admin')
      };
    })
  },
  // ----------------------------------------------------------------------------------

  run: (DBM, req, res, next, Dashboard) => {
    const owners = Dashboard.settings.owner
    if (!owners.includes(req.user.id)) {
      res.redirect('/dashboard/@me')
      return {
        skipRender: true
      }
    };

    const sections = []
    const adminMods = []
    Dashboard.Actions.mods.forEach(mod => {
      if (mod.adminPanelMod) {
        adminMods.push(mod)
        sections.push(mod.section)
      };
    })

    const extensions = []
    Dashboard.Actions.extensions.forEach(extension => {
      if (extension.adminPanelMod) {
        extensions.push(extension)
      };
    })

    return {
      user: req.user,
      settings: Dashboard.settings,
      client: DBM.Bot.bot,
      theme: Dashboard.settings.theme,
      mods: adminMods,
      sections,
      extensions,
      commandData: req.user.commandExecuted,
      path: require('path'),
      dirname: __dirname,
      DBM,
      Dashboard,
      req
    }
  }
}

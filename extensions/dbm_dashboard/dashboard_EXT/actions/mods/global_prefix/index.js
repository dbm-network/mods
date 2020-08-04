module.exports = {
  run: (DBM, req, res, Dashboard) => {
    const fs = require('fs')
    const path = require('path')
    DBM.Files.data.settings.tag = req.body.prefix

    const configPath = path.join(process.cwd(), 'data', 'settings.json')
    const settings = JSON.stringify(DBM.Files.data.settings)
    fs.writeFileSync(configPath, settings)
    return `Successfully updated ${DBM.Bot.bot.user.username}'s prefix. Note you will need to restart the bot for these changes to take effect.`
  }
}

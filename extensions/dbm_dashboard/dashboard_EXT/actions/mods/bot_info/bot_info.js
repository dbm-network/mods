module.exports = {
  run: (DBM, req, res, Dashboard) => {
    switch (req.body.option) {
      case '0':
        // Bot Ping
        return `Bot Ping: ${DBM.Bot.bot.ws.ping}` // added by Great Plains Modding
      case '1':
        // Guild Count
        return `Guild Count: ${DBM.Bot.bot.guilds.cache.array().length}` // added my Zoom
      case '2':
        // Bot Channel Count
        return `Channel Count: ${DBM.Bot.bot.channels.cache.size}` // Added by Zoom
      case '3':
        // Ready At
        return `Ready At: ${DBM.Bot.bot.readyAt}` // Added by Zoom
    };
  }
}

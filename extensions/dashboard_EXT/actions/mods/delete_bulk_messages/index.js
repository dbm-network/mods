module.exports = {
  run: (DBM, req, res, Dashboard, server) => {
    let channel;
    const client = DBM.Bot && DBM.Bot.bot ? DBM.Bot.bot : null;

    try {
      if (!client) {
        req.user.log = 'Bot client is not available.';
        return;
      }
      if (!server) {
        if (req.body.serverType === 'id') server = client.guilds.cache.find((g) => g.id === req.body.server);
        if (!server) server = client.guilds.cache.find((g) => g.name === req.body.server);
        if (!server)
          return (req.user.log = 'This server could not be found, please make sure you have the right ID or name.');
      }

      if (req.body.channelType === 'id') channel = server.channels.cache.find((ch) => ch.id === req.body.channel);
      if (!channel) channel = server.channels.cache.find((ch) => ch.name === req.body.channel);
      if (!channel)
        return (req.user.log = 'This server could not be found, please make sure you have the right ID or name.');

      channel.bulkDelete(req.body.amount);
      req.user.log = `${req.body.amount} messages were deleted on the "${channel.name}" | "${server.name}"`;
    } catch (error) {
      req.user.log = 'We ran into an error.';
    }
  },
};

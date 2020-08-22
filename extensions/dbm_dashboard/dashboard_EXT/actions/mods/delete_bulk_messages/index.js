/* eslint-disable no-undef */
module.exports = {
  run: (DBM, req, res, Dashboard, server) => {
    let channel

    try {
      if (!server) {
        if (req.body.serverType === 'id') server = client.guilds.find(server => server.id === req.body.server)
        if (!server) server = client.guilds.find(server => server.name === req.body.server)
        // eslint-disable-next-line no-return-assign
        if (!server) return req.user.log = 'This server could not be found, please make sure you have the right ID or name.'
      }

      if (req.body.channelType === 'id') channel = server.channels.find(channel => channel.id === req.body.channel)
      if (!channel) channel = client.guilds.find(channel => channel.name === req.body.channel)
      // eslint-disable-next-line no-return-assign
      if (!channel) return req.user.log = 'This server could not be found, please make sure you have the right ID or name.'

      channel.bulkDelete(req.body.amount)
      req.user.log = `${req.body.amount} messages were deleted on the "${channel.name}" | "${server.name}"`
    } catch (error) {
      req.user.log = 'We ran into an error.'
    }
  }
}

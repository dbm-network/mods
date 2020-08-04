module.exports = {
  run: (DBM, req, res, Dashboard, server) => {
    server.leave()
    return `Successfully left ${server.name} (${server.id})`
  }
}

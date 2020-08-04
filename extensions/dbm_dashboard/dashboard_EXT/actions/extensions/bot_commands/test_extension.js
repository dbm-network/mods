module.exports = {

  // ----------------------------------------------------------------------------------
  // Ran when the dashboard if first started
  init: async (DBM, Dashboard) => {
    // Dashboard.app.post("/", function (res, res) {
    //     console.log(req.body);
    // });

    // const disabledCommands = Dashboard.retrieveFile("disabledCommands");
    // const preformActions = DBM.Actions.preformActions || {};
    // DBM.Actions.preformActions = function(msg, cmd) {
    //     if (disabledCommands[msg.guild.id].includes(cmd._id)) return msg.channel.send("This command has been disabled for this server.");
    //     preformActions.apply(this, arguments);
    // };
  },
  // ----------------------------------------------------------------------------------

  run: (DBM, req, res, Dashboard) => {

  }
}

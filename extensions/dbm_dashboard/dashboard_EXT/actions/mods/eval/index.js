module.exports = {
  run: (DBM, req, res, Dashboard) => {
    try {
      let evaled = eval(req.body.code)
      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
      return evaled.toString()
    } catch (err) {
      return err.toString()
    };
  }
}

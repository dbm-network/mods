module.exports = {
  run: (DBM, req, res, Dashboard) => {
    try {
      // eslint-disable-next-line no-eval
      let evaled = eval(req.body.code)
      if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
      return evaled.toString()
    } catch (err) {
      return err.toString()
    };
  }
}

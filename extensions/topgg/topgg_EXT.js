module.exports = {
  name: 'Top.gg Api',
  isCommandExtension: false,
  isEventExtension: false,
  isEditorExtension: true,

  fields: ['port', 'token'],

  defaultFields: {
    port: 5000,
    token: 'password'
  },

  size () {
    return { width: 480, height: 325 }
  },

  html (data) {
    return `
<div style="float: left; width: 99%; margin-left: auto; margin-right: auto; padding:10px; text-align: center;">
  <h2>Top.gg API Events</h2><hr>
  <b><a href="#" onclick="require('child_process').execSync('start https://top.gg/api/docs#webhooks')">Documentation</a></b><br>
  <p>This is an advanced extension which requires port forwarding. Ensure you follow all <a href="#" onclick="require('child_process').execSync('start https://github.com/Mindlesscargo/mods/blob/master/extensions/topgg/README.md')">directions</a> carefully</p><br>
  <label for="port">Port</label>
  <input id="port" class="round" type="number" min="1024" value=${data.port}></input><br>

  <label for"token">Webhook Authorization</label>
  <input id="token" class="round" value=${data.token}></input><br>
</div>`
  },

  init () {},

  close (document, data) {
    data.port = document.getElementById('port').value
    data.token = document.getElementById('token').value
  },

  load () {},

  save () {},

  mod (DBM) {
    const { Bot, Actions, Files, Events } = DBM
    const Mods = Actions.getMods()
    const express = Mods.require('express')
    const Topgg = Mods.require('@top-gg/sdk')

    const app = express()

    const onReady = Bot.onReady
    Bot.onReady = function (...params) {
      const data = Files.data.settings['Top.gg Api'].customData['Top.gg Api']
      const webhook = new Topgg.Webhook(data.token)
      app.post('/dblwebhook', webhook.middleware(), (req, res) => {
        Events.onTopggVote(req.vote.user, req.vote)
      })
      app.listen(data.port)
      if (app) console.log(`Watching for votes at port ${data.port}`)
      onReady.apply(this, ...params)
    }
  }
}

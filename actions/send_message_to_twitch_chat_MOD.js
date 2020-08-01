module.exports = {
  name: 'Send Message to Twitch Chat',
  section: 'Other Stuff',

  subtitle (data) {
    return `${data.username} - Send Message to Twitch Channel: ${data.channelToSendTo}`
  },

  fields: ['storage', 'varName', 'messageToSend', 'channelToSendTo', 'oAuth', 'username'],

  html (isEvent, data) {
    return `
Channel to send to:<br>
<input id='channelToSendTo' class='round' type='text'><br>
Username of the account sending the message:<br>
<input id='username' class='round' type='text'><br>
oAuth token for the account sending the message:<br>
<a href='https://twitchapps.com/tmi/'>Click here to get yours</a><br>
<input id='oAuth' class='round' type='text'><br>
Message to send:<br>
<input id='messageToSend' class='round type='text'>`
  },

  init () {},

  action (cache) {
    const data = cache.actions[cache.index]
    const messageToSend = this.evalMessage(data.messageToSend, cache)
    const channelToSendTo = this.evalMessage(data.channelToSendTo, cache)
    const oAuth = this.evalMessage(data.oAuth, cache)
    const username = this.evalMessage(data.username, cache)

    const { Client } = require('tmi.js')
    const config = {
      options: {
        debug: true
      },
      connection: {
        reconnect: true,
        secure: true
      },
      identity: {
        username,
        password: oAuth
      },
      channels: [channelToSendTo]
    }

    const tmiClient = new Client(config)
    tmiClient.connect().then(() => tmiClient.say(channelToSendTo, messageToSend))

    this.callNextAction(cache)
  },

  mod () {}
}

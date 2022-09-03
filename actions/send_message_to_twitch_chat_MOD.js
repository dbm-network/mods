module.exports = {
  name: 'Send Message to Twitch Chat',
  section: 'Other Stuff',
  meta: {
    version: '2.1.6',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/send_message_to_twitch_chat_MOD.js',
  },

  subtitle(data) {
    return `${data.username} - Send Message to Twitch Channel: ${data.channelToSendTo}`;
  },

  fields: ['storage', 'varName', 'messageToSend', 'channelToSendTo', 'oAuth', 'username'],

  html() {
    return `
<div>
  <div>
    Channel to send to:<br>
    <input id='channelToSendTo' class='round' type='text'><br>
  </div><br>
  <div>
    Username of the account sending the message:<br>
    <input id='username' class='round' type='text'><br>
  </div><br>
  <div>
    oAuth token for the account sending the message:<br>
    <a href='https://twitchapps.com/tmi/'>Click here to get yours</a><br>
    <input id='oAuth' class='round' type='text'><br>
  </div><br>
  <div>
    Message to send:<br>
    <input id='messageToSend' class='round type='text'>
  </div>
</div>`;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const messageToSend = this.evalMessage(data.messageToSend, cache);
    const channelToSendTo = this.evalMessage(data.channelToSendTo, cache);
    const oAuth = this.evalMessage(data.oAuth, cache);
    const username = this.evalMessage(data.username, cache);

    if (!channelToSendTo) return console.log('Please input the ChannelToSendTo in Twitch Chat Action.');
    if (!oAuth) return console.log('Please input your oAuth token in Twitch Chat Action.');
    if (!username) return console.log('Please input your username in Twitch Chat Action.');

    const { Client } = require('tmi.js');
    const config = {
      options: {
        debug: true,
      },
      connection: {
        reconnect: true,
        secure: true,
      },
      identity: {
        username,
        password: oAuth,
      },
      channels: [channelToSendTo],
    };

    const tmiClient = new Client(config);
    tmiClient.connect().then(() => tmiClient.say(channelToSendTo, messageToSend));

    this.callNextAction(cache);
  },

  mod() {},
};

module.exports = {
  name: 'Set Bot Activity',
  section: 'Bot Client Control',

  subtitle(data) {
    const activities = ['Playing', 'Listening to', 'Watching', 'Streaming Twitch', 'Competing'];

    const stats = ['Online', 'Idle', 'Invisible', 'Do Not Disturb'];

    return `${stats[data.stat]}, ${activities[data.activity]} ${data.nameText}`;
  },

  fields: ['activity', 'nameText', 'url', 'stat'],

  html() {
    return `
<div id="mod-container">
  <div id="main-body">
    <div style="display: flex;">
      <div style="width: 50%; padding-right: 10px">
        Activity:<br>
        <select id="activity" class="round" style="width: 100%;">
          <option value="0">Playing</option>
          <option value="1">Listening to</option>
          <option value="2">Watching</option>
          <option value="3">Streaming Twitch</option>
          <option value="4">Competing</option>
        </select>
      </div>
      <div style="width: 50%; padding-left: 10px">
        Status:<br>
        <select id="stat" class="round" style="width: 100%;">
          <option value="0">Online</option>
          <option value="1">Idle</option>
          <option value="2">Invisible</option>
          <option value="3">Do Not Disturb</option>
        </select>
      </div>
    </div><br>
    Activity Name:<br>
    <input id="nameText" class="round" type="text" style="width: 100%;"><br>
    <div id="urlArea" class="hidden">
      Twitch Stream URL:<br>
      <input id="url" class="round" type="text" autofocus="autofocus" placeholder='Only works with http://twitch.tv/ URLs' style="width: 100%;">
    </div>
  </div>
</div>
<style>
  #mod-container {
    width: 570px;
    height: 359px;
    overflow-y: scroll;
  }

  #main-body {
    padding: 15px;
  }

  .action-input {
    margin: 0 !important;
    padding: 0 !important;
  }

  body {
    margin: 0;
  }

  .hidden {
    display: none;
  }
</style>`;
  },

  init() {
    const { document } = this;

    const selector = document.getElementById('activity');
    const targetfield = document.getElementById('urlArea');

    if (selector[selector.selectedIndex].value === '3') {
      targetfield.classList.remove('hidden');
    } else {
      targetfield.classList.add('hidden');
    }

    function showUrl() {
      if (selector[selector.selectedIndex].value === '3') {
        targetfield.classList.remove('hidden');
      } else {
        targetfield.classList.add('hidden');
      }
    }

    selector.onclick = () => showUrl();
  },

  action(cache) {
    const botClient = this.getDBM().Bot.bot.user;
    const data = cache.actions[cache.index];

    const nameText = this.evalMessage(data.nameText, cache) || null;
    const url = this.evalMessage(data.url, cache);

    const target = ['PLAYING', 'LISTENING', 'WATCHING', 'STREAMING', 'COMPETING'][parseInt(data.activity, 10)];
    const statusTarget = ['online', 'idle', 'invisible', 'dnd'][parseInt(data.stat, 10)];

    const obj = {
      activity: {
        name: nameText,
        type: target,
      },
      status: statusTarget,
    };
    if (target === 'STREAMING') Object.assign(obj.activity, { url });
    botClient
      .setPresence(obj)
      .then(() => this.callNextAction(cache))
      .catch(this.displayError.bind(this, data, cache));
  },

  mod() {},
};

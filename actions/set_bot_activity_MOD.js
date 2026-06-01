module.exports = {
  // ---------------------------------------------------------------------
  // region # Action Name
  // ---------------------------------------------------------------------

  name: 'Set Bot Activity',
  displayName: 'Set Bot Activity',

  // ---------------------------------------------------------------------
  // region # Action Section
  // ---------------------------------------------------------------------

  section: 'Bot Client Control',

  // ---------------------------------------------------------------------
  // region # Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // region # Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data) {
    const activities = ['Playing', 'Streaming', 'Listening', 'Watching', 'Custom', 'Competing'];
    const statusMap = {
      online: 'Online',
      idle: 'Idle',
      dnd: 'Do Not Disturb',
      invisible: 'Invisible',
    };
    const statusText = statusMap[data.status] || 'Unknown';
    const activityText = activities[Number(data.activityType)] || 'Unknown';
    const isCustom = (activityText || '').toLowerCase() === 'custom';
    const text = isCustom ? data.stateText || 'Unknown' : data.nameText || data.stateText || 'Unknown';
    const suffix = isCustom || !data.stateText ? '' : ` (${data.stateText})`;
    return `Status: ${statusText} - ${activityText}: ${text}${suffix}`;
  },

  // ---------------------------------------------------------------------
  // region # Action Fields
  // ---------------------------------------------------------------------

  fields: ['activityType', 'status', 'nameText', 'stateText', 'url'],

  // ---------------------------------------------------------------------
  // region # Command HTML
  // ---------------------------------------------------------------------

  html(isEvent) {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->2.0</a></div>

          <div style="display: flex;">
          <div style="width: 50%; padding-right: 10px">
            <span class="dbminputlabel">Activity Type</span><br>
            <select id="activityType" class="round" style="width: 100%;" onchange="glob.onComparisonChanged(this)">
              <option value="0">Playing</option>
              <option value="1">Streaming</option>
              <option value="2">Listening</option>
              <option value="3">Watching</option>
              <option value="4">Custom</option>
              <option value="5">Competing</option>
            </select>
          </div>
          <div style="width: 50%; padding-left: 10px">
            <span class="dbminputlabel">Status</span><br>
            <select id="status" class="round" style="width: 100%;">
              <option value="online">Online</option>
              <option value="idle">Idle</option>
              <option value="dnd">Do Not Disturb</option>
              <option value="invisible">Invisible</option>
            </select>
          </div>
        </div>

        <br>
        
       <div style="float: left; display: inline-block; padding-top: 10px; width: 49%;">
        <span class="dbminputlabel">Activity Name</span><br>
        <input id="nameText" class="round" type="text" style="width: 100%;"><br>
       </div>
       <div style="float: right; display: inline-block; padding-top: 10px; width: 49%;">
        <span class="dbminputlabel">Activity State</span><br>
        <input id="stateText" class="round" type="text" style="width: 100%;"><br>
       </div>

       <br>

       <div style="width: 100%">
        <span class="dbminputlabel">URL (YouTube / Twitch)</span><br>
        <input id="url" class="round" type="text" style="width: 100%;"><br>
       </div>
      `;
  },

  // ---------------------------------------------------------------------
  // region # Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {
    const { glob, document } = this;

    glob.onComparisonChanged = function (event) {
      const value = parseInt(event.value, 10);

      const urlElem = document.getElementById('url');
      const nameElem = document.getElementById('nameText');
      const stateElem = document.getElementById('stateText');

      const urlField = urlElem ? urlElem.parentElement : null;
      const nameField = nameElem ? nameElem.parentElement : null;
      const stateField = stateElem ? stateElem.parentElement : null;

      if (urlField) {
        urlField.style.display = value === 1 ? 'block' : 'none';
      }

      if (value === 4) {
        if (nameField) {
          nameField.style.display = 'none';
        }
        if (stateField) {
          stateField.style.display = 'block';
          stateField.style.float = 'none';
          stateField.style.width = '100%';
          stateField.style.paddingTop = stateField.style.paddingTop || '10px';
        }
      } else {
        if (nameField) {
          nameField.style.display = 'inline-block';
          nameField.style.float = 'left';
          nameField.style.width = '49%';
          nameField.style.paddingTop = nameField.style.paddingTop || '10px';
        }
        if (stateField) {
          stateField.style.display = 'inline-block';
          stateField.style.float = 'right';
          stateField.style.width = '49%';
          stateField.style.paddingTop = stateField.style.paddingTop || '10px';
        }
      }
    };

    const select = document.getElementById('activityType');
    if (select) glob.onComparisonChanged(select);
  },

  // ---------------------------------------------------------------------
  // region # Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const client = this.getDBM().Bot.bot;

    const status = this.evalMessage(data.status, cache);
    const activityType = Number(this.evalMessage(data.activityType, cache));
    const nameText = this.evalMessage(data.nameText, cache);
    const stateText = this.evalMessage(data.stateText, cache);
    const url = this.evalMessage(data.url, cache);

    const preload = {
      status, // online, idle, dnd, invisible
      activities: [
        {
          name: nameText,
          state: stateText,
          type: activityType, // 0-Playing, 1-Streaming, 2-Listening, 3-Watching, 4-Custom, 5-Competing
        },
      ],
    };

    if (url) {
      preload.activities[0].url = url;
    }

    client.user.setPresence(preload);

    this.callNextAction(cache);
  },

  // ---------------------------------------------------------------------
  // region # Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};

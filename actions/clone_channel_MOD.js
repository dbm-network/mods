module.exports = {
  name: 'Clone Channel MOD',
  displayName: 'Clone Channel',
  section: 'Channel Control',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/clone_channel_MOD.js',
  },

  subtitle(data, presets) {
    return `Clone Channel: ${presets.getChannelText(data.storage, data.varName)}`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName2, 'Channel'];
  },

  fields: [
    'storage',
    'varName',
    'categoryID',
    'position',
    'permission',
    'info',
    'topic',
    'slowmode',
    'nsfw',
    'bitrate',
    'userLimit',
    'storage2',
    'varName2',
  ],

  html() {
    return `
<div style="padding-top: 8px;">
  <channel-input dropdownLabel="Source Channel" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>
</div>
<br><br><br>

<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    <span class="dbminputlabel">Category ID</span>
    <input id="categoryID" class="round" type="text" placeholder="Leave blank to clone"><br>
  </div>
  <div style="float: right; width: 60%;">
    <span class="dbminputlabel">Position</span>
    <input id="position" class="round" type="text" placeholder="Leave blank to clone"><br>
  </div>
</div>
<br><br><br>

<div>
  <div style="float: left; width: 35%;">
    <span class="dbminputlabel">Clone Permission</span>
    <select id="permission" class="round">
      <option value="0">False</option>
      <option value="1" selected>True</option>
    </select><br>
  </div>
  <div style="float: right; width: 60%;">
    <span class="dbminputlabel">Channel Type</span>
    <select id="info" class="round" onchange="glob.channeltype(this, 'option')">
      <option value="0" selected>Automatic (Clone Everything)</option>
      <option value="1">Text Channel</option>
      <option value="2">Voice Channel</option>
    </select><br>
  </div>
</div>
<br><br><br>

<div id="text" style="display: none">
  <div style="float: left; width: 28%;">
    <span class="dbminputlabel">Clone Topic?</span>
    <select id="topic" class="round">
      <option value="0">False</option>
      <option value="1" selected>True</option>
    </select><br>
  </div>
  <div style="padding-left: 5%; float: left; width: 33%;">
    <span class="dbminputlabel">Clone NSFW?</span>
    <select id="nsfw" class="round">
      <option value="0">False</option>
      <option value="1" selected>True</option>
    </select><br>
  </div>
  <div style="padding-left: 5%; float: left; width: 34%;">
    <span class="dbminputlabel">Clone Slow Mode?</span>
    <select id="slowmode" class="round">
      <option value="0">False</option>
      <option value="1" selected>True</option>
    </select><br>
  </div>
</div>

<div id="voice" style="display: none;">
  <div style="float: left; width: 35%;">
    <span class="dbminputlabel">Clone User Limit?</span>
    <select id="userLimit" class="round">
      <option value="0">False</option>
      <option value="1" selected>True</option>
    </select><br>
  </div>
  <div style="float: right; width: 60%;">
    <span class="dbminputlabel">Clone Bitrate?</span>
    <select id="bitrate" class="round">
      <option value="0">False</option>
      <option value="1" selected>True</option>
    </select><br>
  </div>
</div>

<div style="padding-top: 8px;">
  <store-in-variable dropdownLabel="Store In" selectId="storage2" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
</div>`;
  },

  init() {
    const { glob, document } = this;

    glob.channeltype = function channeltype(event) {
      if (event.value === '0') {
        document.getElementById('text').style.display = 'none';
        document.getElementById('voice').style.display = 'none';
      } else if (event.value === '1') {
        document.getElementById('text').style.display = null;
        document.getElementById('voice').style.display = 'none';
      } else if (event.value === '2') {
        document.getElementById('text').style.display = 'none';
        document.getElementById('voice').style.display = null;
      }
    };
    glob.channeltype(document.getElementById('info'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = await this.getChannelFromData(data.storage, data.varName, cache);

    if (!channel) return this.callNextAction(cache);

    const parentId = data.categoryID ? parseInt(this.evalMessage(data.categoryID, cache), 10) : channel.parentId;
    const options = {
      permissionOverwrites: data.permission === '1' ? channel.permissionOverwrites?.cache : [],
      parent: channel.guild.channels.cache.get(parentId),
      type: channel.type,
      position: parseInt(this.evalMessage(data.position, cache), 10) ?? channel.position,
      nsfw: data.nsfw === '1' ? channel.nsfw : false,
      rateLimitPerUser: data.slowmode === '1' ? channel.rateLimitPerUser : 0,
      defaultReactionEmoji: channel.defaultReactionEmoji,
    };

    if (channel.type === 'GUILD_VOICE') {
      Object.assign(options, {
        userLimit: data.userLimit === '1' ? channel.userLimit : 0,
        bitrate: data.bitrate === '1' ? channel.bitrate : undefined,
        rtcRegion: channel.rtcRegion,
        videoQualityMode: channel.videoQualityMode,
      });
    } else if (channel.type === 'GUILD_TEXT') {
      Object.assign(options, {
        topic: data.topic === '1' ? channel.topic : undefined,
        defaultAutoArchiveDuration: channel.defaultAutoArchiveDuration,
      });
    }

    channel.guild.channels
      .create(channel.name, options)
      .then((newChannel) => {
        const storage2 = parseInt(data.storage2, 10);
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(newChannel, storage2, varName2, cache);
        this.callNextAction(cache);
      })
      .catch(this.displayError.bind(this, data, cache));
  },

  mod() {},
};

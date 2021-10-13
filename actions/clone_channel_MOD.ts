/* eslint-disable @typescript-eslint/no-unnecessary-condition */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import type { GuildChannel } from 'discord.js';
import type { Action } from '../typings/globals';

const action: Action<
  | 'storage'
  | 'varName'
  | 'categoryID'
  | 'position'
  | 'permission'
  | 'info'
  | 'topic'
  | 'slowmode'
  | 'nsfw'
  | 'bitrate'
  | 'userLimit'
  | 'storage2'
  | 'varName2'
> = {
  name: 'Clone Channel',
  section: 'Channel Control',
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

  subtitle(data) {
    const names = [
      'Same Channel',
      'Mentioned Channel',
      'Default Channel',
      'Temp Variable',
      'Server Variable',
      'Global Variable',
    ];
    const index = parseInt(data.storage, 10);
    return index < 3 ? `Clone Channel : ${names[index]}` : `Clone Channel : ${names[index]} - ${data.varName}`;
  },

  variableStorage(data: any, varType: any) {
    if (parseInt(data.storage2, 10) !== varType) return;
    return [data.varName2, 'Channel'];
  },

  html(isEvent: any, data: any) {
    return `
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Source Channel:<br>
    <select id="storage" class="round" onchange="glob.channelChange(this, 'varNameContainer')">
      ${data.channels[isEvent ? 1 : 0]}
    </select>
  </div>
  <div id="varNameContainer" style="display: none; padding-left: 5%; float: left; width: 65%;">
    Variable Name:<br>
    <input id="varName" class="round" type="text" list="variableList"><br>
  </div>
</div><br><br><br>
<div style="padding-top: 8px;">
  <div style="float: left; width: 50%;">
    Category ID:<br>
    <input id="categoryID" class="round" type="text"><br>
  </div>
  <div style="float: right; width: 50%;">
    Position:<br>
    <input id="position" class="round" type="text"><br>
  </div>
</div><br><br><br>
<div>
  <div style="float: left; width: 45%;">
    Clone Permission:<br>
    <select id="permission" class="round">
      <option value="0">False</option>
      <option value="1">True</option>
    </select><br>
  </div>
  <div style="padding-left: 5%; float: left; width: 50%;">
    Channel Type:<br>
    <select id="info" class="round" onchange="glob.channeltype(this, 'option')">
      <option value="0">Automatic (Clone Everything)</option>
      <option value="1">Text Channel</option>
      <option value="2">Voice Channel</option>
    </select><br>
  </div>
</div><br><br><br>
<div id="text" style="display: none">
  <div style="float: left; width: 28%;">
    Clone Topic:<br>
    <select id="topic" class="round">
      <option value="0">False</option>
      <option value="1">True</option>
    </select><br>
  </div>
  <div style="padding-left: 5%; float: left; width: 33%;">
    Clone NSFW:<br>
    <select id="nsfw" class="round">
      <option value="0">False</option>
      <option value="1">True</option>
    </select><br>
  </div>
  <div style="padding-left: 5%; float: left; width: 34%;">
    Clone Slow Mode:<br>
    <select id="slowmode" class="round">
      <option value="0">False</option>
      <option value="1">True</option>
    </select><br>
  </div>
</div>
<div id="voice" style="display: none;">
  <div style="float: left; width: 45%;">
    Clone User Limit:<br>
    <select id="userLimit" class="round">
      <option value="0">False</option>
      <option value="1">True</option>
    </select><br>
  </div>
  <div style="padding-left: 5%; float: left; width: 50%;">
    Clone Bitrate:<br>
    <select id="bitrate" class="round">
      <option value="0">False</option>
      <option value="1">True</option>
    </select><br>
  </div>
</div>
<div style="padding-top: 8px;">
  <div style="float: left; width: 35%;">
    Store In:<br>
    <select id="storage2" class="round" onchange="glob.variableChange(this, 'varNameContainer2')">
      ${data.variables[0]}
    </select>
  </div>
  <div id="varNameContainer2" style="display: none; padding-left: 5%; float: left; width: 65%;">
    Variable Name:<br>
    <input id="varName2" class="round" type="text">
  </div>
</div>`;
  },

  init(this: any) {
    const { glob, document } = this;

    glob.channelChange(document.getElementById('storage'), 'varNameContainer');
    glob.variableChange(document.getElementById('storage2'), 'varNameContainer2');

    glob.channeltype = function channeltype(event: any) {
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

  action(this, cache) {
    const data = cache.actions[cache.index];
    const { server } = cache;
    const storage = parseInt(data.storage, 10);
    const varName = this.evalMessage(data.varName, cache);
    const channel = this.getChannel(storage, varName, cache);

    if (!server || !channel) {
      console.log(`${server ? 'channel' : 'server'} could not be found! Clone Channel MOD.`);
      return this.callNextAction(cache);
    }

    const options = {};

    if (data.permission === 1) {
      Object.assign(options, {
        permissionOverwrites: channel.permissionOverwrites,
      });
    }
    if (data.categoryID) {
      Object.assign(options, {
        parent: parseInt(this.evalMessage(data.categoryID, cache), 10),
      });
    }

    if (channel.type === 'voice') {
      Object.assign(options, {
        userLimit: data.userLimit === 1 ? channel.userLimit : 0,
        bitrate: data.bitrate === 1 ? channel.bitrate : 64,
      });
    } else if (channel.type === 'text') {
      Object.assign(options, {
        nsfw: data.nsfw === 1 ? channel.nsfw : false,
        topic: data.topic === 1 ? channel.topic : undefined,
        rateLimitPerUser: data.slowmode === 1 ? channel.rateLimitPerUser : 0,
      });
    }

    channel
      .clone(options)
      .then(async (newChannel: GuildChannel) => {
        if (data.position === 1) {
          await newChannel.setPosition(channel.position);
        }
        const storage2 = parseInt(data.storage2, 10);
        const varName2 = this.evalMessage(data.varName2, cache);
        this.storeValue(newChannel, storage2, varName2, cache);
        this.callNextAction(cache);
      })
      .catch(this.displayError.bind(this, data, cache));
  },

  mod() {},
};

module.exports = action;

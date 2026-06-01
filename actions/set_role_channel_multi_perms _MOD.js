module.exports = {
  name: 'Set Role Channel Multi Perms',
  section: 'Channel Control',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data, presets) {
    return `${presets.getChannelText(data.channel, data.varName)}`;
  },

  fields: [
    'channel',
    'varName',
    'role',
    'varName2',
    'apportionment',
    'state1',
    'state2',
    'state3',
    'state4',
    'state5',
    'state6',
    'state7',
    'state8',
    'state9',
    'state10',
    'state11',
    'state12',
    'state13',
    'state14',
    'state15',
    'state16',
    'state17',
    'state18',
    'state19',
    'state20',
    'state21',
    'state22',
    'state23',
    'state24',
    'state25',
    'state26',
    'state27',
    'state1v',
    'state2v',
    'state3v',
    'state4v',
    'state5v',
    'state6v',
    'state7v',
    'state8v',
    'state9v',
    'state10v',
    'state11v',
    'state12v',
    'state13v',
    'state14v',
    'state15v',
    'state16v',
    'state17v',
    'state18v',
    'state19v',
    'state20v',
    'state21v',
    'state22v',
    'state23v',
    'state24v',
    'state25v',
    'state26v',
    'state27v',
    'reason',
  ],

  html(isEvent, data) {
    return `
    <div style="height:370px;overflow:auto;padding:10px;">
<channel-input dropdownLabel="Canal" selectId="channel" variableContainerId="varNameContainer" variableInputId="varName"></channel-input>

<br><br><br>

<role-input style="padding-top: 8px;" dropdownLabel="Cargo" selectId="role" variableContainerId="varNameContainer2" variableInputId="varName2"></role-input>

<br><br><br>
<br>
<span class="dbminputlabel">Recurso</span><br>
		<select id="apportionment" class="round" onchange="glob.onComparisonChanged(this)">
			<option value="0" selected>Menu</option>
			<option value="1">Campo de texto [Variavel]</option>
      </select>
      <br>
<div id="containerdoxin1">
<center>
<table style="width:96%">
<tr><th>Permissões</th><th>Alterar para</th></tr>

<tr><td>View channels</td><td><select id="state1" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Manage Channel</td><td><select id="state2" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Manage webhooks</td><td><select id="state3" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Create invitation</td><td><select id="state4" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>


<tr><td>Send messages</td><td><select id="state5" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Send messages in threads</td><td><select id="state6" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Create Public Topics</td><td><select id="state7" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Create private topics</td><td><select id="state8" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Insert links</td><td><select id="state9" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Attach files</td><td><select id="state10" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Add Reactions</td><td><select id="state11" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Use external emojis</td><td><select id="state12" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Use external stickers</td><td><select id="state13" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Mention @everyone</td><td><select id="state14" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Manage Messages</td><td><select id="state15" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Manage topics</td><td><select id="state16" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>View message history</td><td><select id="state17" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Send Text-to-Voice Messages</td><td><select id="state18" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>Use Application Commands</td><td><select id="state19" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>[Voice Channel] Connect</td><td><select id="state20" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>[Voice Channel] Speak</td><td><select id="state21" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>[Voice Channel] Video</td><td><select id="state22" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>[Voice Channel] Use voice detection</td><td><select id="state23" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>[Voice Channel] Priority Voice</td><td><select id="state24" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>[Voice Channel] Mute Members</td><td><select id="state25" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>[Voice Channel] Deafen members</td><td><select id="state26" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>

<tr><td>[Voice Channel] Move Members</td><td><select id="state27" class="round">
<option value="0">Allow</option>
<option value="1" selected>Inherit</option>
<option value="2">Disallow</option>
</select></td></tr>


</table></center></div>
<div id="containerdoxin2">
<center>
Use 0 for Allow, 1 for Inherit and 2 for Disallow<br><br>
<table style="width:96%">
<tr><th>Permissions</th><th>Change to</th></tr>

<tr><td>View channels</td><td><input id="state1v" class="round" type="text"></td></tr>

<tr><td>Manage Channel</td><td><input id="state2v" class="round" type="text"></td></tr>

<tr><td>Manage webhooks</td><td><input id="state3v" class="round" type="text"></td></tr>

<tr><td>Create invitation</td><td><input id="state4v" class="round" type="text"></td></tr>

<tr><td>Send messages</td><td><input id="state5v" class="round" type="text"></td></tr>

<tr><td>Send messages in threads</td><td><input id="state6v" class="round" type="text"></td></tr>

<tr><td>Create public topics</td><td><input id="state7v" class="round" type="text"></td></tr>

<tr><td>Create private topics</td><td><input id="state8v" class="round" type="text"></td></tr>

<tr><td>Insert links</td><td><input id="state9v" class="round" type="text"></td></tr>

<tr><td>Attach files</td><td><input id="state10v" class="round" type="text"></td></tr>

<tr><td>Add Reactions</td><td><input id="state11v" class="round" type="text"></td></tr>

<tr><td>Use external emojis</td><td><input id="state12v" class="round" type="text"></td></tr>

<tr><td>Use external stickers</td><td><input id="state13v" class="round" type="text"></td></tr>

<tr><td>Mention @everyone</td><td><input id="state14v" class="round" type="text"></td></tr>

<tr><td>Manage messages</td><td><input id="state15v" class="round" type="text"></td></tr>

<tr><td>Manage topics</td><td><input id="state16v" class="round" type="text"></td></tr>

<tr><td>View message history</td><td><input id="state17v" class="round" type="text"></td></tr>

<tr><td>Send Text-to-Voice Messages</td><td><input id="state18v" class="round" type="text"></td></tr>

<tr><td>Use Application Commands</td><td><input id="state19v" class="round" type="text"></td></tr>

<tr><td>[Voice Channel] Connect</td><td><input id="state20v" class="round" type="text"></td></tr>

<tr><td>[Voice Channel] Talk</td><td><input id="state21v" class="round" type="text"></td></tr>

<tr><td>[Voice Channel] Video</td><td><input id="state22v" class="round" type="text"></td></tr>

<tr><td>[Voice Channel] Use voice detection</td><td><input id="state23" class="round" type="text"></td></tr>

<tr><td>[Voice Channel] Priority Voice</td><td><input id="state24v" class="round" type="text"></td></tr>

<tr><td>[Voice Channel] Mute Members</td><td><input id="state25v" class="round" type="text"></td></tr>

<tr><td>[Voice Channel] Deafen members</td><td><input id="state26v" class="round" type="text"></td></tr>

<tr><td>[Voice Channel] Move Members</td><td><input id="state27v" class="round" type="text"></td></tr>

</table></center>
</div>
<br>


<div style="padding-top: 8px;">
  <span class="dbminputlabel">Reason</span>
  <input id="reason" placeholder="Optional" class="round" type="text">
</div>

	
</div>
<style>
td{padding:5px;border:1px solid #777}</style>`;
  },

  init() {
    const { glob, document } = this;

    glob.onComparisonChanged = function (event) {
      if (event.value === '0') {
        document.getElementById('containerdoxin1').style.display = null;
        document.getElementById('containerdoxin2').style.display = 'none';
      } else {
        document.getElementById('containerdoxin2').style.display = null;
        document.getElementById('containerdoxin1').style.display = 'none';
      }
    };

    glob.onComparisonChanged(document.getElementById('apportionment'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = await this.getChannelFromData(data.channel, data.varName, cache);
    const role = await this.getRoleFromData(data.role, data.varName2, cache);
    const reason = this.evalMessage(data.reason, cache);

    const options = {
      VIEW_CHANNEL: [true, null, false][parseInt(data.state1, 10)],
      MANAGE_CHANNELS: [true, null, false][parseInt(data.state2, 10)],
      MANAGE_WEBHOOKS: [true, null, false][parseInt(data.state3, 10)],
      CREATE_INSTANT_INVITE: [true, null, false][parseInt(data.state4, 10)],
      SEND_MESSAGES: [true, null, false][parseInt(data.state5, 10)],
      SEND_MESSAGES_IN_THREADS: [true, null, false][parseInt(data.state6, 10)],
      CREATE_PUBLIC_THREADS: [true, null, false][parseInt(data.state7, 10)],
      CREATE_PRIVATE_THREADS: [true, null, false][parseInt(data.state8, 10)],
      EMBED_LINKS: [true, null, false][parseInt(data.state9, 10)],
      ATTACH_FILES: [true, null, false][parseInt(data.state10, 10)],
      ADD_REACTIONS: [true, null, false][parseInt(data.state11, 10)],
      USE_EXTERNAL_EMOJIS: [true, null, false][parseInt(data.state12, 10)],
      USE_EXTERNAL_STICKERS: [true, null, false][parseInt(data.state13, 10)],
      MENTION_EVERYONE: [true, null, false][parseInt(data.state14, 10)],
      MANAGE_MESSAGES: [true, null, false][parseInt(data.state15, 10)],
      MANAGE_THREADS: [true, null, false][parseInt(data.state16, 10)],
      READ_MESSAGE_HISTORY: [true, null, false][parseInt(data.state17, 10)],
      SEND_TTS_MESSAGES: [true, null, false][parseInt(data.state18, 10)],
      USE_APPLICATION_COMMANDS: [true, null, false][parseInt(data.state19, 10)],
      CONNECT: [true, null, false][parseInt(data.state20, 10)],
      SPEAK: [true, null, false][parseInt(data.state21, 10)],
      STREAM: [true, null, false][parseInt(data.state22, 10)],
      USE_VAD: [true, null, false][parseInt(data.state23, 10)],
      PRIORITY_SPEAKER: [true, null, false][parseInt(data.state24, 10)],
      MUTE_MEMBERS: [true, null, false][parseInt(data.state25, 10)],
      DEAFEN_MEMBERS: [true, null, false][parseInt(data.state26, 10)],
      MOVE_MEMBERS: [true, null, false][parseInt(data.state27, 10)],
    };
    const state1v = this.evalMessage(data.state1v, cache);
    const state2v = this.evalMessage(data.state2v, cache);
    const state3v = this.evalMessage(data.state3v, cache);
    const state4v = this.evalMessage(data.state4v, cache);
    const state5v = this.evalMessage(data.state5v, cache);
    const state6v = this.evalMessage(data.state6v, cache);
    const state7v = this.evalMessage(data.state7v, cache);
    const state8v = this.evalMessage(data.state8v, cache);
    const state9v = this.evalMessage(data.state9v, cache);
    const state10v = this.evalMessage(data.state10v, cache);
    const state11v = this.evalMessage(data.state11v, cache);
    const state12v = this.evalMessage(data.state12v, cache);
    const state13v = this.evalMessage(data.state13v, cache);
    const state14v = this.evalMessage(data.state14v, cache);
    const state15v = this.evalMessage(data.state15v, cache);
    const state16v = this.evalMessage(data.state16v, cache);
    const state17v = this.evalMessage(data.state17v, cache);
    const state18v = this.evalMessage(data.state18v, cache);
    const state19v = this.evalMessage(data.state19v, cache);
    const state20v = this.evalMessage(data.state20v, cache);
    const state21v = this.evalMessage(data.state21v, cache);
    const state22v = this.evalMessage(data.state22v, cache);
    const state23v = this.evalMessage(data.state23v, cache);
    const state24v = this.evalMessage(data.state24v, cache);
    const state25v = this.evalMessage(data.state24v, cache);
    const state26v = this.evalMessage(data.state24v, cache);
    const state27v = this.evalMessage(data.state24v, cache);
    const options2 = {
      VIEW_CHANNEL: [true, null, false][parseInt(state1v, 10)],
      MANAGE_CHANNELS: [true, null, false][parseInt(state2v, 10)],
      MANAGE_WEBHOOKS: [true, null, false][parseInt(state3v, 10)],
      CREATE_INSTANT_INVITE: [true, null, false][parseInt(state4v, 10)],
      SEND_MESSAGES: [true, null, false][parseInt(state5v, 10)],
      SEND_MESSAGES_IN_THREADS: [true, null, false][parseInt(state6v, 10)],
      CREATE_PUBLIC_THREADS: [true, null, false][parseInt(state7v, 10)],
      CREATE_PRIVATE_THREADS: [true, null, false][parseInt(state8v, 10)],
      EMBED_LINKS: [true, null, false][parseInt(state9v, 10)],
      ATTACH_FILES: [true, null, false][parseInt(state10v, 10)],
      ADD_REACTIONS: [true, null, false][parseInt(state11v, 10)],
      USE_EXTERNAL_EMOJIS: [true, null, false][parseInt(state12v, 10)],
      USE_EXTERNAL_STICKERS: [true, null, false][parseInt(state13v, 10)],
      MENTION_EVERYONE: [true, null, false][parseInt(state14v, 10)],
      MANAGE_MESSAGES: [true, null, false][parseInt(state15v, 10)],
      MANAGE_THREADS: [true, null, false][parseInt(state16v, 10)],
      READ_MESSAGE_HISTORY: [true, null, false][parseInt(state17v, 10)],
      SEND_TTS_MESSAGES: [true, null, false][parseInt(state18v, 10)],
      USE_APPLICATION_COMMANDS: [true, null, false][parseInt(state19v, 10)],
      CONNECT: [true, null, false][parseInt(state20v, 10)],
      SPEAK: [true, null, false][parseInt(state21v, 10)],
      STREAM: [true, null, false][parseInt(state22v, 10)],
      USE_VAD: [true, null, false][parseInt(state23v, 10)],
      PRIORITY_SPEAKER: [true, null, false][parseInt(state24v, 10)],
      MUTE_MEMBERS: [true, null, false][parseInt(state25v, 10)],
      DEAFEN_MEMBERS: [true, null, false][parseInt(state26v, 10)],
      MOVE_MEMBERS: [true, null, false][parseInt(state27v, 10)],
    };

    const apportionment = parseInt(data.apportionment, 10);

    switch (apportionment) {
      case 0:
        if (role?.id) {
          if (Array.isArray(channel)) {
            channel.permissionOverwrites.edit(role.id);
          } else if (channel?.permissionOverwrites) {
            channel.permissionOverwrites
              .edit(role, options, { reason, type: 0 })
              .then(() => this.callNextAction(cache))
              .catch((err) => this.displayError(data, cache, err));
          } else {
            this.callNextAction(cache);
          }
        } else {
          this.callNextAction(cache);
        }
        break;
      case 1:
        if (role?.id) {
          if (Array.isArray(channel)) {
            channel.permissionOverwrites.edit(role.id);
          } else if (channel?.permissionOverwrites) {
            channel.permissionOverwrites
              .edit(role, options2, { reason, type: 0 })
              .then(() => this.callNextAction(cache))
              .catch((err) => this.displayError(data, cache, err));
          } else {
            this.callNextAction(cache);
          }
        } else {
          this.callNextAction(cache);
        }
        break;
    }
  },

  mod() {},
};

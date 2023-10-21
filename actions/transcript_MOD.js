module.exports = {
  name: 'Transcript',
  section: 'Other Stuff',
  meta: {
    version: '2.2.0',
    preciseCheck: false,
    author: 'DBM Mods',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods/blob/master/actions/transcript_MOD.js',
  },

  subtitle(data, presets) {
    return `Create a transcript from ${presets.getChannelText(data.channelObj, data.channelID)}`;
  },

  variableStorage(data, storage) {
    const type = parseInt(data.storage, 10);
    if (type !== storage) return;
    return [data.varName, 'Transcript'];
  },

  fields: [
    'poweredBy',
    'Removed Option',
    'saveImages',
    'Removed Option',
    'footer',
    'channelObj',
    'channelID',
    'storage',
    'varName',
  ],

  html() {
    return `
<div style="height: 360px; overflow-y: scroll;">
  <div style="padding-top: 8px;">
    <channel-input dropdownLabel="Source Channel" selectId="channelObj" variableContainerId="varNameContainer" variableInputId="channelID"></channel-input>
  </div>
  <br><br><br>

  <div style="padding-top: 8px;">
    <span class="dbminputlabel">Options</span>
    <div class="dbm-round">
      <div style="margin: 10px;">

        <!-- Powered By -->
        <div>
          <div style="float: left; width: 35%;">
            <select id="poweredBy" class="round">
              <option value="0">False</option>
              <option value="1" selected>True</option>
            </select>
          </div>
          <div style="float: right; width: 60%;">
            <label>  Whether to include the "Powered by discord-html-transcripts" footer</label><br>
          </div>
        </div><br><br>

        <!-- Save Images Locally -->
        <div>
          <div style="float: left; width: 35%;">
            <select id="saveImages" class="round">
              <option value="0" selected>False</option>
              <option value="1">True</option>
            </select>
          </div>
          <div style="float: right; width: 60%;">
            <label> Save images locally (Makes filesize larger)</label><br>
          </div>
        </div><br><br>

        <!-- Footer Text -->
        <div>
          <div style="float: left; width: 35%">
            <input id="footer" class="round" type="text" value="Exported {number} message{s}">
          </div>
          <div style="float: right; width: 60%;">
            <label> Set the footer, {number} = messages amount, {s} = plural</label><br>
          </div>
        </div>
      </div>
    </div>
  </div>
  <br>

  <div style="padding-top: 8px;">
    <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer1" variableInputId="varName"></store-in-variable>
  </div>

  <div style="float: left; width: 90%; padding-top: 8px;">
    <p>
      <u>Note:</u><br>
      Saving images locally GREATLY increases file size, you may be unable to send the file through discord (8MB limit)<br>
      To send the transcript put the temp variable from here into file control with these options: [other][write][transcript.html]<br>
      Put the file path to your desired directory (ex: ./), use send message and attach the file with ./transcript.html
    </p>
  </div>
</div>

    <style>
      .dbm-round {
        background-color: #53585f;
        border: 1px solid white;
        border-radius: 4px;
        height: 127px;
      }
    </style>
    `;
  },

  init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const channel = await this.getChannelFromData(data.channelObj, data.varName, cache);
    const discordTranscripts = require('discord-html-transcripts');

    if (!channel) {
      console.log('Missing channel in Transcript');
      return this.callNextAction(cache);
    }

    // Get Config
    const saveImages = data.saveImages === '1' ? true : false;
    const poweredBy = data.poweredBy === '1' ? true : false;
    const footer = this.evalMessage(data.footer, cache);

    try {
      const transcript = await discordTranscripts.createTranscript(channel, {
        limit: -1,
        returnType: 'string',
        saveImages,
        poweredBy,
        footer,
      });

      const storage = parseInt(data.storage, 10);
      const varName = this.evalMessage(data.varName, cache);
      this.storeValue(transcript, storage, varName, cache);
    } catch (err) {
      console.error(err);
    }

    this.callNextAction(cache);
  },

  mod() {},
};

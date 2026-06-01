module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Create Transcript',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Other Stuff',

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    return `Gets a Transcript from a Channel: ${presets.getChannelText(data.channel, data.varName1)}`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, storage) {
    const type = parseInt(data.storage, 10);
    if (type !== storage) return;
    return [data.varName2, 'Transcript (HTML)'];
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: [
    'fileName',
    'saveImages',
    'useSSR',
    'channel',
    'storage',
    'varName1',
    'varName2',
    'footerText',
    'poweredBy',
    'messageLimit',
  ],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html() {
    return `
    <div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.0</a></div>

    <div>
      <channel-input dropdownLabel="Source Channel" selectId="channel" variableContainerId="varNameContainer1" variableInputId="varName1"></channel-input>
    </div>

    <br><br><br>

    <tab-system style="margin-top: 20px;">
    <tab label="Options" icon="comment">

          <div style="float: left; width: 100%;">
            <span class="dbminputlabel">File Name</span>
            <input id="fileName" placeholder="Leave blank for transcript.html" value="transcript.html" class="round" type="text">
          </div><br><br><br>

          <div style="float: left; width: 35%;">
              <select id="saveImages" class="round">
                <option value="0">False</option>
                <option value="1">True</option>
              </select>
            </div>
            <div style="float: right; width: 60%;">
              <label> Download all images in the HTML</label><br>
            </div><br><br>

            <div style="float: left; width: 35%;">
              <select id="useSSR" class="round">
                <option value="0">False</option>
                <option value="1" selected>True</option>
              </select>
            </div>
            <div style="float: right; width: 60%;">
              <label> Makes the transcript look like Discord even without an internet connection</label><br>
            </div><br>

              </tab>


              <tab label="Advanced" icon="comment">

              <div style="float: left; width: 100%;">
            <span class="dbminputlabel">Footer Text</span>
            <input id="footerText" placeholder="Leave blank for default" value="Exported {number} message{s}" class="round" type="text">
          </div><br><br><br>

          <div style="float: left; width: 100%;">
          <span class="dbminputlabel">Show "Powered By" in Footer?</span>
          <select id="poweredBy" class="round">
            <option value="0" selected>False</option>
            <option value="1">True</option>
          </select>
          </div><br><br><br>

          <div style="float: left; width: 100%;">
            <span class="dbminputlabel">Message Limit</span>
            <input id="messageLimit" placeholder="Leave blank or -1 for none limit..." class="round" type="text">
          </div><br><br><br>

              </tab>
        </tab-system>

<br><br><br><br><br><br><br><br><br><br>

    <div style="margin-top: 40px;">
      <store-in-variable dropdownLabel="Store In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>
    </div>
    `;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const fs = require('fs');

    let discordTranscripts;
    try {
      discordTranscripts = require('discord-html-transcripts');
    } catch (err) {
      console.error(
        "[Create Transcript] Missing module 'discord-html-transcripts'. Please install it using 'npm install discord-html-transcripts'!",
      );
      this.callNextAction(cache);
      return;
    }

    try {
      // Set Channel
      const channel = await this.getChannelFromData(data.channel, data.varName1, cache);
      if (!channel) {
        this.callNextAction(cache);
        return;
      }

      // Set Config
      const fileName = this.evalMessage(data.fileName, cache) || 'transcript.html';
      const footerText = this.evalMessage(data.footerText, cache) || 'Exported {number} message{s}';
      const messageLimit = parseInt(this.evalMessage(data.messageLimit, cache), 10) || -1;
      const saveImages = data.saveImages === '1' ? true : false;
      const useSSR = data.useSSR === '1' ? true : false;
      const poweredBy = data.poweredBy === '1' ? true : false;

      // Create Transcript
      const transcript = await discordTranscripts.createTranscript(channel, {
        limit: messageLimit,
        returnType: 'string',
        filename: fileName,
        saveImages,
        footerText,
        poweredBy,
        ssr: useSSR,
      });

      fs.writeFileSync(fileName, transcript);
      // Save Transcript and Call Next Action
      this.storeValue(fileName, parseInt(data.storage, 10), data.varName2, cache);
      this.callNextAction(cache);
      // /////////////////////
    } catch (err) {
      console.log('[Create Transcript] An error occurred while generating the transcript!');
      this.callNextAction(cache);
    }
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};

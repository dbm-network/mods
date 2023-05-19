module.exports = {
  name: 'Transcript',
  section: 'Other Stuff',
  meta: {
    version: '2.1.7',
    preciseCheck: false,
    author: 'Staku',
    authorUrl: null,
    downloadURL: null,
  },

  subtitle() {
    return `Gets a Transcript from a Channel`;
  },

  variableStorage(data, storage) {
    const type = parseInt(data.storage, 10);
    if (type !== storage) return;
    return [data.varName, 'Transcript (HTML)'];
  },

  fields: ['useMinify', 'saveImages', 'useCDN', 'channelObj', 'channelID', 'storage', 'varName'],

  html(isEvent, data) {
    return `
    <retrieve-from-variable allowSlashParams dropdownLabel="Channel Object" selectId="channelObj" variableContainerId="varNameContainer" variableInputId="channelID"></retrieve-from-variable>

    <br><br><br>

    <div style="padding-top: 8px;"><span class="dbminputlabel">Options</span>
      <div class="dbm-round">
        <div style="margin: 10px;">
          
          <!-- use html-minifier -->
          <div>
            <div style="float: left; width: 35%;">
              <select id="useMinify" class="round">
                <option value="0">False</option>
                <option value="1">True</option>
              </select>
            </div>
            <div style="float: right; width: 60%;">
              <label> Minify the result? Uses html-minifier</label><br>
            </div>
          </div><br><br>

          <!-- Save Images Locally -->
          <div>
            <div style="float: left; width: 35%;">
              <select id="saveImages" class="round">
                <option value="0">False</option>
                <option value="1">True</option>
              </select>
            </div>
            <div style="float: right; width: 60%;">
              <label> Download all images in the HTML</label><br>
            </div>
          </div><br><br>

          <!-- Use CDN Option -->
          <div>
            <div style="float: left; width: 35%;">
              <select id="useCDN" class="round">
                <option value="0">False</option>
                <option value="1">True</option>
              </select>
            </div>
            <div style="float: right; width: 60%;">
              <label> Uses a CDN to serve discord styles rather than bundling it in the HTML</label><br>
            </div>
          </div><br><br>

        </div>
      </div>
    </div>



    <br><br>

    <div style="padding-top: 8px;">
      <div style="float: left; width: 35%;"><span class="dbminputlabel">Store In</span>
        <select id="storage" class="round">
          ${data.variables[1]}
        </select>
      </div>
      <div id="varNameContainer" style="float: right; width: 60%;"> <span class="dbminputlabel">Variable Name</span>
        <input id="varName" class="round" type="text"><br>
      </div>
    </div>




    <style>

      .dbm-round {
        border: 1px solid white;
        border-radius: 4px;
        height: 127px;
      }

    </style>
    `;
  },

  init() {},

  async action(cache) {
    // get packages and data
    const data = cache.actions[cache.index];
    const Mods = this.getMods();
    const discordTranscripts = Mods.require('discord-html-transcripts');

    const type = parseInt(data.channelObj, 10);
    const varName = this.evalMessage(data.channelID, cache);

    const channelObj = this.getVariable(type, varName, cache);

    const useMinify = data.useMinify === '1' ? true : false;
    const saveImages = data.saveImages === '1' ? true : false;
    const useCDN = data.useCDN === '1' ? true : false;

    let output;
    try {
      const transcript = await discordTranscripts.createTranscript(channelObj, {
        limit: -1,
        returnBuffer: false,
        fileName: `temp.html`,
        minify: useMinify,
        saveImages,
        useCDN,
      });

      output = transcript.attachment.toString();
    } catch (_err) {}

    this.storeValue(output, parseInt(data.storage, 10), data.varName, cache);
    this.callNextAction(cache);
  },

  mod() {},
};

module.exports = {
  name: 'Upload Image To Imgur',
  section: 'Other Stuff',

  subtitle() {
    return `Upload Image to Imgur`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, 'Image URL'];
  },

  fields: ['clientID', 'clientSecret', 'refreshToken', 'imageURL', 'storage', 'varName2'],

  html() {
    return `
      <div style="padding-top: 8px; display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; gap: 10px;">
          <div style="width: 33%;">
            Client ID:<br>
            <input id="clientID" class="round" type="text" style="width: 100%;">
          </div>
          <div style="width: 33%;">
            Client Secret (optional):<br>
            <input id="clientSecret" class="round" type="text" style="width: 100%;">
          </div>
          <div style="width: 33%;">
            Refresh Token (optional):<br>
            <input id="refreshToken" class="round" type="text" style="width: 100%;">
          </div>
        </div>
        <div style="display: flex; gap: 10px;">
          <div style="width: 50%;">
            Image URL:<br>
            <input id="imageURL" class="round" type="text" style="width: 100%;">
          </div>
          <div style="width: 50%;">
            Store In:<br>
            <select id="storage" class="round" style="width: 100%;">
              <option value="0">None</option>
              <option value="1">Temp Variable</option>
              <option value="2">Server Variable</option>
              <option value="3">Global Variable</option>
            </select>
          </div>
        </div>

        <div>
          Variable Name:<br>
          <input id="varName2" class="round" type="text" style="width: 100%;">
        </div>
      </div>`;
  },

  init() {},

  action(cache) {
    const { ImgurClient } = this.getMods().require('imgur');
    const data = cache.actions[cache.index];
    const clientID = this.evalMessage(data.clientID, cache);
    const clientSecret = this.evalMessage(data.clientSecret, cache);
    const refreshToken = this.evalMessage(data.refreshToken, cache);
    const imageURL = this.evalMessage(data.imageURL, cache);
    const varName2 = this.evalMessage(data.varName2, cache);
    const storage = parseInt(data.storage, 10);

    if (!clientID || !imageURL) {
      console.error('Client ID or Image URL is missing!');
      return this.callNextAction(cache);
    }

    const client = new ImgurClient({
      clientId: clientID,
      clientSecret: clientSecret || undefined,
      refreshToken: refreshToken || undefined,
    });

    client
      .upload({
        image: imageURL,
        type: 'url',
      })
      .then((response) => {
        const uploadedImageUrl = response.data.link;
        this.storeValue(uploadedImageUrl, storage, varName2, cache);
        this.callNextAction(cache);
      })
      .catch((err) => {
        console.error('Error uploading image to Imgur:', err.message);
        this.callNextAction(cache);
      });
  },
  mod() {},
};

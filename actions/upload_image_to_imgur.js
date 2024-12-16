const { ImgurClient } = require('imgur');


module.exports = {
  name: "Upload Image To Imgur",
  section: "Other Stuff",

  subtitle: function (data) {
    return `Upload Image to Imgur`;
  },

  variableStorage(data, varType) {
    const type = parseInt(data.storage);
    if (type !== varType) return;
    return [data.varName2, 'Image URL'];
  },

  fields: ["clientID", "clientSecret", "refreshToken", "imageURL", "storage", "varName2"],

  html: function (data) {
    return `
      <div style="padding-top: 8px; display: flex; flex-direction: column; gap: 10px;">
        <div style="display: flex; gap: 10px;">
          <div style="width: 33%;">
            Client ID:<br>
            <input id="clientID" class="round" type="text" style="width: 100%;">
          </div>
          <div style="width: 33%;">
            Client Secret:<br>
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
              ${data.variables[1]}
            </select>
          </div>
        </div>

        <div>
          Variable Name:<br>
          <input id="varName2" class="round" type="text" style="width: 100%;">
        </div>

      </div>`;
  },

  init: function () { },

  action: function (cache) {
    const data = cache.actions[cache.index];

    const clientID = this.evalMessage(data.clientID, cache);
    const clientSecret = this.evalMessage(data.clientSecret, cache);
    const refreshToken = this.evalMessage(data.refreshToken, cache);
    const imageURL = this.evalMessage(data.imageURL, cache);
    const varName2 = this.evalMessage(data.varName2, cache);
    const storage = parseInt(data.storage);

    const client = new ImgurClient({
      clientId: clientID,
      clientSecret: clientSecret,
      refreshToken: refreshToken || undefined,
    });

    client.upload({
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

  mod: function () { },
};

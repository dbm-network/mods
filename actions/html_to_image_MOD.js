module.exports = {
  name: 'HTML to Image',

  section: 'Other Stuff',

  fields: ['html', 'storage', 'height', 'url', 'width', 'varName'],

  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods/blob/main/actions/control_custom_data.js',
  },

  subtitle(data) {
    return `Create image in <b>${data.url}</b>`;
  },

  variableStorage(data, varType) {
    if (parseInt(data.storage, 10) !== varType) return;
    return [data.varName, 'Image'];
  },

  html(data, isEvent) {
    return `
          <span class="dbminputlabel">HTML</span><br>
           <textarea id="html" rows="10" name="is-eval" style="width: 99%; white-space: nowrap; resize: none;"></textarea><br>
           <span class="dbminputlabel">Save file</span><br>
           <input id="url" class="round" placeholder="./resources/img.png" type="text" ><br>
           <div style="float:left;width:48%">
             <span class="dbminputlabel">Width (px)</span><br>
             <input id="width" class="round" placeholder="100" type="text" ><br>
           </div>
           <div style="float:left;width:50%;padding-left:2%">
             <span class="dbminputlabel">Height (px)</span><br>
             <input id="height" class="round" placeholder="100" type="text" ><br>
          </div>
          `;
  },

  async init() {},

  async action(cache) {
    const data = cache.actions[cache.index];
    const html = this.evalMessage(data.html, cache);
    const url = this.evalMessage(data.url, cache);
    const width = Number(this.evalMessage(data.width, cache));
    const height = Number(this.evalMessage(data.height, cache));

    const fs = require('node:fs');
    const puppeteer = require('puppeteer');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.setContent(html);

    await page.setViewport({
      width,
      height,
    });

    const content = await page.$('body');
    const imageBuffer = await content.screenshot({ omitBackground: true });

    await page.close();
    await browser.close();

    fs.writeFileSync(url, imageBuffer);

    // cache.msg.channel.send({content: `${cache.msg.author.username}'s base:\n⁣`, files: [
    //   { attachment: imageBuffer }
    // ]})

    this.callNextAction(cache);
  },

  mod() {},
};

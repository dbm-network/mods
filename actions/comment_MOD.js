module.exports = {
  name: 'Comment',
  section: 'Other Stuff',
  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/dbm-network/mods',
    downloadURL: 'https://github.com/dbm-network/mods',
  },

  subtitle(data) {
    let styles = '';

    if (data.bold === 'true') styles += 'font-weight: bold; ';
    if (data.italic === 'true') styles += 'font-style: italic; ';
    if (data.underline === 'true') styles += 'text-decoration: underline; ';
    if (data.strikethrough === 'true') styles += 'text-decoration: line-through; ';

    return `<span style="color: ${data.color}; ${styles}">${data.comment}</span>`;
  },

  fields: ['comment', 'color', 'bold', 'italic', 'underline', 'strikethrough'],

  html() {
    return `
   <div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.1</a></div>
  
    
    
    <div style="margin-bottom: 10px;">
      <span class="dbminputlabel">Comment To Show</span><br>
      <input id="comment" class="round" type="text">
    </div>

    <hr class="subtlebar" style="width: 100%; margin-top: 30px; margin-bottom: 30px;">

    <div style="margin-bottom: 10px;">
      <span class="dbminputlabel">Color</span><br>
      <input type="color" id="color" class="round">
    </div>
    <div style="clear: both;"></div>
  </div>
        <div style="display: flex; gap: 10px; margin-bottom: 10px;">
          <div style="flex: 1;">
            <span class="dbminputlabel">Bold</span><br>
            <select id="bold" class="round">
              <option value="true">True</option>
              <option value="false" selected>False</option>
            </select>
          </div>
          <div style="flex: 1;">
            <span class="dbminputlabel">Italic</span><br>
            <select id="italic" class="round">
              <option value="true">True</option>
              <option value="false" selected>False</option>
            </select>
          </div>
        </div>
        <div style="display: flex; gap: 10px;">
          <div style="flex: 1;">
            <span class="dbminputlabel">Underline</span><br>
            <select id="underline" class="round">
              <option value="true">True</option>
              <option value="false" selected>False</option>
            </select>
          </div>
          <div style="flex: 1;">
            <span class="dbminputlabel">Strikethrough</span><br>
            <select id="strikethrough" class="round">
              <option value="true">True</option>
              <option value="false" selected>False</option>
            </select>
          </div>
        </div>
      </div>
    </div>`;
  },

  init() {},

  async action(cache) {
    this.callNextAction(cache);
  },

  mod() {},
};

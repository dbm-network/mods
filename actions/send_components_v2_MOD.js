module.exports = {
  name: 'Send Components V2',
  section: 'Messaging',
  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow & vxed_',
    authorUrl: 'https://github.com/shadoow051',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  size() {
    return { width: 640, height: 550 };
  },

  // ---------------------------------------------------------------------
  // region 📃 Subtitle Text
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    const components = data.components ?? [];
    const containerDetails = [];

    const selectedType = (components[0]?.componentType || components[0]?.containerComponentType || '').toLowerCase();

    const countComponents = (arr, isNested = false) => {
      let btn = 0;
      let sel = 0;
      let txt = 0;
      let sec = 0;
      let img = 0;
      let sep = 0;
      let file = 0;

      if (!Array.isArray(arr)) return { btn, sel, txt, sec, img, sep, file };

      for (const comp of arr) {
        const type = (comp.componentType || comp.containerComponentType || '').toLowerCase();

        const isSingleMode = !isNested && components.length === 1;
        const isAllowed = !isSingleMode || type === selectedType || type === 'container';

        if (!isAllowed) continue;

        if (type === 'container' && Array.isArray(comp.containerComponents)) {
          const nested = countComponents(comp.containerComponents, true);
          containerDetails.push(
            `Cont: ${[
              nested.txt ? `${nested.txt} Txt` : null,
              nested.sec ? `${nested.sec} Sec` : null,
              nested.img ? `${nested.img} Img` : null,
              nested.sep ? `${nested.sep} Sep` : null,
              nested.file ? `${nested.file} File` : null,
              nested.btn ? `${nested.btn} Btn` : null,
              nested.sel ? `${nested.sel} Sel` : null,
            ]
              .filter(Boolean)
              .join(' | ')}`,
          );
          continue;
        }

        // Content
        if (type === 'content') {
          const msg = comp.message ?? comp.containerMessage;
          if (typeof msg === 'string' && msg.trim()) txt += 1;
        }

        // Section
        if (type === 'section') {
          const msg = comp.message ?? comp.sectionMessage;
          if (typeof msg === 'string' && msg.trim()) sec += 1;
          if (Array.isArray(comp.buttons)) btn += comp.buttons.length;
          if (Array.isArray(comp.containerButtons)) btn += comp.containerButtons.length;
        }

        // Images
        if (type === 'images') {
          if (Array.isArray(comp.images)) img += comp.images.length;
          if (Array.isArray(comp.containerImages)) img += comp.containerImages.length;
        }

        // Files
        if (type === 'files') {
          if (Array.isArray(comp.files)) file += comp.files.length;
          if (Array.isArray(comp.containerFiles)) file += comp.containerFiles.length;
        }

        // Separators
        if (type === 'separators') {
          if (Array.isArray(comp.separators)) sep += comp.separators.length;
          if (Array.isArray(comp.containerSeparators)) sep += comp.containerSeparators.length;
        }

        // Buttons
        if (type === 'buttons') {
          if (Array.isArray(comp.buttons)) btn += comp.buttons.length;
          if (Array.isArray(comp.containerButtons)) btn += comp.containerButtons.length;
        }

        // Select Menus
        if (type === 'select menus') {
          if (Array.isArray(comp.selectMenus)) sel += comp.selectMenus.length;
          if (Array.isArray(comp.containerSelectMenus)) sel += comp.containerSelectMenus.length;
        }
      }

      return { btn, sel, txt, sec, img, sep, file };
    };

    const top = countComponents(components);

    const parts = [];
    if (top.txt) parts.push(`${top.txt} Txt`);
    if (top.sec) parts.push(`${top.sec} Sec`);
    if (top.img) parts.push(`${top.img} Img`);
    if (top.sep) parts.push(`${top.sep} Sep`);
    if (top.file) parts.push(`${top.file} File`);
    if (top.btn) parts.push(`${top.btn} Btn`);
    if (top.sel) parts.push(`${top.sel} Sel`);

    const allParts = [...parts, ...containerDetails];
    let defaultText = allParts.length > 0 ? allParts.join(' | ') : 'No components';

    if (data.editMessage && data.editMessage !== '0') {
      defaultText = `Editing: ${presets.getVariableText(data.editMessage, data.editMessageVarName)}`;
    }

    if (data.dontReply) {
      defaultText = `Store: ${defaultText}`;
    } else {
      defaultText = `${presets.getSendReplyTargetText(data.channel, data.varName)}: ${defaultText}`;
    }

    const userDesc = data.actionDescription?.toString().trim();
    if (userDesc) {
      const color = data.actionDescriptionColor || '#ffffff';
      return `<span style="color: ${color};">${userDesc}</span>`;
    }

    return defaultText;
  },

  // ---------------------------------------------------------------------
  // region 📦 Action Storage
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, data.dontSend ? 'Message Options' : 'Message'];
  },

  // ---------------------------------------------------------------------
  // region 🔢 Action Fields
  // ---------------------------------------------------------------------

  fields: [
    'channel',
    'varName',
    'varName2',
    'varNameContainer',
    'storage',
    'message',
    'buttons',
    'selectMenus',
    'attachments',
    'components',
    'reply',
    'dontReply',
    'ephemeral',
    'tts',
    'overwrite',
    'dontSend',
    'pinned',
    'actionDescription',
    'actionDescriptionColor',
    'editMessage',
    'editMessageVarName',
    'allowedMentionEveryone',
    'allowedMentionRole',
    'allowedMentionMember',
  ],

  // ---------------------------------------------------------------------
  // region #️⃣ Command HTML
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
  <div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow & vxed_<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->3.4.0</a></div>

<send-reply-target-input selectId="channel" variableInputId="varName"></send-reply-target-input>

<br><br>

<tab-system style="margin-top: 20px;">

  <tab label="Components" icon="book image">
    <div style="padding: 8px;">

  <dialog-list id="components" fields='["componentType", "customName", "message", "images", "files", "separators", "sectionMessage", "buttons", "selectMenus", "components", "containerComponents", "containerColor", "containerSpoiler", "useColor", "sectionComponents"]' saveButtonText="Save Component" dialogTitle="Component Info" dialogWidth="760" dialogHeight="560" listLabel="Components" listStyle="height: calc(100vh - 320px);" itemName="Component" itemCols="1" itemHeight="50px;" itemTextFunction="data.customName ? data.componentType + ' | ' + data.customName : data.componentType" itemStyle="text-align: left; line-height: 30px;">
      <div style="padding: 16px 16px 0px 16px;">

      <div style="width:100%; display:flex; flex-direction:row; justify-content:space-between; align-items:center;">
        <div style="float:left;">
          <span class="dbminputlabel">Component Type</span><br>
          <select id="componentType" class="round" style="width: 170px;">
            <option value="Content">Content</option>
            <option value="Section">Section</option>
            <option value="Container">Container</option>
            <option value="Images">Images</option>
            <option value="Files">Files</option>
            <option value="Separators">Separators</option>
            <option value="Buttons">Buttons</option>
            <option value="Select Menus">Select Menus</option>
          </select>
        </div>
        <div style="float:right; text-align:right;">
          <span class="dbminputlabel">Component Custom Name</span><br>
          <input id="customName" class="round" type="text" placeholder="Enter custom name..." style="width:180px;">
        </div>
      </div>

      <tab-system style="margin-top: 20px;">



      <tab label="Message" icon="comment">
      <div style="width: 100%; padding:8px;height: calc(100vh - 270px);overflow:auto">
          <textarea id="message" class="dbm_monospace" rows="10" placeholder="Insert message here..." style="height: calc(100vh - 309px); white-space: nowrap;"></textarea>
          </div>
      </tab>


      <tab label="Section" icon="file image" id="tab_section">
    <div style="padding: 8px;">

    <div style="width: 100%; padding:8px;height: calc(100vh - 290px);overflow:auto">
          <textarea id="sectionMessage" class="dbm_monospace" rows="10" placeholder="Insert message here..." style="height: calc(100vh - 309px); white-space: nowrap;"></textarea>
          </div>

      <dialog-list id="sectionComponents" fields='["accessoryType", "thumbnailUrl", "thumbnailSpoiler", "name", "type", "id", "row", "url", "emoji", "disabled", "mode", "time", "actions", "ButtonDisabled"]' saveButtonText="Save Accessory", dialogTitle="Accessory Info" dialogWidth="600" dialogHeight="800" listLabel="Accessory" listStyle="height: calc(100vh - 505px);" itemName="Image" itemCols="1" itemHeight="30px;" itemTextFunction="data.accessoryType" itemStyle="text-align: left; line-height: 30px;">
        <div style="padding: 16px;">
          
        <div style="padding-top: 8px;">
        <span class="dbminputlabel">Accessory Type</span><br>
        <select id="accessoryType" class="round">
        <option value="thumbnail">Thumbnail</option>
          <option value="button">Button</option>
        </select>
      </div>

      <tab-system style="margin-top: 20px;">

      <tab label="Thumbnail" icon="file image">

      <div style="padding: 16px;">
      <span class="dbminputlabel">Thumbnail Local/Web URL</span>
      <input id="thumbnailUrl" class="round" type="text">

      <br>

      <div style="text-align: center; padding-top: 4px;">
        <dbm-checkbox id="thumbnailSpoiler" label="Make Thumbnail Spoiler"></dbm-checkbox>
      </div>
    </div>

      </tab>


      <tab label="Button" icon="file image" id="tab_buttons">
      <div style="padding: 16px;">
          <div style="width: calc(50% - 12px); float: left;">
            <span class="dbminputlabel">Name</span>
            <input id="name" class="round" type="text" placeholder="Leave blank for none...">

            <br>

            <span class="dbminputlabel">Type</span><br>
            <select id="type" class="round">
              <option value="1" selected>Primary (Blurple)</option>
              <option value="2">Secondary (Grey)</option>
              <option value="3">Success (Green)</option>
              <option value="4">Danger (Red)</option>
              <option value="5">Link (Grey)</option>
            </select>

            <br>

            <span class="dbminputlabel">Link URL</span>
            <input id="url" placeholder="Leave blank for none..." class="round" type="text">

            <br>

            <span class="dbminputlabel">
              Action Response Mode
              <help-icon type="ACTION_RESPONSE_MODE"></help-icon>
            </span><br>
            <select id="mode" class="round">
              <option value="PERSONAL">Once, Command User Only</option>
              <option value="PUBLIC">Once, Anyone Can Use</option>
              <option value="MULTIPERSONAL">Multi, Command User Only</option>
              <option value="MULTI" selected>Multi, Anyone Can Use</option>
              <option value="PERSISTENT">Persistent</option>
            </select>
          </div>
          <div style="width: calc(50% - 12px); float: right;">
            <span class="dbminputlabel">Unique ID</span>
            <input id="id" placeholder="Leave blank to auto-generate..." class="round" type="text">

            <br>

            <span class="dbminputlabel">Action Row (1 - 5)</span>
            <input id="row" placeholder="Leave blank for default..." class="round" type="text">

            <br>

            <span class="dbminputlabel">Emoji</span>
            <input id="emoji" placeholder="Leave blank for none..." class="round" type="text">

            <br>

            <span class="dbminputlabel">Temporary Time-Limit (Miliseconds)</span>
            <input id="time" placeholder="60000" class="round" type="text">


            <div style="padding-top: 8px; margin-top: 10px;">
          <span class="dbminputlabel">Enable/Disable Button</span>
          <select id="ButtonDisabled" class="round">
            <option value="false">Enable</option>
            <option value="true">Disable</option>
          </select>
        </div>
           
          </div>

          <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

          <action-list-input mode="BUTTON" id="actions" height="calc(100vh - 600px)"></action-list-input>

        </div>
      </tab>

      <tab-system>
        </div>
      </dialog-list>
    </div>
  </tab>


      <tab label="Container" icon="comment" id="tab_container">

      <div style="display: flex; justify-content: space-between;">
      <div style="margin-bottom: 10px;">
      <span class="dbminputlabel">Color</span><br>
      <input type="color" id="containerColor" class="round" style="height: 30px;">
     </div>

        <dbm-checkbox id="useColor" label="Use Color"></dbm-checkbox>

        <dbm-checkbox id="containerSpoiler" label="Make Container Spoiler"></dbm-checkbox>
      </div>





<dialog-list id="containerComponents" fields='["sectionMessage","sectionComponents","containerComponentType","containerMessage","containerImages","containerFiles","containerSeparators","containerButtons","containerSelectMenus"]' saveButtonText="Save Component" dialogTitle="Component Info" dialogWidth="740" dialogHeight="560" listLabel="Components" listStyle="height: calc(100vh - 350px);" itemName="Component" itemCols="1" itemHeight="50px;" itemTextFunction="(function(d){var t=(d.containerComponentType||'').toLowerCase();var prev='';if(t==='content'&&d.containerMessage){prev=d.containerMessage.length>72?d.containerMessage.slice(0,72)+'...':d.containerMessage;}else if(t==='section'&&d.sectionMessage){prev=d.sectionMessage.length>72?d.sectionMessage.slice(0,72)+'...':d.sectionMessage;}else if(t==='images'&&Array.isArray(d.containerImages)&&d.containerImages.length>0){prev='Images: '+d.containerImages.length;}else if(t==='files'&&Array.isArray(d.containerFiles)&&d.containerFiles.length>0){prev='Files: '+d.containerFiles.length;}else if(t==='separators'&&Array.isArray(d.containerSeparators)&&d.containerSeparators.length>0){var s=d.containerSeparators[0];prev=(s&&s.containerSeparatorSize)?(s.containerSeparatorSize.charAt(0).toUpperCase()+s.containerSeparatorSize.slice(1)):'Separator';}else if(t==='buttons'&&Array.isArray(d.containerButtons)&&d.containerButtons.length>0){prev=d.containerButtons.map(b=>(b.containerName&&b.containerName.trim())||(b.name&&b.name.trim())||(b.label&&b.label.trim())||(b.buttonLabel&&b.buttonLabel.trim())||'Button').join(', ');}else if(t==='select menus'&&Array.isArray(d.containerSelectMenus)&&d.containerSelectMenus.length>0){prev='Selects: '+d.containerSelectMenus.length;}return t?(prev?d.containerComponentType+' | '+prev:d.containerComponentType):'';})(data)" itemStyle="text-align: left; line-height: 30px;">

      <div style="padding: 16px 16px 0px 16px;">

      <div style="padding-top: 8px;">
      <span class="dbminputlabel">Component Type</span><br>
      <select id="containerComponentType" class="round">
        <option value="Content">Content</option>
        <option value="Section">Section</option>
        <option value="Images">Images</option>
        <option value="Files">Files</option>
        <option value="Separators">Separators</option>
        <option value="Buttons">Buttons</option>
        <option value="Select Menus">Select Menus</option>
      </select>
    </div>

    <tab-system style="margin-top: 20px;">



    <tab label="Message" icon="comment" id="tab_message">
    <div style="width: 100%; padding:8px;height: calc(100vh - 270px);overflow:auto">
        <textarea id="containerMessage" class="dbm_monospace" rows="10" placeholder="Insert message here..." style="height: calc(100vh - 309px); white-space: nowrap;"></textarea>
        <div id="counter" style="float:right;text-align:right;position:relative;width:22%">characters: 0</div>
        </div>
    </tab>


    <tab label="Section" icon="file image" id="tab_section">
    <div style="padding: 8px;">

    <div style="width: 100%; padding:8px;height: calc(100vh - 290px);overflow:auto">
          <textarea id="sectionMessage" class="dbm_monospace" rows="10" placeholder="Insert message here..." style="height: calc(100vh - 309px); white-space: nowrap;"></textarea>
          </div>

      <dialog-list id="sectionComponents" fields='["accessoryType", "thumbnailUrl", "thumbnailSpoiler", "name", "type", "id", "row", "url", "emoji", "disabled", "mode", "time", "actions", "ButtonSectionDisabled"]' saveButtonText="Save Accessory", dialogTitle="Accessory Info" dialogWidth="600" dialogHeight="800" listLabel="Accessory" listStyle="height: calc(100vh - 505px);" itemName="Image" itemCols="1" itemHeight="30px;" itemTextFunction="data.accessoryType" itemStyle="text-align: left; line-height: 30px;">
        <div style="padding: 16px;">
          
        <div style="padding-top: 8px;">
        <span class="dbminputlabel">Accessory Type</span><br>
        <select id="accessoryType" class="round">
        <option value="thumbnail">Thumbnail</option>
          <option value="button">Button</option>
        </select>
      </div>

      <tab-system style="margin-top: 20px;">

      <tab label="Thumbnail" icon="file image">

      <div style="padding: 16px;">
      <span class="dbminputlabel">Thumbnail Local/Web URL</span>
      <input id="thumbnailUrl" class="round" type="text">

      <br>

      <div style="text-align: center; padding-top: 4px;">
        <dbm-checkbox id="thumbnailSpoiler" label="Make Thumbnail Spoiler"></dbm-checkbox>
      </div>
    </div>

      </tab>


      <tab label="Button" icon="file image" id="tab_buttons">
      <div style="padding: 16px;">
          <div style="width: calc(50% - 12px); float: left;">
            <span class="dbminputlabel">Name</span>
            <input id="name" class="round" type="text" placeholder="Leave blank for none...">

            <br>

            <span class="dbminputlabel">Type</span><br>
            <select id="type" class="round">
              <option value="1" selected>Primary (Blurple)</option>
              <option value="2">Secondary (Grey)</option>
              <option value="3">Success (Green)</option>
              <option value="4">Danger (Red)</option>
              <option value="5">Link (Grey)</option>
            </select>

            <br>

            <span class="dbminputlabel">Link URL</span>
            <input id="url" placeholder="Leave blank for none..." class="round" type="text">

            <br>

            <span class="dbminputlabel">
              Action Response Mode
              <help-icon type="ACTION_RESPONSE_MODE"></help-icon>
            </span><br>
            <select id="mode" class="round">
              <option value="PERSONAL">Once, Command User Only</option>
              <option value="PUBLIC">Once, Anyone Can Use</option>
              <option value="MULTIPERSONAL">Multi, Command User Only</option>
              <option value="MULTI" selected>Multi, Anyone Can Use</option>
              <option value="PERSISTENT">Persistent</option>
            </select>
          </div>
          <div style="width: calc(50% - 12px); float: right;">
            <span class="dbminputlabel">Unique ID</span>
            <input id="id" placeholder="Leave blank to auto-generate..." class="round" type="text">

            <br>

            <span class="dbminputlabel">Action Row (1 - 5)</span>
            <input id="row" placeholder="Leave blank for default..." class="round" type="text">

            <br>

            <span class="dbminputlabel">Emoji</span>
            <input id="emoji" placeholder="Leave blank for none..." class="round" type="text">

            <br>

            <span class="dbminputlabel">Temporary Time-Limit (Miliseconds)</span>
            <input id="time" placeholder="60000" class="round" type="text">


            <div style="padding-top: 8px; margin-top: 10px;">
          <span class="dbminputlabel">Enable/Disable Button</span>
          <select id="ButtonSectionDisabled" class="round">
            <option value="false">Enable</option>
            <option value="true">Disable</option>
          </select>
        </div>
           
          </div>

          <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

          <action-list-input mode="BUTTON" id="actions" height="calc(100vh - 600px)"></action-list-input>

        </div>
      </tab>

      <tab-system>
        </div>
      </dialog-list>
    </div>
  </tab>




    <tab label="Images" icon="file image" id="tab_images">
  <div style="padding: 8px;">

    <dialog-list id="containerImages" fields='["containerImageUrl", "containerImageName", "containerImageSpoiler"]' saveButtonText="Save Image", dialogTitle="Image Info" dialogWidth="400" dialogHeight="280" listLabel="Images" listStyle="height: calc(100vh - 350px);" itemName="Image" itemCols="1" itemHeight="30px;" itemTextFunction="data.containerImageUrl" itemStyle="text-align: left; line-height: 30px;">
      <div style="padding: 16px;">
        <span class="dbminputlabel">Image Local/Web URL</span>
        <input id="containerImageUrl" class="round" type="text">

        <br>

        <span class="dbminputlabel">Image Name</span>
        <input id="containerImageName" class="round" type="text" placeholder="Leave blank for default...">

        <br>

        <div style="text-align: center; padding-top: 4px;">
          <dbm-checkbox id="containerImageSpoiler" label="Make Image Spoiler"></dbm-checkbox>
        </div>
      </div>
    </dialog-list>
  </div>
</tab>

<tab label="Files" icon="file image" id="tab_files">
  <div style="padding: 8px;">

    <dialog-list id="containerFiles" fields='["containerFileUrl", "containerFileName", "containerFileSpoiler"]' saveButtonText="Save File", dialogTitle="File Info" dialogWidth="400" dialogHeight="280" listLabel="Files" listStyle="height: calc(100vh - 350px);" itemName="File" itemCols="1" itemHeight="30px;" itemTextFunction="data.containerFileUrl" itemStyle="text-align: left; line-height: 30px;">
      <div style="padding: 16px;">
        <span class="dbminputlabel">File Local/Web URL</span>
        <input id="containerFileUrl" class="round" type="text" value="resources/">

        <br>

        <span class="dbminputlabel">Attachment Name</span>
        <input id="containerFileName" class="round" type="text" placeholder="Leave blank for default...">

        <br>

        <div style="text-align: center; padding-top: 4px;">
          <dbm-checkbox id="containerFileSpoiler" label="Make Attachment Spoiler"></dbm-checkbox>
        </div>
      </div>
    </dialog-list>
  </div>
</tab>

<tab label="Separators" icon="file image" id="tab_separators">
  <div style="padding: 8px;">

    <dialog-list id="containerSeparators" fields='["containerSeparatorSize"]' saveButtonText="Save Separators", dialogTitle="Separator Info" dialogWidth="400" dialogHeight="280" listLabel="Separators" listStyle="height: calc(100vh - 350px);" itemName="Separator" itemCols="1" itemHeight="30px;" itemTextFunction="data.containerSeparatorSize" itemStyle="text-align: left; line-height: 30px;">
      <div style="padding: 16px;">
      <div style="padding-top: 8px;">
      <span class="dbminputlabel">size</span><br>
      <select id="containerSeparatorSize" class="round">
        <option value="Small">Small</option>
        <option value="Large">Large</option>
      </select>
    </div>
      </div>
    </dialog-list>
  </div>
</tab>

<tab label="Buttons" icon="clone" id="tab_buttons">
  <div style="padding: 8px;">

    <dialog-list id="containerButtons" fields='["containerName", "containerType", "containerId", "containerRow", "containerUrl", "containerEmoji", "containerDisabled", "containerMode", "containerTime", "containerActions", "containerButtonDisabled"]' saveButtonText="Save Button", dialogTitle="Button Info" dialogWidth="600" dialogHeight="700" listLabel="Buttons" listStyle="height: calc(100vh - 350px);" itemName="Button" itemCols="5" itemHeight="40px;" itemTextFunction="data.containerName" itemStyle="text-align: center; line-height: 40px;">
      <div style="padding: 16px;">
        <div style="width: calc(50% - 12px); float: left;">
          <span class="dbminputlabel">Name</span>
          <input id="containerName" class="round" type="text" placeholder="Leave blank for none...">

          <br>

          <span class="dbminputlabel">Type</span><br>
          <select id="containerType" class="round">
            <option value="1" selected>Primary (Blurple)</option>
            <option value="2">Secondary (Grey)</option>
            <option value="3">Success (Green)</option>
            <option value="4">Danger (Red)</option>
            <option value="5">Link (Grey)</option>
          </select>

          <br>

          <span class="dbminputlabel">Link URL</span>
          <input id="containerUrl" placeholder="Leave blank for none..." class="round" type="text">

          <br>

          <span class="dbminputlabel">
            Action Response Mode
            <help-icon type="ACTION_RESPONSE_MODE"></help-icon>
          </span><br>
          <select id="containerMode" class="round">
            <option value="PERSONAL">Once, Command User Only</option>
            <option value="PUBLIC">Once, Anyone Can Use</option>
            <option value="MULTIPERSONAL">Multi, Command User Only</option>
            <option value="MULTI" selected>Multi, Anyone Can Use</option>
            <option value="PERSISTENT">Persistent</option>
          </select>
        </div>
        <div style="width: calc(50% - 12px); float: right;">
          <span class="dbminputlabel">Unique ID</span>
          <input id="containerId" placeholder="Leave blank to auto-generate..." class="round" type="text">

          <br>

          <span class="dbminputlabel">Action Row (1 - 5)</span>
          <input id="containerRow" placeholder="Leave blank for default..." class="round" type="text">

          <br>

          <span class="dbminputlabel">Emoji</span>
          <input id="containerEmoji" placeholder="Leave blank for none..." class="round" type="text">

          <br>

          <span class="dbminputlabel">Temporary Time-Limit (Miliseconds)</span>
          <input id="containerTime" placeholder="60000" class="round" type="text">


          <div style="padding-top: 8px; margin-top: 10px;">
        <span class="dbminputlabel">Enable/Disable Button</span>
        <select id="containerButtonDisabled" class="round">
          <option value="false">Enable</option>
          <option value="true">Disable</option>
        </select>
      </div>
         
        </div>

        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

        <action-list-input mode="BUTTON" id="containerActions" height="calc(100vh - 460px)"></action-list-input>

      </div>
    </dialog-list>

  </div>
</tab>

<tab label="Selects" icon="list alternate" id="tab_selects">
<div style="padding: 8px;">

  <dialog-list id="containerSelectMenus" fields='["containerPlaceholder", "containerId", "containerTempVarName", "containerRow", "containerMin", "containerMax", "containerMode", "containerTime", "containerOptions", "containerActions", "containerSelectMenuType", "containerSelectMenuDisabled"]' saveButtonText="Save Select Menu", dialogTitle="Select Menu Info" dialogWidth="800" dialogHeight="700" listLabel="Select Menus" listStyle="height: calc(100vh - 350px);" itemName="Select Menu" itemCols="1" itemHeight="40px;" itemTextFunction="data.containerPlaceholder" itemStyle="text-align: left; line-height: 40px;">
    <div style="padding: 16px;">
      <div style="width: calc(33% - 16px); float: left; margin-right: 16px;">
        <span class="dbminputlabel">Placeholder</span>
        <input id="containerPlaceholder" class="round" type="text" placeholder="Leave blank for default...">

        <br>

        <span class="dbminputlabel">Temp Variable Name</span>
        <input id="containerTempVarName" placeholder="Stores selected value for actions..." class="round" type="text">

        <br>

        <span class="dbminputlabel">Minimum Select Number</span>
        <input id="containerMin" class="round" type="text" value="1">

        <br>

        <span class="dbminputlabel">
          Action Response Mode
          <help-icon type="ACTION_RESPONSE_MODE"></help-icon>
        </span><br>
        <select id="containerMode" class="round">
          <option value="PERSONAL">Once, Command User Only</option>
          <option value="PUBLIC">Once, Anyone Can Use</option>
          <option value="MULTIPERSONAL">Multi, Command User Only</option>
          <option value="MULTI" selected>Multi, Anyone Can Use</option>
          <option value="PERSISTENT">Persistent</option>
        </select>

        <div style="padding-top: 8px; margin-top: 10px;">
        <span class="dbminputlabel">Select Menu Type</span>
        <select id="containerSelectMenuType" class="round">
        <optgroup label="Default Select Menu">
          <option value="StringSelectMenu">String Select Menu</option>
          <option value="UserSelectMenu">User Select Menu</option>
          <option value="RoleSelectMenu">Role Select Menu</option>
          <option value="MentionableSelectMenu">Mentionable Select Menu</option>
          <option value="ChannelSelectMenu">Channel Select Menu</option>
        </optgroup>
        <optgroup label="Specific Channel Select Menu">
        <option value="ChannelTextSelectMenu">Text Channel Select Menu</option>
        <option value="ChannelVoiceSelectMenu">Voice Channel Select Menu</option>
        <option value="CategorySelectMenu">Category Select Menu</option>
        <option value="ChannelStageSelectMenu">Stage Channel Select Menu</option>
        <option value="ChannelForumSelectMenu">Forum Channel Select Menu</option>
        </optgroup>
        <optgroup label="Other Channel Select Menu">
        <option value="ChannelTextAndVoiceSelectMenu">Text + Voice Select Menu</option>
        <option value="ChannelTextAndCategorySelectMenu">Text + Category Select Menu</option>
        <option value="ChannelTextAndStageSelectMenu">Text + Stage Select Menu</option>
        <option value="ChannelTextAndForumSelectMenu">Text + Forum Select Menu</option>
        <option value="ChannelVoiceAndCategorySelectMenu">Voice + Category Select Menu</option>
        <option value="ChannelVoiceAndStageSelectMenu">Voice + Stage Select Menu</option>
        <option value="ChannelVoiceAndForumSelectMenu">Voice + Forum Select Menu</option>
        <option value="ChannelCategoryAndStageSelectMenu">Category + Stage Select Menu</option>
        <option value="ChannelCategoryAndForumSelectMenu">Category + Forum Select Menu</option>
        <option value="ChannelStageAndForumSelectMenu">Stage + Forum Select Menu</option>
        </select>
      </div>
      </div>

      <div style="width: calc(33% - 16px); float: left; margin-right: 16px;">
        <span class="dbminputlabel">Unique ID</span>
        <input id="containerId" placeholder="Leave blank to auto-generate..." class="round" type="text">

        <br>

        <span class="dbminputlabel">Action Row (1 - 5)</span>
        <input id="containerRow" placeholder="Leave blank for default..." class="round" type="text">

        <br>

        <span class="dbminputlabel">Maximum Select Number</span>
        <input id="containerMax" class="round" type="text" value="1">

        <br>

        <span class="dbminputlabel">Temporary Time-Limit (Miliseconds)</span>
        <input id="containerTime" placeholder="60000" class="round" type="text">


        <div style="padding-top: 8px; margin-top: 10px;">
        <span class="dbminputlabel">Enable/Disable Select Menu</span>
        <select id="containerSelectMenuDisabled" class="round">
          <option value="false">Enable</option>
          <option value="true">Disable</option>
        </select>
      </div>
      

      </div>

      <div style="width: calc(34% - 8px); height: 300px; float: left; margin-left: 8px;">

        <dialog-list id="containerOptions" fields='["containerLabel", "containerDescription", "containerValue", "containerEmoji", "containerDefault"]' dialogTitle="Select Menu Option Info" dialogWidth="360" dialogHeight="440" listLabel="Options" listStyle="height: 210px;" itemName="Option" itemCols="1" itemHeight="20px;" itemTextFunction="data.containerLabel" itemStyle="text-align: left; line-height: 20px;">
          <div style="padding: 16px;">
            <span class="dbminputlabel">Name</span>
            <input id="containerLabel" class="round" type="text">

            <br>

            <span class="dbminputlabel">Description</span>
            <input id="containerDescription" class="round" type="text" placeholder="Leave blank for none...">

            <br>

            <span class="dbminputlabel">Value</span>
            <input id="containerValue" placeholder="The text passed to the temp variable..." class="round" type="text">

            <br>

            <span class="dbminputlabel">Emoji</span>
            <input id="containerEmoji" placeholder="Leave blank for none..." class="round" type="text">

            <br>

            <span class="dbminputlabel">Default Selected</span><br>
            <select id="containerDefault" class="round">
              <option value="true">Yes</option>
              <option value="false" selected>No</option>
            </select>
          </div>
        </dialog-list>

      </div>

      <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

      <action-list-input mode="SELECT" id="containerActions" height="calc(100vh - 430px)">
        <script class="setupTempVars">
          const elem = document.getElementById("containerTempVarName");
          if(elem?.value) {
            tempVars.push([elem.value, "Text"]);
          }
        </script>
      </action-list-input>

    </div>
  </dialog-list>

</div>
</tab>
    </tab-system>
      </div>
    </dialog-list>

      </tab>

      <tab label="Images" icon="file image" id="tab_images">
    <div style="padding: 8px;">

      <dialog-list id="images" fields='["imageUrl", "imageName", "imageSpoiler"]' saveButtonText="Save Image", dialogTitle="Image Info" dialogWidth="400" dialogHeight="280" listLabel="Images" listStyle="height: calc(100vh - 350px);" itemName="Image" itemCols="1" itemHeight="30px;" itemTextFunction="data.imageUrl" itemStyle="text-align: left; line-height: 30px;">
        <div style="padding: 16px;">
          <span class="dbminputlabel">Image Local/Web URL</span>
          <input id="imageUrl" class="round" type="text">

          <br>

          <span class="dbminputlabel">Image Name</span>
          <input id="imageName" class="round" type="text" placeholder="Leave blank for default...">

          <br>

          <div style="text-align: center; padding-top: 4px;">
            <dbm-checkbox id="imageSpoiler" label="Make Image Spoiler"></dbm-checkbox>
          </div>
        </div>
      </dialog-list>
    </div>
  </tab>

  <tab label="Files" icon="file image" id="tab_files">
    <div style="padding: 8px;">

      <dialog-list id="files" fields='["fileUrl", "fileName", "fileSpoiler"]' saveButtonText="Save File", dialogTitle="File Info" dialogWidth="400" dialogHeight="280" listLabel="Files" listStyle="height: calc(100vh - 350px);" itemName="File" itemCols="1" itemHeight="30px;" itemTextFunction="data.fileUrl" itemStyle="text-align: left; line-height: 30px;">
        <div style="padding: 16px;">
          <span class="dbminputlabel">File Local/Web URL</span>
          <input id="fileUrl" class="round" type="text" value="resources/">

          <br>

          <span class="dbminputlabel">Attachment Name</span>
          <input id="fileName" class="round" type="text" placeholder="Leave blank for default...">

          <br>

          <div style="text-align: center; padding-top: 4px;">
            <dbm-checkbox id="fileSpoiler" label="Make Attachment Spoiler"></dbm-checkbox>
          </div>
        </div>
      </dialog-list>
    </div>
  </tab>

  <tab label="Separators" icon="file image" id="tab_separators">
    <div style="padding: 8px;">

      <dialog-list id="separators" fields='["separatorSize"]' saveButtonText="Save Separators", dialogTitle="Separator Info" dialogWidth="400" dialogHeight="280" listLabel="Separators" listStyle="height: calc(100vh - 350px);" itemName="Separator" itemCols="1" itemHeight="30px;" itemTextFunction="data.separatorSize" itemStyle="text-align: left; line-height: 30px;">
        <div style="padding: 16px;">
        <div style="padding-top: 8px;">
        <span class="dbminputlabel">size</span><br>
        <select id="separatorSize" class="round">
          <option value="Small">Small</option>
          <option value="Large">Large</option>
        </select>
      </div>
        </div>
      </dialog-list>
    </div>
  </tab>

  <tab label="Buttons" icon="clone" id="tab_buttons">
    <div style="padding: 8px;">

      <dialog-list id="buttons" fields='["name", "type", "id", "row", "url", "emoji", "disabled", "mode", "time", "actions", "ButtonDisabled"]' saveButtonText="Save Button", dialogTitle="Button Info" dialogWidth="600" dialogHeight="700" listLabel="Buttons" listStyle="height: calc(100vh - 350px);" itemName="Button" itemCols="5" itemHeight="40px;" itemTextFunction="data.name" itemStyle="text-align: center; line-height: 40px;">
        <div style="padding: 16px;">
          <div style="width: calc(50% - 12px); float: left;">
            <span class="dbminputlabel">Name</span>
            <input id="name" class="round" type="text" placeholder="Leave blank for none...">

            <br>

            <span class="dbminputlabel">Type</span><br>
            <select id="type" class="round">
              <option value="1" selected>Primary (Blurple)</option>
              <option value="2">Secondary (Grey)</option>
              <option value="3">Success (Green)</option>
              <option value="4">Danger (Red)</option>
              <option value="5">Link (Grey)</option>
            </select>

            <br>

            <span class="dbminputlabel">Link URL</span>
            <input id="url" placeholder="Leave blank for none..." class="round" type="text">

            <br>

            <span class="dbminputlabel">
              Action Response Mode
              <help-icon type="ACTION_RESPONSE_MODE"></help-icon>
            </span><br>
            <select id="mode" class="round">
              <option value="PERSONAL">Once, Command User Only</option>
              <option value="PUBLIC">Once, Anyone Can Use</option>
              <option value="MULTIPERSONAL">Multi, Command User Only</option>
              <option value="MULTI" selected>Multi, Anyone Can Use</option>
              <option value="PERSISTENT">Persistent</option>
            </select>
          </div>
          <div style="width: calc(50% - 12px); float: right;">
            <span class="dbminputlabel">Unique ID</span>
            <input id="id" placeholder="Leave blank to auto-generate..." class="round" type="text">

            <br>

            <span class="dbminputlabel">Action Row (1 - 5)</span>
            <input id="row" placeholder="Leave blank for default..." class="round" type="text">

            <br>

            <span class="dbminputlabel">Emoji</span>
            <input id="emoji" placeholder="Leave blank for none..." class="round" type="text">

            <br>

            <span class="dbminputlabel">Temporary Time-Limit (Miliseconds)</span>
            <input id="time" placeholder="60000" class="round" type="text">


            <div style="padding-top: 8px; margin-top: 10px;">
          <span class="dbminputlabel">Enable/Disable Button</span>
          <select id="ButtonDisabled" class="round">
            <option value="false">Enable</option>
            <option value="true">Disable</option>
          </select>
        </div>
           
          </div>

          <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

          <action-list-input mode="BUTTON" id="actions" height="calc(100vh - 460px)"></action-list-input>

        </div>
      </dialog-list>

    </div>
  </tab>

  <tab label="Selects" icon="list alternate" id="tab_selects">
  <div style="padding: 8px;">

    <dialog-list id="selectMenus" fields='["placeholder", "id", "tempVarName", "row", "min", "max", "mode", "time", "options", "actions", "SelectMenuType", "SelectMenuDisabled"]' saveButtonText="Save Select Menu", dialogTitle="Select Menu Info" dialogWidth="800" dialogHeight="700" listLabel="Select Menus" listStyle="height: calc(100vh - 350px);" itemName="Select Menu" itemCols="1" itemHeight="40px;" itemTextFunction="data.placeholder" itemStyle="text-align: left; line-height: 40px;">
      <div style="padding: 16px;">
        <div style="width: calc(33% - 16px); float: left; margin-right: 16px;">
          <span class="dbminputlabel">Placeholder</span>
          <input id="placeholder" class="round" type="text" placeholder="Leave blank for default...">

          <br>

          <span class="dbminputlabel">Temp Variable Name</span>
          <input id="tempVarName" placeholder="Stores selected value for actions..." class="round" type="text">

          <br>

          <span class="dbminputlabel">Minimum Select Number</span>
          <input id="min" class="round" type="text" value="1">

          <br>

          <span class="dbminputlabel">
            Action Response Mode
            <help-icon type="ACTION_RESPONSE_MODE"></help-icon>
          </span><br>
          <select id="mode" class="round">
            <option value="PERSONAL">Once, Command User Only</option>
            <option value="PUBLIC">Once, Anyone Can Use</option>
            <option value="MULTIPERSONAL">Multi, Command User Only</option>
            <option value="MULTI" selected>Multi, Anyone Can Use</option>
            <option value="PERSISTENT">Persistent</option>
          </select>

          <div style="padding-top: 8px; margin-top: 10px;">
          <span class="dbminputlabel">Select Menu Type</span>
          <select id="SelectMenuType" class="round">
          <optgroup label="Default Select Menu">
            <option value="StringSelectMenu">String Select Menu</option>
            <option value="UserSelectMenu">User Select Menu</option>
            <option value="RoleSelectMenu">Role Select Menu</option>
            <option value="MentionableSelectMenu">Mentionable Select Menu</option>
            <option value="ChannelSelectMenu">Channel Select Menu</option>
          </optgroup>
          <optgroup label="Specific Channel Select Menu">
          <option value="ChannelTextSelectMenu">Text Channel Select Menu</option>
          <option value="ChannelVoiceSelectMenu">Voice Channel Select Menu</option>
          <option value="CategorySelectMenu">Category Select Menu</option>
          <option value="ChannelStageSelectMenu">Stage Channel Select Menu</option>
          <option value="ChannelForumSelectMenu">Forum Channel Select Menu</option>
          </optgroup>
          <optgroup label="Other Channel Select Menu">
          <option value="ChannelTextAndVoiceSelectMenu">Text + Voice Select Menu</option>
          <option value="ChannelTextAndCategorySelectMenu">Text + Category Select Menu</option>
          <option value="ChannelTextAndStageSelectMenu">Text + Stage Select Menu</option>
          <option value="ChannelTextAndForumSelectMenu">Text + Forum Select Menu</option>
          <option value="ChannelVoiceAndCategorySelectMenu">Voice + Category Select Menu</option>
          <option value="ChannelVoiceAndStageSelectMenu">Voice + Stage Select Menu</option>
          <option value="ChannelVoiceAndForumSelectMenu">Voice + Forum Select Menu</option>
          <option value="ChannelCategoryAndStageSelectMenu">Category + Stage Select Menu</option>
          <option value="ChannelCategoryAndForumSelectMenu">Category + Forum Select Menu</option>
          <option value="ChannelStageAndForumSelectMenu">Stage + Forum Select Menu</option>
          </select>
        </div>
        </div>

        <div style="width: calc(33% - 16px); float: left; margin-right: 16px;">
          <span class="dbminputlabel">Unique ID</span>
          <input id="id" placeholder="Leave blank to auto-generate..." class="round" type="text">

          <br>

          <span class="dbminputlabel">Action Row (1 - 5)</span>
          <input id="row" placeholder="Leave blank for default..." class="round" type="text">

          <br>

          <span class="dbminputlabel">Maximum Select Number</span>
          <input id="max" class="round" type="text" value="1">

          <br>

          <span class="dbminputlabel">Temporary Time-Limit (Miliseconds)</span>
          <input id="time" placeholder="60000" class="round" type="text">


          <div style="padding-top: 8px; margin-top: 10px;">
          <span class="dbminputlabel">Enable/Disable Select Menu</span>
          <select id="SelectMenuDisabled" class="round">
            <option value="false">Enable</option>
            <option value="true">Disable</option>
          </select>
        </div>
        

        </div>

        <div style="width: calc(34% - 8px); height: 300px; float: left; margin-left: 8px;">

          <dialog-list id="options" fields='["label", "description", "value", "emoji", "default"]' dialogTitle="Select Menu Option Info" dialogWidth="360" dialogHeight="440" listLabel="Options" listStyle="height: 210px;" itemName="Option" itemCols="1" itemHeight="20px;" itemTextFunction="data.label" itemStyle="text-align: left; line-height: 20px;">
            <div style="padding: 16px;">
              <span class="dbminputlabel">Name</span>
              <input id="label" class="round" type="text">

              <br>

              <span class="dbminputlabel">Description</span>
              <input id="description" class="round" type="text" placeholder="Leave blank for none...">

              <br>

              <span class="dbminputlabel">Value</span>
              <input id="value" placeholder="The text passed to the temp variable..." class="round" type="text">

              <br>

              <span class="dbminputlabel">Emoji</span>
              <input id="emoji" placeholder="Leave blank for none..." class="round" type="text">

              <br>

              <span class="dbminputlabel">Default Selected</span><br>
              <select id="default" class="round">
                <option value="true">Yes</option>
                <option value="false" selected>No</option>
              </select>
            </div>
          </dialog-list>

        </div>

        <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

        <action-list-input mode="SELECT" id="actions" height="calc(100vh - 430px)">
          <script class="setupTempVars">
            const elem = document.getElementById("tempVarName");
            if(elem?.value) {
              tempVars.push([elem.value, "Text"]);
            }
          </script>
        </action-list-input>

      </div>
    </dialog-list>

  </div>
 </tab>
      </tab-system>
        </div>
      </dialog-list>

    </div>
  </tab>


  <tab label="Settings" icon="cogs">
  <div style="width: 100%; padding:8px;height: calc(100vh - 260px);overflow-y: scroll;overflow-x: hidden;">

      <div style="display: flex; justify-content: space-between;">
         <dbm-checkbox style="float: left;" id="reply" label="Reply to Interaction if Possible" checked></dbm-checkbox>

         <dbm-checkbox id="pinned" label="Pin Msg."></dbm-checkbox>

         <dbm-checkbox style="float: middle;" id="ephemeral" label="Make Reply Private (ephemeral)"></dbm-checkbox>
      </div>

      <br>

      <div style="display: flex; justify-content: space-between;">
        <dbm-checkbox id="tts" label="Text to Speech"></dbm-checkbox>

        <dbm-checkbox id="overwrite" label="Overwrite Changes"></dbm-checkbox>

        <dbm-checkbox id="dontSend" label="Don't Send Message"></dbm-checkbox>
      </div>

      <br>

      <div style="display: flex; justify-content: space-between;">
        <dbm-checkbox id="allowedMentionEveryone" label="Allow Mention Everyone"></dbm-checkbox>

        <dbm-checkbox id="allowedMentionRole" label="Allow Mention Role"></dbm-checkbox>

        <dbm-checkbox id="allowedMentionMember" label="Allow Mention Member"></dbm-checkbox>
      </div>

      <br>
      <hr class="subtlebar" style="margin-top: 4px; margin-bottom: 4px; width: 100%;">
      

      <table style="width:100%;"><tr>
      <td><span class="dbminputlabel">Action Description</span><br><input type="text" class="round" id="actionDescription" placeholder="Leave blank for default..."></td>
      <td style="padding:0px 0px 0px 10px;width:55px"><div style="float:left;padding:0px 0px 0px 7px;margin-top:-5px"></div><br><input type="color" value="#ffffff" class="round" id="actionDescriptionColor"></td>
      </tr></table>

      <hr class="subtlebar" style="margin-top: 4px; margin-bottom: 4px; width: 100%;">
      <br>
      

      <div style="padding-bottom: 12px;">
        <retrieve-from-variable allowNone dropdownLabel="Message/Options to Edit" selectId="editMessage" variableInputId="editMessageVarName" variableContainerId="editMessageVarNameContainer">
          <option value="intUpdate">Interaction Update</option>
        </retrieve-from-variable>
      </div>

      <br><br><br>

      <div style="padding-bottom: 12px;">
        <store-in-variable allowNone selectId="storage" variableInputId="varName2" variableContainerId="varNameContainer2"></store-in-variable>
      </div>

      <br><br>

      <div></div>
    </div>
  </tab>


</tab-system>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {},

  // ---------------------------------------------------------------------
  // region 💾 Action Editor Save
  // ---------------------------------------------------------------------

  onSave(data, helpers) {
    const genId = () => `msg-button-${helpers.generateUUID().substring(0, 7)}`;
    const genSelectId = () => `msg-select-${helpers.generateUUID().substring(0, 7)}`;

    if (Array.isArray(data?.components)) {
      for (const [, comp] of data.components.entries()) {
        // Główne Buttons (w Containerze)
        if (Array.isArray(comp.buttons)) {
          for (const [, btn] of comp.buttons.entries()) {
            if (!btn.id || btn.id === '0') {
              btn.id = genId();
            }
          }
        }

        // Główne SelectMenus
        if (Array.isArray(comp.selectMenus)) {
          for (const [, sel] of comp.selectMenus.entries()) {
            if (!sel.id || sel.id === '0') {
              sel.id = genSelectId();
            }
          }
        }

        // Container Buttons
        if (Array.isArray(comp.containerButtons)) {
          for (const [, btn] of comp.containerButtons.entries()) {
            if (!btn.containerId || btn.containerId === '0') {
              btn.containerId = genId();
            }
          }
        }

        // Container Select Menus
        if (Array.isArray(comp.containerSelectMenus)) {
          for (const [, sel] of comp.containerSelectMenus.entries()) {
            if (!sel.containerId || sel.containerId === '0') {
              sel.containerId = genSelectId();
            }
          }
        }

        // Section Buttons (accessories)
        if (Array.isArray(comp.sectionComponents)) {
          for (const [, acc] of comp.sectionComponents.entries()) {
            if (acc.accessoryType === 'button' && (!acc.id || acc.id === '0')) {
              acc.id = genId();
            }
          }
        }

        // Container Components (zagnieżdżone)
        if (Array.isArray(comp.containerComponents)) {
          for (const [, child] of comp.containerComponents.entries()) {
            // Child Container Buttons
            if (Array.isArray(child.containerButtons)) {
              for (const [, btn] of child.containerButtons.entries()) {
                if (!btn.containerId || btn.containerId === '0') {
                  btn.containerId = genId();
                }
              }
            }

            // Child Container SelectMenus
            if (Array.isArray(child.containerSelectMenus)) {
              for (const [, sel] of child.containerSelectMenus.entries()) {
                if (!sel.containerId || sel.containerId === '0') {
                  sel.containerId = genSelectId();
                }
              }
            }

            // Child SectionComponents (buttons w sekcji)
            if (Array.isArray(child.sectionComponents)) {
              for (const [, acc] of child.sectionComponents.entries()) {
                if (acc.accessoryType === 'button' && (!acc.id || acc.id === '0')) {
                  acc.id = genId();
                }
              }
            }
          }
        }
      }
    }

    return data;
  },

  // ---------------------------------------------------------------------
  // region ✏️ Action Editor Paste
  // ---------------------------------------------------------------------

  onPaste(data, helpers) {
    const genId = () => `msg-button-${helpers.generateUUID().substring(0, 7)}`;
    const genSelectId = () => `msg-select-${helpers.generateUUID().substring(0, 7)}`;

    if (Array.isArray(data?.components)) {
      for (const comp of data.components) {
        // Główne Buttons (w Containerze)
        if (Array.isArray(comp.buttons)) {
          for (const btn of comp.buttons) {
            btn.id = genId();
          }
        }

        // Główne SelectMenus
        if (Array.isArray(comp.selectMenus)) {
          for (const sel of comp.selectMenus) {
            sel.id = genSelectId();
          }
        }

        // Container Buttons
        if (Array.isArray(comp.containerButtons)) {
          for (const btn of comp.containerButtons) {
            btn.containerId = genId();
          }
        }

        // Container Select Menus
        if (Array.isArray(comp.containerSelectMenus)) {
          for (const sel of comp.containerSelectMenus) {
            sel.containerId = genSelectId();
          }
        }

        // Section Buttons (accessories)
        if (Array.isArray(comp.sectionComponents)) {
          for (const acc of comp.sectionComponents) {
            if (acc.accessoryType === 'button') {
              acc.id = genId();
            }
          }
        }

        // Container Components (zagnieżdżone)
        if (Array.isArray(comp.containerComponents)) {
          for (const child of comp.containerComponents) {
            // Child Container Buttons
            if (Array.isArray(child.containerButtons)) {
              for (const btn of child.containerButtons) {
                btn.containerId = genId();
              }
            }

            // Child Container SelectMenus
            if (Array.isArray(child.containerSelectMenus)) {
              for (const sel of child.containerSelectMenus) {
                sel.containerId = genSelectId();
              }
            }

            // Child SectionComponents (buttons w sekcji)
            if (Array.isArray(child.sectionComponents)) {
              for (const acc of child.sectionComponents) {
                if (acc.accessoryType === 'button') {
                  acc.id = genId();
                }
              }
            }
          }
        }
      }
    }

    return data;
  },

  // ---------------------------------------------------------------------
  // region 🛠️ Action Functions
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const DBM = this.getDBM();
    const DiscordJS = DBM.DiscordJS;

    // Version detection for compatibility
    const version = DiscordJS.version || '0.0.0';
    const majorVersion = DBM.getDiscordJSMajorVersion
      ? DBM.getDiscordJSMajorVersion()
      : parseInt(version.split('.')[0], 10);
    const isV13 = DBM.isDiscordJSv13 ? DBM.isDiscordJSv13() : majorVersion === 13;
    const isV14 = DBM.isDiscordJSv14 ? DBM.isDiscordJSv14() : majorVersion === 14;

    // Message Components v2 are only available in v14.24.0+
    // For v13, we'll provide a helpful error message
    if (isV13) {
      console.error(
        `[Send Components V2] Message Components v2 are only available in Discord.js v14.24.0+. Current version: ${version}`,
      );
      this.callNextAction(cache);
      return;
    }

    // Check if v2 components are available (v14.24.0+)
    if (isV14 && !DiscordJS.TextDisplayBuilder) {
      console.error(
        `[Send Components V2] Message Components v2 require Discord.js v14.24.0+. Current version: ${version}`,
      );
      this.callNextAction(cache);
      return;
    }

    const {
      MessageFlags,
      ActionRowBuilder,
      TextDisplayBuilder,
      SeparatorBuilder,
      MediaGalleryBuilder,
      AttachmentBuilder,
      FileBuilder,
      SeparatorSpacingSize,
      ContainerBuilder,
      SectionBuilder,
      ButtonStyle,
      ThumbnailBuilder,
      ButtonBuilder,
      StringSelectMenuBuilder,
      UserSelectMenuBuilder,
      RoleSelectMenuBuilder,
      MentionableSelectMenuBuilder,
      ChannelSelectMenuBuilder,
    } = DiscordJS;
    let targetChannel = null;
    const channelType = data.channel;
    const varNameRaw = data.varName;
    const varName = this.evalMessage(varNameRaw, cache);

    const bot = this.getDBM().Bot.bot;

    try {
      switch (channelType) {
        case '100': {
          // User by name
          if (!cache.server || !varName) break;

          const members = await cache.server.members.fetch({
            query: varName,
            limit: 1,
          });
          const member = members.first();

          if (member?.user) {
            targetChannel = await member.user.createDM();
          } else {
            console.warn(`[SendComponents] ❌ Nie znaleziono użytkownika o nazwie: ${varName}`);
          }
          break;
        }

        case '101': {
          // User by ID
          if (!cache.server || !varName) break;

          try {
            const member = await cache.server.members.fetch(varName);
            if (member?.user) {
              targetChannel = await member.user.createDM();
            } else {
              console.warn(`[SendComponents] ❌ Nie znaleziono użytkownika o ID: ${varName}`);
            }
          } catch (err) {
            console.warn(`[SendComponents] ❌ Błąd fetch usera o ID: ${varName}`, err);
          }
          break;
        }

        case '102': {
          // Channel by name
          const found = bot.channels.cache.find((ch) => ch.name === varName);
          if (found) {
            targetChannel = found;
          } else {
            console.warn(`[SendComponents] ❌ Nie znaleziono kanału o nazwie: ${varName}`);
          }
          break;
        }

        case '103': {
          // Channel by ID (już masz, ale wrzucam dla spójności)
          try {
            targetChannel = await bot.channels.fetch(varName);
            if (targetChannel) {
            } else {
              console.warn(`[SendComponents] ❌ Kanał o ID ${varName} zwrócił null!`);
            }
          } catch (err) {
            console.warn(`[SendComponents] ❌ Błąd podczas fetch kanału ID: ${varName}`, err);
          }
          break;
        }

        default: {
          targetChannel = await this.getChannelFromData(channelType, varNameRaw, cache);
          if (targetChannel) {
          } else {
            console.warn(`[SendComponents] ⚠️ getChannelFromData zwrócił null (type=${channelType})`);
          }
        }
      }
    } catch (err) {
      console.warn(`[SendComponents] ❌ Błąd ogólny przy uzyskiwaniu targetChannel (type=${channelType}):`, err);
    }

    const awaitResponses = [];

    if (!targetChannel) {
      return this.callNextAction(cache);
    }
    const path = require('path');
    const fs = require('fs/promises');

    const allComponents = Array.isArray(data.components) ? data.components.flat() : [];

    allComponents.forEach((component, index) => {});

    // ////////////////////////////////
    // region ! CREATE COMP !
    // ////////////////////////////////

    const attachments = [];
    const finalComponents = [];

    for (const c of allComponents) {
      // ////////////////////////////////
      // region ## Content
      // ////////////////////////////////
      if (c.componentType === 'Content' && typeof c.message === 'string' && c.message.trim().length > 0) {
        const parsed = this.evalMessage(c.message, cache);

        if (typeof parsed === 'string' && parsed.trim().length > 0) {
          finalComponents.push(new TextDisplayBuilder().setContent(parsed));
        }

        continue;
      }
      // ////////////////////////////////
      // region ## Separators
      // ////////////////////////////////
      if (c.componentType === 'Separators' && Array.isArray(c.separators) && c.separators.length > 0) {
        for (const separator of c.separators) {
          const sizeName = separator.separatorSize;
          const sizeEnum = SeparatorSpacingSize[sizeName];
          if (sizeEnum === undefined) continue;

          finalComponents.push(new SeparatorBuilder().setSpacing(sizeEnum));
        }
        continue;
      }

      // ////////////////////////////////
      // region ## Media Gallery
      // ////////////////////////////////
      if (c.componentType === 'Images' && Array.isArray(c.images) && c.images.length > 0) {
        const mediaItems = c.images
          .map((img) => {
            const rawUrl = img.imageUrl;
            const evaluatedUrl = this.evalMessage(rawUrl, cache);

            // WALIDACJA końcowego URL-a
            if (
              typeof evaluatedUrl !== 'string' ||
              !evaluatedUrl.trim().length ||
              !(
                evaluatedUrl.startsWith('http://') ||
                evaluatedUrl.startsWith('https://') ||
                evaluatedUrl.startsWith('attachment://')
              )
            ) {
              return null; // pomijamy ten item
            }

            return {
              media: { url: evaluatedUrl },
              spoiler: img.imageSpoiler === true,
            };
          })
          .filter((item) => item !== null);

        if (mediaItems.length > 0) {
          finalComponents.push(new MediaGalleryBuilder().addItems(mediaItems));
        }
        continue;
      }

      // ////////////////////////////////
      // region ## Files
      // ////////////////////////////////
      if (c.componentType === 'Files' && Array.isArray(c.files) && c.files.length > 0) {
        for (const file of c.files) {
          const filePath = path.resolve(file.fileUrl);
          const fileName = path.basename(file.fileName);
          try {
            const fileContent = await fs.readFile(filePath);
            const attachment = new AttachmentBuilder(Buffer.from(fileContent), {
              name: fileName,
            });
            attachments.push(attachment);

            finalComponents.push(new FileBuilder().setURL(`attachment://${fileName}`).setSpoiler(file.fileSpoiler));
          } catch (err) {
            console.error(`Błąd odczytu pliku ${filePath}:`, err);
          }
        }
        continue;
      }

      // ////////////////////////////////
      // region ## Buttons
      // ////////////////////////////////
      if (Array.isArray(c.buttons) && c.buttons.length > 0) {
        const row = new ActionRowBuilder();

        for (const btn of c.buttons) {
          let button;
          const style = Number(btn.type) || 1;

          if (style === 5) {
            if (!btn.url || typeof btn.url !== 'string' || btn.url.trim() === '') {
              console.warn(`[SendComponents] Pominięto przycisk typu LINK bez poprawnego URL!`);
              continue;
            }

            const label = this.evalMessage(btn.name, cache);

            button = new ButtonBuilder().setStyle(5).setURL(btn.url);

            if (label) {
              button.setLabel(label);
            } else if (!btn.emoji) {
              button.setLabel('Button');
            }
          } else {
            let id = btn.id;
            if (!id || typeof id !== 'string' || id.trim().length < 1 || id === '0') {
              id = `msg-button-${Math.random().toString(36).substring(2, 9)}`;
              btn.id = id;
              console.warn(`[SendComponents] ⚠️ Brak ID — nadano nowy: ${id}`);
            }

            const label = this.evalMessage(btn.name, cache);

            button = new ButtonBuilder().setStyle(style).setCustomId(id);

            if (label) {
              button.setLabel(label);
            } else if (!btn.emoji) {
              button.setLabel('Button');
            }

            const disabled =
              typeof btn.ButtonDisabled === 'string' ? btn.ButtonDisabled === 'true' : Boolean(btn.ButtonDisabled);

            button.setDisabled(disabled);

            const actions = btn.actions || btn.actionList || btn.actionsList;

            console.log(`[SendComponents] BUTTON "${btn.name || 'Unnamed'}" ID: ${id} Disabled: ${disabled}`);

            if (Array.isArray(actions) && actions.length > 0) {
              button.actions = actions;

              const mode = btn.mode || 'MULTI';
              const time = parseInt(btn.time, 10) || 60000;
              const userId = cache.getUser()?.id;

              btn.actions = actions; // KLUCZOWE!

              if (mode !== 'PERSISTENT') {
                awaitResponses.push({
                  type: 'BUTTON',
                  time,
                  id,
                  user: mode.endsWith('PERSONAL') ? userId : null,
                  multi: mode.startsWith('MULTI'),
                  data: btn,
                });

                console.log(`[SendComponents] ⏳ Tymczasowy przycisk "${id}" zapisany do awaitResponses`);
              } else {
                const { Bot } = this.getDBM();
                if (typeof Bot?.$button === 'object' && !Bot.$button[id]) {
                  Bot.$button[id] = { actions };
                  console.log(`[SendComponents] ✅ Persistent button "${id}" zarejestrowany`);
                } else {
                  console.warn(`[SendComponents] ⚠️ "${id}" już zarejestrowane — pominięto`);
                }
              }
            } else {
              console.log(`[SendComponents] Brak akcji dla przycisku "${id}"`);
            }
          }

          if (btn.emoji) button.setEmoji(btn.emoji);
          row.addComponents(button);
        }

        finalComponents.push(row);
        continue;
      }

      // ////////////////////////////////
      // region ## Select menus
      // ////////////////////////////////
      if (c.componentType === 'Select Menus' && Array.isArray(c.selectMenus)) {
        for (const menu of c.selectMenus) {
          const BuilderMap = {
            StringSelectMenu: StringSelectMenuBuilder,
            UserSelectMenu: UserSelectMenuBuilder,
            RoleSelectMenu: RoleSelectMenuBuilder,
            MentionableSelectMenu: MentionableSelectMenuBuilder,
            ChannelSelectMenu: ChannelSelectMenuBuilder,
          };

          const Builder = BuilderMap[menu.SelectMenuType];
          if (!Builder) {
            console.warn(`[SendComponents] Nieznany SelectMenuType: ${menu.SelectMenuType}`);
            continue;
          }

          let id = menu.id;
          if (!id || typeof id !== 'string' || id.trim().length < 1 || id === '0') {
            id = `msg-select-${Math.random().toString(36).substring(2, 9)}`;
            menu.id = id;
            console.warn(`[SendComponents] ⚠️ Brak ID — nadano nowy: ${id}`);
          }

          const selectMenu = new Builder()
            .setCustomId(id)
            .setDisabled(menu.SelectMenuDisabled === 'true')
            .setPlaceholder(menu.placeholder)
            .setMinValues(Number(menu.min) || 1)
            .setMaxValues(Number(menu.max) || 1);

          if (Array.isArray(menu.options) && Builder === StringSelectMenuBuilder) {
            selectMenu.addOptions(
              menu.options.map((opt) => ({
                label: opt.label || 'ㅤ',
                value: opt.value || '',
                description: opt.description || undefined,
                emoji: opt.emoji || undefined,
              })),
            );
          }

          const actions = menu.actions || menu.actionList || menu.actionsList || menu.containerActions; // ← warto zostawić na wypadek fallbacku

          if (Array.isArray(actions) && actions.length > 0) {
            selectMenu.actions = actions;

            const id = menu.id;
            const mode = menu.mode || 'MULTI';
            const time = parseInt(menu.time, 10) || 60000;
            const userId = cache.getUser()?.id;

            menu.actions = actions; // ⬅️ TO DODAJ

            if (mode !== 'PERSISTENT') {
              awaitResponses.push({
                type: 'SELECT',
                time,
                id,
                user: mode.endsWith('PERSONAL') ? userId : null,
                multi: mode.startsWith('MULTI'),
                data: menu,
              });
            } else {
              const { Bot } = this.getDBM();
              if (typeof Bot?.$select === 'object' && !Bot.$select[id]) {
                Bot.$select[id] = menu;
                console.log(`[SendComponents 1] ✅ Zarejestrowano PERSISTENT menu ID: ${id}`, menu);
              }
            }
          } else {
            console.log(`[SendComponents] Brak akcji dla SelectMenu "${id}"`);
          }

          finalComponents.push(new ActionRowBuilder().addComponents(selectMenu));
        }
        continue;
      }

      // ////////////////////////////////
      // region ## Sections
      // ////////////////////////////////
      if (c.componentType === 'Section' && Array.isArray(c.sectionComponents)) {
        const content = c.sectionMessage?.trim() || '\u200B';

        for (const sec of c.sectionComponents) {
          // 1) text display
          const textComp = new TextDisplayBuilder().setContent(content);

          // 2) SectionBuilder
          const section = new SectionBuilder().addTextDisplayComponents(textComp);

          // ////////////////////////////////
          // region ^ Thumbnail accessory
          // ////////////////////////////////
          if (sec.accessoryType === 'thumbnail' && sec.thumbnailUrl) {
            section.setThumbnailAccessory(
              new ThumbnailBuilder({
                media: { url: sec.thumbnailUrl },
                spoiler: sec.thumbnailSpoiler === true,
              }),
            );
          }

          // ////////////////////////////////
          // region ^ Button accessory
          // ////////////////////////////////
          if (sec.accessoryType === 'button') {
            const style = sec.type === 'link' ? ButtonStyle.Link : Number(sec.type) || ButtonStyle.Primary;

            const label = this.evalMessage(sec.name || 'Button', cache);

            const btnBuilder = new ButtonBuilder().setStyle(style);

            if (label) {
              btnBuilder.setLabel(label);
            } else if (!sec.emoji) {
              btnBuilder.setLabel('Button');
            }

            if (style === ButtonStyle.Link) {
              if (!sec.url?.trim()) {
                console.warn(`[SendComponents] ❌ Pominięto LINK button "${sec.name}" — brak URL`);
                return;
              }
              const url = this.evalMessage(sec.url?.trim(), cache);
              btnBuilder.setURL(url);
            } else {
              let id = sec.id;
              if (!id || typeof id !== 'string' || id.trim().length < 1 || id === '0') {
                id = `msg-button-${Math.random().toString(36).substring(2, 9)}`;
                sec.id = id;
              }

              btnBuilder.setCustomId(id);

              const disabledRaw =
                sec.ButtonDisabled ?? sec.containerButtonDisabled ?? sec.ButtonSectionDisabled ?? false;

              const disabled = typeof disabledRaw === 'string' ? disabledRaw === 'true' : Boolean(disabledRaw);

              btnBuilder.setDisabled(disabled);

              const actions = sec.actions || sec.actionList || sec.actionsList || sec.containerActions;

              if (Array.isArray(actions) && actions.length > 0) {
                btnBuilder.actions = actions;

                const mode = sec.mode || 'MULTI';
                const time = parseInt(sec.time, 10) || 60000;
                const userId = cache.getUser()?.id;

                sec.actions = actions;

                if (mode !== 'PERSISTENT') {
                  awaitResponses.push({
                    type: 'BUTTON',
                    time,
                    id,
                    user: mode.endsWith('PERSONAL') ? userId : null,
                    multi: mode.startsWith('MULTI'),
                    data: sec,
                  });
                } else {
                  const { Bot } = this.getDBM();
                  if (typeof Bot?.$button === 'object' && !Bot.$button[id]) {
                    Bot.$button[id] = { actions };
                  }
                }
              }
            }

            if (sec.emoji) btnBuilder.setEmoji(sec.emoji);

            section.setButtonAccessory(btnBuilder);
          }
          console.log(`[SendComponents] 😀 Dodano emoji do buttona: ${sec.emoji}`);
          console.log(`[SendComponents] 🧱 Section JSON:`, JSON.stringify(section.toJSON(), null, 2));
          finalComponents.push(section);
        }
        continue;
      }

      // ////////////////////////////////
      // region ## Container
      // ////////////////////////////////
      if (c.componentType === 'Container' && Array.isArray(c.containerComponents) && c.containerComponents.length > 0) {
        const container = new ContainerBuilder()
          .setAccentColor(
            c.useColor && typeof c.containerColor === 'string'
              ? parseInt(c.containerColor.replace('#', ''), 16)
              : undefined,
          )
          .setSpoiler(c.containerSpoiler);

        for (const child of c.containerComponents) {
          // ////////////////////////////////
          // region ^ Content
          // ////////////////////////////////
          const parsed = this.evalMessage(child.containerMessage, cache);

          if (typeof parsed === 'string' && parsed.trim().length > 0) {
            container.addTextDisplayComponents(new TextDisplayBuilder().setContent(parsed));
          }

          // ////////////////////////////////
          // region ^ Separators
          // ////////////////////////////////
          if (child.containerComponentType === 'Separators' && Array.isArray(child.containerSeparators)) {
            for (const sep of child.containerSeparators) {
              const sizeEnum = SeparatorSpacingSize[sep.containerSeparatorSize];
              if (sizeEnum != null) {
                container.addSeparatorComponents(new SeparatorBuilder().setSpacing(sizeEnum));
              }
            }
          }

          // ////////////////////////////////
          // region ^ Images
          // ////////////////////////////////
          if (child.containerComponentType === 'Images' && Array.isArray(child.containerImages)) {
            const items = child.containerImages
              .map((i) => {
                const rawUrl = i.containerImageUrl;
                const evaluatedUrl = this.evalMessage(rawUrl, cache);

                // WALIDACJA końcowego URL-a
                if (
                  typeof evaluatedUrl !== 'string' ||
                  !evaluatedUrl.trim().length ||
                  !(
                    evaluatedUrl.startsWith('http://') ||
                    evaluatedUrl.startsWith('https://') ||
                    evaluatedUrl.startsWith('attachment://')
                  )
                ) {
                  return null; // pomijamy ten item
                }

                return {
                  media: { url: evaluatedUrl },
                  spoiler: i.containerImageSpoiler === true,
                };
              })
              .filter((item) => item !== null);

            if (items.length > 0) {
              container.addMediaGalleryComponents(new MediaGalleryBuilder().addItems(items));
            }
          }

          // ////////////////////////////////
          // region ^ Files
          // ////////////////////////////////
          if (child.containerComponentType === 'Files' && Array.isArray(child.containerFiles)) {
            for (const f of child.containerFiles) {
              const filePath = path.resolve(f.containerFileUrl);
              const fileName = f.containerFileName || path.basename(filePath);
              try {
                const buf = await fs.readFile(filePath);
                const attachment = new AttachmentBuilder(Buffer.from(buf), {
                  name: fileName,
                });
                attachments.push(attachment);
                container.addFileComponents(
                  new FileBuilder().setURL(`attachment://${fileName}`).setSpoiler(f.containerFileSpoiler === true),
                );
              } catch (err) {
                console.error(`Błąd odczytu pliku ${filePath}:`, err);
              }
            }
          }

          // ////////////////////////////////
          // region ^ Buttons
          // ////////////////////////////////
          if (child.containerComponentType === 'Buttons' && Array.isArray(child.containerButtons)) {
            const row = new ActionRowBuilder();

            for (const btn of child.containerButtons) {
              let button;
              const style = Number(btn.containerType) || ButtonStyle.Primary;

              if (style === ButtonStyle.Link) {
                if (!btn.containerUrl?.trim()) {
                  continue;
                }

                const rawLabel = this.evalMessage(btn.containerName, cache);
                const label = rawLabel?.trim();
                const hasLabel = Boolean(label);
                const hasEmoji = Boolean(btn.containerEmoji);

                const rawUrl = btn.containerUrl?.trim();
                const url = this.evalMessage(rawUrl, cache);

                if (!/^https?:\/\//i.test(url)) {
                  console.warn(
                    `[SendComponents] ❌ Pominięto LINK button "${btn.containerName}" — brak poprawnego URL:`,
                    url,
                  );
                  continue;
                }

                button = new ButtonBuilder().setStyle(ButtonStyle.Link).setURL(url);

                if (hasLabel) {
                  button.setLabel(label);
                } else if (!hasEmoji) {
                  button.setLabel('Button');
                }

                if (hasEmoji) {
                  button.setEmoji(btn.containerEmoji);
                }
              } else {
                let id = btn.containerId;
                if (!id || typeof id !== 'string' || id.trim().length < 1) {
                  id = `msg-button-${Math.random().toString(36).substring(2, 9)}`;
                  btn.containerId = id;
                }

                const rawLabel = this.evalMessage(btn.containerName, cache);
                const label = rawLabel?.trim();

                button = new ButtonBuilder().setStyle(style).setCustomId(id);

                const hasLabel = Boolean(label);
                const hasEmoji = Boolean(btn.containerEmoji);

                if (hasLabel) {
                  button.setLabel(label);
                } else if (!hasEmoji) {
                  // Brak labela i brak emoji — daj domyślny tekst
                  button.setLabel('Button');
                }

                if (hasEmoji) {
                  button.setEmoji(btn.containerEmoji);
                }

                const disabled =
                  typeof btn.containerButtonDisabled === 'string'
                    ? btn.containerButtonDisabled === 'true'
                    : Boolean(btn.containerButtonDisabled);

                button.setDisabled(disabled);

                const actions = btn.actions || btn.actionList || btn.actionsList || btn.containerActions;

                if (Array.isArray(actions) && actions.length > 0) {
                  button.actions = actions;

                  const id = btn.containerId;
                  const mode = btn.containerMode || 'MULTI';
                  const time = parseInt(btn.containerTime, 10) || 60000;
                  const userId = cache.getUser()?.id;

                  btn.actions = actions; // ⬅️ ważne!

                  if (mode !== 'PERSISTENT') {
                    awaitResponses.push({
                      type: 'BUTTON',
                      time,
                      id,
                      user: mode.endsWith('PERSONAL') ? userId : null,
                      multi: mode.startsWith('MULTI'),
                      data: btn,
                    });
                  } else {
                    const { Bot } = this.getDBM();
                    if (typeof Bot?.$button === 'object' && !Bot.$button[id]) {
                      Bot.$button[id] = {
                        actions,
                      };
                    }
                  }
                }
              }

              if (btn.containerEmoji) button.setEmoji(btn.containerEmoji);
              row.addComponents(button);
            }

            container.addActionRowComponents(row);
          }

          // ////////////////////////////////
          // region ^ Select Menus
          // ////////////////////////////////
          if (child.containerComponentType === 'Select Menus' && Array.isArray(child.containerSelectMenus)) {
            for (const menu of child.containerSelectMenus) {
              const BuilderMap = {
                StringSelectMenu: StringSelectMenuBuilder,
                UserSelectMenu: UserSelectMenuBuilder,
                RoleSelectMenu: RoleSelectMenuBuilder,
                MentionableSelectMenu: MentionableSelectMenuBuilder,
                ChannelSelectMenu: ChannelSelectMenuBuilder,
              };

              const Builder = BuilderMap[menu.containerSelectMenuType];
              if (!Builder) {
                console.warn(`[SendComponents] Nieznany typ SelectMenu: ${menu.containerSelectMenuType}`);
                continue;
              }

              let id = menu.containerId;
              if (!id || typeof id !== 'string' || id.trim().length < 1 || id === '0') {
                id = `msg-select-${Math.random().toString(36).substring(2, 9)}`;
                menu.containerId = id;
                console.warn(`[SendComponents] ⚠️ Brak ID — nadano nowy: ${id}`);
              }

              const selectMenu = new Builder()
                .setCustomId(id)
                .setDisabled(menu.containerSelectMenuDisabled === 'true')
                .setPlaceholder(menu.containerPlaceholder)
                .setMinValues(Number(menu.containerMin) || 1)
                .setMaxValues(Number(menu.containerMax) || 1);

              if (Array.isArray(menu.containerOptions) && Builder === StringSelectMenuBuilder) {
                selectMenu.addOptions(
                  menu.containerOptions.map((opt) => ({
                    label: opt.containerLabel || 'ㅤ',
                    value: opt.containerValue || '',
                    description: opt.containerDescription || undefined,
                    emoji: opt.containerEmoji || undefined,
                    default: opt.containerDefault === true,
                  })),
                );
              }

              const actions = menu.actions || menu.actionList || menu.actionsList || menu.containerActions; // ← warto zostawić na wypadek fallbacku

              if (Array.isArray(actions) && actions.length > 0) {
                selectMenu.actions = actions;

                const id = menu.containerId;
                const mode = menu.containerMode || 'MULTI';
                const time = parseInt(menu.time, 10) || 60000;
                const userId = cache.getUser()?.id;

                menu.actions = actions; // ⬅️ TO DODAJ
                menu.tempVarName = menu.containerTempVarName;

                if (mode !== 'PERSISTENT') {
                  awaitResponses.push({
                    type: 'SELECT',
                    time,
                    id,
                    user: mode.endsWith('PERSONAL') ? userId : null,
                    multi: mode.startsWith('MULTI'),
                    data: menu,
                  });
                } else {
                  const { Bot } = this.getDBM();
                  if (typeof Bot?.$select === 'object' && !Bot.$select[id]) {
                    Bot.$select[id] = menu;
                    console.log(`[SendComponents 1] ✅ Zarejestrowano PERSISTENT menu ID: ${id}`, menu);
                  }
                }
              } else {
                console.log(`[SendComponents] Brak akcji dla SelectMenu "${id}"`);
              }

              const row = new ActionRowBuilder().addComponents(selectMenu);
              container.addActionRowComponents(row);
            }
          }

          // ////////////////////////////////
          // region ^ Section
          // ////////////////////////////////
          if (
            child.containerComponentType === 'Section' &&
            Array.isArray(child.sectionComponents) &&
            child.sectionComponents.length > 0
          ) {
            const content = this.evalMessage(
              child.containerSectionMessage?.trim() || child.sectionMessage?.trim() || '\u200B',
              cache,
            );

            const textComp = new TextDisplayBuilder().setContent(content);
            const section = new SectionBuilder().addTextDisplayComponents(textComp);

            for (const sec of child.sectionComponents) {
              if (sec.accessoryType === 'thumbnail' && sec.thumbnailUrl) {
                const rawUrl = sec.thumbnailUrl.trim();
                const evalUrl = this.evalMessage(rawUrl, cache);

                if (!/^https?:\/\//i.test(evalUrl) && !evalUrl.startsWith('attachment://')) {
                  console.warn(`[SendComponentsV2] ❌ Pominięto thumbnail "${rawUrl}" — niepoprawny URL: ${evalUrl}`);
                  continue;
                }

                section.setThumbnailAccessory(
                  new ThumbnailBuilder({
                    media: { url: evalUrl },
                    spoiler: sec.thumbnailSpoiler === true,
                  }),
                );
              }

              if (sec.accessoryType === 'button') {
                const style = sec.type === 'link' ? ButtonStyle.Link : Number(sec.type) || ButtonStyle.Primary;

                const label = this.evalMessage(sec.name, cache);

                const btnBuilder = new ButtonBuilder()
                  .setStyle(style)
                  .setDisabled(sec.ButtonSectionDisabled === true || sec.ButtonSectionDisabled === 'true');

                if (label) {
                  btnBuilder.setLabel(label);
                } else if (!sec.emoji) {
                  btnBuilder.setLabel('Button');
                }

                if (style === ButtonStyle.Link) {
                  if (!sec.url?.trim()) {
                    console.warn(`[SendComponents] ❌ Pominięto LINK button "${sec.name}" — brak URL`);
                    return;
                  }
                  const url = this.evalMessage(sec.url?.trim(), cache);
                  btnBuilder.setURL(url);
                } else {
                  let id = sec.id;
                  if (!id || typeof id !== 'string' || id.trim().length < 1 || id === '0') {
                    id = `msg-button-${Math.random().toString(36).substring(2, 9)}`;
                    sec.id = id;
                  }

                  btnBuilder.setCustomId(id);

                  const actions = sec.actions || sec.actionList || sec.actionsList || sec.containerActions;

                  if (Array.isArray(actions) && actions.length > 0) {
                    btnBuilder.actions = actions;

                    const mode = sec.mode || 'MULTI';
                    const time = parseInt(sec.time, 10) || 60000;
                    const userId = cache.getUser()?.id;

                    sec.actions = actions;

                    if (mode !== 'PERSISTENT') {
                      awaitResponses.push({
                        type: 'BUTTON',
                        time,
                        id,
                        user: mode.endsWith('PERSONAL') ? userId : null,
                        multi: mode.startsWith('MULTI'),
                        data: sec,
                      });
                    } else {
                      const { Bot } = this.getDBM();
                      if (typeof Bot?.$button === 'object' && !Bot.$button[id]) {
                        Bot.$button[id] = { actions };
                      }
                    }
                  }
                }

                if (sec.emoji) btnBuilder.setEmoji(sec.emoji);

                section.setButtonAccessory(btnBuilder);
              }
            }
            container.components.push(section);
            continue;
          }
        }

        finalComponents.push(container);
        continue;
      }
    }

    // ////////////////////////////////
    // region % SENDING MESS
    // ////////////////////////////////

    const interaction = cache.interaction;
    const inputChannelId = this.evalMessage(data.varName, cache);
    const forceTypes = ['100', '101', '102', '103'];

    const forceTargetChannel =
      forceTypes.includes(data.channel) && (!interaction?.channel || interaction.channel.id !== inputChannelId);

    const allowedMentions = { parse: [] };

    function isChecked(value) {
      return value === true || value === 'true' || value === '1';
    }

    if (isChecked(data.allowedMentionEveryone)) {
      allowedMentions.parse.push('everyone');
    }

    if (isChecked(data.allowedMentionRole)) {
      allowedMentions.parse.push('roles');
    }

    if (isChecked(data.allowedMentionMember)) {
      allowedMentions.parse.push('users');
    }

    const messageData = {
      flags: MessageFlags.IsComponentsV2,
      components: finalComponents,
      files: attachments,
      tts: data.tts === 'true',
      allowedMentions,
    };

    if (String(data.ephemeral) === 'true') {
      messageData.flags |= MessageFlags.Ephemeral;
    }

    if (data.editMessage !== 'none') {
      let message;

      if (data.editMessage === 'intUpdate' && interaction?.isMessageComponent?.()) {
        message = interaction.message;
      } else {
        message = this.getVariable(parseInt(data.editMessage, 10), data.editMessageVarName, cache);
      }

      if (message?.edit) {
        try {
          await message.edit(messageData);
        } catch (err) {
          console.error('[SendComponentsV3] Failed to edit message:', err);
        }
        return this.callNextAction(cache);
      }
    }

    if (data.dontSend === 'true') {
      return this.callNextAction(cache);
    }

    try {
      let sentMessage = null;

      const shouldReply = data.reply === true || data.reply === 'true';

      if (!forceTargetChannel && interaction && shouldReply) {
        const isIntEdit = data.editMessage === 'intUpdate';
        try {
          if (isIntEdit) {
            sentMessage = await interaction.editReply(messageData);
          } else if (interaction.deferred || interaction.replied) {
            sentMessage = await interaction.followUp(messageData);
          } else {
            await interaction.reply(messageData);
            sentMessage = await interaction.fetchReply();
          }
        } catch (err) {
          console.error(`[SendComponentsV2] ❌ Błąd interakcji:`, err);
        }
      }

      // 👇 JEŚLI mamy targetChannel (np. po channel by ID) i jeszcze nie wysłano
      if (!sentMessage && targetChannel) {
        try {
          sentMessage = await targetChannel.send(messageData);
        } catch (err) {
          console.error(`[SendComponentsV2] ❌ Błąd przy .send():`, err);
        }
      }

      // ⛔ Fallback tylko jeśli interaction nie zadziałało
      if (!sentMessage && targetChannel) {
        sentMessage = await targetChannel.send(messageData);
      }

      if (data.pinned === 'true' && sentMessage) {
        try {
          await sentMessage.pin();
        } catch (err) {
          console.warn('[SendComponentsV3] Nie udało się przypiąć wiadomości:', err);
        }
      }

      // 🧠 Zapisz wiadomość do zmiennej (Store In)
      if (sentMessage && data.storage !== 'none') {
        this.storeValue(sentMessage, parseInt(data.storage, 10), data.varName2, cache);
      }
      for (let i = 0; i < awaitResponses.length; i++) {
        const response = awaitResponses[i];
        const originalInteraction = cache.interaction?.__originalInteraction ?? cache.interaction;
        const tempVariables = cache.temp || {};

        this.registerTemporaryInteraction(
          sentMessage.id,
          response.time,
          response.id,
          response.user,
          response.multi,
          (interaction) => {
            if (response.data) {
              interaction.__originalInteraction = originalInteraction;

              if (response.type === 'BUTTON') {
                this.preformActionsFromInteraction(interaction, response.data, cache.meta, tempVariables);
              } else {
                if (response.data?.tempVarName) {
                  tempVariables[response.data.tempVarName] =
                    interaction.values?.length === 1 ? interaction.values[0] : interaction.values;
                }

                this.preformActionsFromSelectInteraction(interaction, response.data, cache.meta, tempVariables);
              }
            }
          },
        );
      }
    } catch (err) {
      console.error('[SendComponentsV3] Błąd podczas wysyłania komponentów:', err);
    }

    this.callNextAction(cache);
  },

  // ////////////////////////////////
  // region ! Bot Mod Init !
  // ////////////////////////////////

  modInit(data) {
    if (!Array.isArray(data?.components)) return;

    const registerButton = (btn) => {
      if (!btn || typeof btn !== 'object') return;
      const id = btn.containerId || btn.id;
      const mode = btn.containerMode || btn.mode;
      const actions = btn.actions || btn.containerActions || btn.actionList || btn.actionsList;

      if (id && Array.isArray(actions)) {
        this.prepareActions?.(actions);
        if (mode === 'PERSISTENT') {
          this.registerButtonInteraction(id, { actions, mode });
        }
      }
    };

    const registerSelect = (sel) => {
      if (!sel || typeof sel !== 'object') return;
      const id = sel.containerId || sel.id;
      const mode = sel.containerMode || sel.mode;
      const actions = sel.actions || sel.containerActions || sel.actionList || sel.actionsList;

      if (id && Array.isArray(actions)) {
        this.prepareActions?.(actions);

        if (mode === 'PERSISTENT' && typeof this.registerSelectMenuInteraction === 'function') {
          this.registerSelectMenuInteraction(id, {
            ...sel,
            actions,
            mode,
            tempVarName: sel.containerTempVarName || sel.tempVarName,
          });
        }
      }
    };

    const walk = (node) => {
      if (!node || typeof node !== 'object') return;

      registerButton(node);
      registerSelect(node);

      const sub = (arr) => (Array.isArray(arr) ? arr : []);

      [...sub(node.buttons), ...sub(node.containerButtons), ...sub(node.sectionComponents)].forEach(registerButton);
      [...sub(node.selectMenus), ...sub(node.containerSelectMenus), ...sub(node.sectionSelectMenus)].forEach(
        registerSelect,
      );

      if (Array.isArray(node.containerComponents)) {
        node.containerComponents.forEach(walk);
      }
    };

    data.components.forEach(walk);
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  // ---------------------------------------------------------------------

  mod() {},
};

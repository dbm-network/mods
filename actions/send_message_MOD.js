module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  //
  // This is the name of the action displayed in the editor.
  // ---------------------------------------------------------------------

  name: 'Send Message',

  // ---------------------------------------------------------------------
  // Action Section
  //
  // This is the section the action will fall into.
  // ---------------------------------------------------------------------

  section: 'Messaging',

  // ---------------------------------------------------------------------
  // Action Subtitle
  //
  // This function generates the subtitle displayed next to the name.
  // ---------------------------------------------------------------------

  subtitle(data, presets) {
    let text = '';
    if (data.message) {
      text = `"${data.message.replace(/[\n\r]+/, ' ↲ ')}"`;
    } else if (data.embeds?.length > 0) {
      text = `${data.embeds.length} Embeds`;
    } else if (data.attachments?.length > 0) {
      text = `${data.attachments.length} Attachments`;
    } else if (data.buttons?.length > 0 || data.selectMenus?.length > 0) {
      text = `${data.buttons.length} Buttons and ${data.selectMenus.length} Select Menus`;
    } else if (data.editMessage && data.editMessage !== '0') {
      if (data.editMessage === 'intUpdate') {
        text = 'Message Options - Edit Interaction';
      } else {
        text = `Message Options - ${presets.getVariableText(data.editMessage, data.editMessageVarName)}`;
      }
    } else {
      text = `Nothing (might cause error)`;
    }
    if (data.dontSend) {
      return `Store Data: ${text}`;
    }
    if (data.descriptioncolor === undefined) {
      data.descriptioncolor = '#ffffff';
    }
    if (Number(data.storagewebhook) > 0) {
      return `Send via Webhook: ${data.varwebhook}`;
    }
    return data.description
      ? `<font color="${data.descriptioncolor}">${data.description}</font>`
      : `<font color="${data.descriptioncolor}">${presets.getSendReplyTargetText(
          data.channel,
          data.varName,
        )}: ${text}</font>`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  //
  // Stores the relevant variable info for the editor.
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    const type = parseInt(data.storage, 10);
    if (type !== varType) return;
    return [data.varName2, data.dontSend ? 'Message Options' : 'Message'];
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  //
  // Helps check for updates and provides info if a custom mod.
  // If this is a third-party mod, please set "author" and "authorUrl".
  //
  // It's highly recommended "preciseCheck" is set to false for third-party mods.
  // This will make it so the patch version (0.0.X) is not checked.
  // ---------------------------------------------------------------------

  meta: {
    version: '2.1.8',
    preciseCheck: true,
    author: 'Master3395',
    authorUrl: 'https://github.com/master3395/dbm-mods',
    downloadURL: 'https://github.com/master3395/dbm-mods',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  //
  // These are the fields for the action. These fields are customized
  // by creating elements with corresponding IDs in the HTML. These
  // are also the names of the fields stored in the action's JSON data.
  // ---------------------------------------------------------------------

  fields: [
    'channel',
    'varName',
    'message',
    'buttons',
    'selectMenus',
    'attachments',
    'embeds',
    'reply',
    'ephemeral',
    'tts',
    'overwrite',
    'dontSend',
    'editMessage',
    'editMessageVarName',
    'storage',
    'varName2',
    'iffalse',
    'iffalseVal',
    'descriptioncolor',
    'description',
    'storagewebhook',
    'varwebhook',
    'webhookname',
    'webhookavatar',
  ],

  // ---------------------------------------------------------------------
  // Command HTML
  //
  // This function returns a string containing the HTML used for
  // editing actions.
  //
  // The "isEvent" parameter will be true if this action is being used
  // for an event. Due to their nature, events lack certain information,
  // so edit the HTML to reflect this.
  // ---------------------------------------------------------------------

  html(isEvent, data) {
    return `
    <div style="position:absolute;bottom:0px;border: 1px solid #222;background:#000;color:#999;padding:3px;right:0px;z-index:999999">Version 1.3</div>
    <div style="position:absolute;bottom:0px;border: 1px solid #222;background:#000;color:#999;padding:3px;left:0px;z-index:999999">Master3395</div>

    <div style="width:100%" id="xin2"><send-reply-target-input dropdownLabel="Send to" selectId="channel" variableInputId="varName"></send-reply-target-input>
    <br><br><br>
</div><div id="xin3"><div style="float: left; width: 35%">
<span class="dbminputlabel">Send to</span><br>
<select class="round">
<option value="0" selected>Webhook</option>
</select>
</div>
<br><br><br>
</div>
<div style="width:100%">
<tab-system style="margin-top: 20px;">


  <tab label="Message" icon="align left">
    <div style="padding: 8px;">
      <textarea id="message" class="dbm_monospace" rows="10" placeholder="Insert message here..." style="height: calc(100vh - 309px); white-space: nowrap; resize: none;"></textarea>
    </div>
  </tab>


  <tab label="Embeds" icon="book image">
    <div style="padding: 8px;">

      <dialog-list id="embeds" fields='["title", "url", "color", "timestamp", "imageUrl", "thumbUrl", "description", "fields", "author", "authorUrl", "authorIcon", "footerText", "footerIconUrl"]' dialogTitle="Embed Info" dialogWidth="540" dialogHeight="460" listLabel="Embeds" listStyle="height: calc(100vh - 350px);" itemName="Embed" itemCols="1" itemHeight="30px;" itemTextFunction="data.title + ' - ' + data.description" itemStyle="text-align: left; line-height: 30px;">
        <div style="padding: 16px 16px 0px 16px;">

          <tab-system>

            <tab label="General" icon="certificate">
              <div style="padding: 8px">
                <div style="float: left; width: calc(50% - 12px);">
                  <span class="dbminputlabel">Title</span><br>
                  <input id="title" class="round" type="text">

                  <br>

                  <span class="dbminputlabel">Color</span><br>
                  <table style="width:100%"><tr><td><input id="color" name="actionxinxyla" class="round" type="text" placeholder="Leave blank for default..."><td>
                  <td style="width:40px;text-align:center;padding:4px"><a id="btr1" style="cursor:pointer" onclick="(function(){
                    document.getElementById('color').type = 'color'
                    document.getElementById('btr1').style.display = 'none';
                    document.getElementById('btr2').style.display = 'block';
                    })()"><button class="tiny compact ui icon button">Color</button></a><a id="btr2" style="cursor:pointer;display:none" onclick="(function(){
                      document.getElementById('color').type = 'text';
                      document.getElementById('btr1').style.display = 'block';
                      document.getElementById('btr2').style.display = 'none';
                      })()"><button class="tiny compact ui icon button">Message</button></a><td></tr></table>
                </div>
                
                

                <div style="float: right; width: calc(50% - 12px);">
                  <span class="dbminputlabel">URL</span><br>
                  <input id="url" class="round" type="text" placeholder="Leave blank for none...">

                  <br>

                  <span class="dbminputlabel">Use Timestamp</span><br>
                  <select id="timestamp" class="round">
                    <option value="true">Yes</option>
                    <option value="false" selected>No</option>
                  </select>
                </div>

                <br><br><br><br><br><br><br>

                <hr class="subtlebar">

                <br>

                <span class="dbminputlabel">Image URL</span><br>
                <input id="imageUrl" class="round" type="text" placeholder="Leave blank for none...">

                <br>

                <span class="dbminputlabel">Thumbnail URL</span><br>
                <input id="thumbUrl" class="round" type="text" placeholder="Leave blank for none...">
              </div>
            </tab>

            <tab label="Description" icon="file image">
              <div style="padding: 8px">
                <textarea id="description" class="dbm_monospace" rows="10" placeholder="Insert description here..." style="height: calc(100vh - 149px); white-space: nowrap; resize: none;"></textarea>
              </div>
            </tab>

            <tab label="Fields" icon="list">
              <div style="padding: 8px">
                <dialog-list id="fields" fields='["name", "value", "inline"]' dialogTitle="Field Info" dialogWidth="540" dialogHeight="300" listLabel="Fields" listStyle="height: calc(100vh - 190px);" itemName="Field" itemCols="1" itemHeight="30px;" itemTextFunction="data.name + '<br>' + data.value" itemStyle="text-align: left; line-height: 30px;">
                  <div style="padding: 16px;">
                    <div style="float: left; width: calc(50% - 12px);">
                      <span class="dbminputlabel">Field Name</span><br>
                      <input id="name" class="round" type="text">
                    </div>

                    <div style="float: right; width: calc(50% - 12px);">
                      <span class="dbminputlabel">Inline?</span><br>
                      <select id="inline" class="round">
                        <option value="true">Yes</option>
                        <option value="false" selected>No</option>
                      </select>
                    </div>

                    <br><br><br><br>

                    <span class="dbminputlabel">Field Value</span><br>
                    <textarea id="value" class="dbm_monospace" rows="10" placeholder="Insert field text here..." style="height: calc(100vh - 190px); white-space: nowrap; resize: none;"></textarea>

                  </div>
                </dialog-list>
              </div>
            </tab>

            <tab label="Author" icon="user circle">
              <div style="padding: 8px">
                <span class="dbminputlabel">Author Text</span><br>
                <input id="author" class="round" type="text" placeholder="Leave blank to disallow...">

                <br>

                <span class="dbminputlabel">Author URL</span><br>
                <input id="authorUrl" class="round" type="text" placeholder="Leave blank for none...">

                <br>

                <span class="dbminputlabel">Author Icon URL</span><br>
                <input id="authorIcon" class="round" type="text" placeholder="Leave blank for none...">
              </div>
            </tab>

            <tab label="Footer" icon="map outline">
              <div style="padding: 8px;">
                <span class="dbminputlabel">Footer Icon URL</span><br>
                <input id="footerIconUrl" class="round" type="text" placeholder="Leave blank for none...">

                <br>

                <span class="dbminputlabel">Footer Text</span><br>
                <textarea id="footerText" class="dbm_monospace" rows="10" placeholder="Leave blank to disallow..." style="height: calc(100vh - 234px); white-space: nowrap; resize: none;"></textarea>
              </div>
            </tab>

          </tab-system>

        </div>
      </dialog-list>

    </div>
  </tab>

  <tab label="Buttons" icon="clone">
  <div style="padding: 16px;text-align:center" id="xin4n">Webhook does not support Buttons</div>
    <div style="padding: 8px;" id="xin4">

      <dialog-list id="buttons" fields='["name", "type", "id", "row", "url", "emoji", "disabled", "mode", "time", "actions"]' dialogTitle="Button Info" dialogWidth="600" dialogHeight="700" listLabel="Buttons" listStyle="height: calc(100vh - 350px);" itemName="Button" itemCols="4" itemHeight="40px;" itemTextFunction="data.name" itemStyle="text-align: center; line-height: 40px;">
        <div style="padding: 16px;">
          <div style="width: calc(50% - 12px); float: left;">
            <span class="dbminputlabel">Name</span>
            <input id="name" class="round" type="text">

            <br>

            <span class="dbminputlabel">Type</span><br>
            <select id="type" class="round">
              <option value="PRIMARY" selected>Primary (Blurple)</option>
              <option value="SECONDARY">Secondary (Grey)</option>
              <option value="SUCCESS">Success (Green)</option>
              <option value="DANGER">Danger (Red)</option>
              <option value="LINK">Link (Grey)</option>
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
          </div>

          <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>

          <action-list-input mode="BUTTON" id="actions" height="calc(100vh - 460px)"></action-list-input>

        </div>
      </dialog-list>

    </div>
  </tab>


  <tab label="Menus" icon="list alternate">
  <div style="padding: 16px;text-align:center" id="xin5n">Webhook does not support Menus</div>
    <div style="padding: 8px;" id="xin5">

      <dialog-list id="selectMenus" fields='["placeholder", "id", "tempVarName", "row", "min", "max", "mode", "time", "options", "actions"]' dialogTitle="Select Menu Info" dialogWidth="800" dialogHeight="700" listLabel="Menus" listStyle="height: calc(100vh - 350px);" itemName="Select Menu" itemCols="1" itemHeight="40px;" itemTextFunction="data.placeholder + '<br>' + data.options" itemStyle="text-align: left; line-height: 40px;">
        <div style="padding: 16px;">
          <div style="width: calc(33% - 16px); float: left; margin-right: 16px;">
            <span class="dbminputlabel">Placeholder</span>
            <input id="placeholder" class="round" type="text">

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
          </div>
          <div style="width: calc(34% - 8px); height: 300px; float: left; margin-left: 8px;">

            <dialog-list id="options" fields='["label", "description", "value", "emoji", "default"]' dialogTitle="Select Menu Option Info" dialogWidth="360" dialogHeight="440" listLabel="Options" listStyle="height: 210px;" itemName="Option" itemCols="1" itemHeight="20px;" itemTextFunction="data.label" itemStyle="text-align: left; line-height: 20px;">
              <div style="padding: 16px;">
                <span class="dbminputlabel">Name</span>
                <input id="label" class="round" type="text">

                <br>

                <span class="dbminputlabel">Description</span>
                <input id="description" class="round" type="text">

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

          <action-list-input mode="SELECT" id="actions" height="calc(100vh - 460px)">
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


  <tab label="Files" icon="file image">
    <div style="padding: 8px;">

      <dialog-list id="attachments" fields='["type", "url", "canvasvar", "canvasname", "compress", "name", "spoiler"]' dialogTitle="Attachment Info" dialogWidth="400" dialogHeight="480" listLabel="Files" listStyle="height: calc(100vh - 350px);" itemName="File" itemCols="1" itemHeight="30px;" itemTextFunction="glob.formatItem(data)" itemStyle="text-align: left; line-height: 30px;">
        <div style="padding: 16px;" onmouseover="(function(){

          var aselect = document.getElementById('type');
            var avalue = aselect.options[aselect.selectedIndex].value
        
          if (avalue == 0) {
              document.getElementById('xinxyla1').style.display = 'none';
              document.getElementById('xinxyla2').style.display = 'block';
              document.getElementById('xinxyla3').style.display = 'block';
        }
        if (avalue == 1) {
          document.getElementById('xinxyla2').style.display = 'none';
          document.getElementById('xinxyla1').style.display = 'block';
          document.getElementById('xinxyla3').style.display = 'block';
    }   
    
    if (avalue == 2) {
      document.getElementById('xinxyla2').style.display = 'none';
      document.getElementById('xinxyla1').style.display = 'block';
      document.getElementById('xinxyla3').style.display = 'none';
    } 

        
        })()">

        <span class="dbminputlabel">Attachment Type</span>
        <select id="type" class="round" onchange="(function(){

          var aselect = document.getElementById('type');
            var avalue = aselect.options[aselect.selectedIndex].value
        
            if (avalue == 0) {
              document.getElementById('xinxyla1').style.display = 'none';
              document.getElementById('xinxyla2').style.display = 'block';
              document.getElementById('xinxyla3').style.display = 'block';
        }
        if (avalue == 1) {
          document.getElementById('xinxyla2').style.display = 'none';
          document.getElementById('xinxyla1').style.display = 'block';
          document.getElementById('xinxyla3').style.display = 'block';
    }   
    
    if (avalue == 2) {
      document.getElementById('xinxyla2').style.display = 'none';
      document.getElementById('xinxyla1').style.display = 'block';
      document.getElementById('xinxyla3').style.display = 'none';
    }      
        
        })()">
          <option value="0">Local/Web URL</option>
          <option value="1">Canvas</option>
          <option value="2">DBM Images</option>
        </select>
        <br><div id="xinxyla2">
          <span class="dbminputlabel">Attachment Local/Web URL</span>
          <input id="url" class="round" type="text" value="resources/">

          <br></div>
          <div id="xinxyla1">
          <span class="dbminputlabel">Variable Type</span><br>
    <select id="canvasvar" class="round">
      ${data.variables[1]}
    </select>
<br>
          <span class="dbminputlabel">Variable Name</span>
          <input id="canvasname" class="round" type="text" list="variableList">
<br>
<div id="xinxyla3">
          <span class="dbminputlabel">Compression Level</span><br>
          <select id="compress" class="round">
            <option value="0">1</option>
            <option value="1">2</option>
            <option value="2">3</option>
            <option value="3">4</option>
            <option value="4">5</option>
            <option value="5">6</option>
            <option value="6">7</option>
            <option value="7">8</option>
            <option value="8">9</option>
            <option value="9" selected>10</option>
          </select>
          <br></div></div>

          <span class="dbminputlabel">Attachment Name</span>
          <input id="name" class="round" type="text" placeholder="Leave blank for default...">

          <br>

          <div style="text-align: center; padding-top: 4px;">
            <dbm-checkbox id="spoiler" label="Make Attachment Spoiler"></dbm-checkbox>
          </div>
        </div>
      </dialog-list>
    </div>
  </tab>


  <tab label="Settings" icon="cogs">
    <style>
      #settingsTabOuter {
        box-sizing: border-box;
        width: 100%;
        overflow: hidden;
      }
      #settingsScroll {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        overflow-x: hidden !important;
        overflow-y: scroll !important;
        padding: 8px;
        padding-bottom: 72px;
      }
    </style>
    <div id="settingsTabOuter">
    <div id="settingsScroll">
      <div id="xincheck">
        <dbm-checkbox style="float: left;" id="reply" label="Reply to Interaction if Possible" checked></dbm-checkbox>

        <dbm-checkbox style="float: right;" id="ephemeral" label="Make Reply Private (Ephemeral)"></dbm-checkbox>

        <br><br>

        <div style="display: flex; justify-content: space-between;">
          <dbm-checkbox id="tts" label="Text-to-Speech"></dbm-checkbox>

          <dbm-checkbox id="overwrite" label="Overwrite Changes"></dbm-checkbox>

          <dbm-checkbox id="dontSend" label="Don't Send Message"></dbm-checkbox>
        </div>

        <br>

        <hr class="subtlebar" style="margin-top: 4px; margin-bottom: 4px;">
      </div>

      <br>

      <div style="padding-bottom: 12px;" id="xin1">
        <retrieve-from-variable allowNone dropdownLabel="Message/Options to Edit" selectId="editMessage" variableInputId="editMessageVarName" variableContainerId="editMessageVarNameContainer">
          <option value="intUpdate">Interaction Update</option>
        </retrieve-from-variable>
      </div>

      <br>

      <div style="float: left; width: 35%;">
        <span class="dbminputlabel">Send as Webhook</span><br>
        <select id="storagewebhook" class="round" onchange="glob.onComparisonChanged2(this)">
          <option value="0" selected>No</option>
          <option value="1">Temp Variable</option>
          <option value="2">Server Variable</option>
          <option value="3">Global Variable</option>
        </select>
      </div>
      <div id="webhookdiv" style="display: none; float: right; width: 60%;">
        <span class="dbminputlabel">Variable Name</span><br>
        <input list="variableList" id="varwebhook" class="round" name="actionxinxyla" type="text">
      </div>

      <br style="clear: both;"><br>

      <div id="webhookdiv2" style="display: none;">
        <span class="dbminputlabel">Webhook Name</span><br>
        <input id="webhookname" class="round" type="text" style="width:100%" placeholder="Optional">
        <br>
        <span class="dbminputlabel">Webhook avatar image URL</span><br>
        <input id="webhookavatar" class="round" type="text" style="width:100%" placeholder="Optional">
        <br>
        <hr class="subtlebar" style="margin-top: 4px; margin-bottom: 4px;">
        <br>
      </div>

      <div style="padding-bottom: 12px;">
        <store-in-variable allowNone dropdownLabel="Store in" selectId="storage" variableInputId="varName2" variableContainerId="varNameContainer2"></store-in-variable>
      </div>

      <br>

      <hr class="subtlebar" style="margin-top: 4px; margin-bottom: 4px;">

      <br>

      <div style="float: left; width: 35%;">
        <span class="dbminputlabel">If Message Delivery Fails</span><br>
        <select id="iffalse" class="round" onchange="glob.onComparisonChanged(this)">
          <option value="0">Continue Actions</option>
          <option value="1" selected>Stop Action Sequence</option>
          <option value="2">Jump to action</option>
          <option value="3">Skip Next Actions</option>
          <option value="4">Go to Action Anchor</option>
        </select>
      </div>
      <div id="iffalseContainer" style="display: none; float: right; width: 60%;">
        <span class="dbminputlabel">For</span><br>
        <input id="iffalseVal" class="round" name="actionxinxyla" type="text">
      </div>

      <br style="clear: both;"><br>

      <div style="padding-bottom: 12px;">
        <table style="width:100%;">
          <tr>
            <td>
              <span class="dbminputlabel">Action Description</span><br>
              <input type="text" class="round" id="description" placeholder="Leave empty to remove">
            </td>
            <td style="padding:0px 0px 0px 10px;width:55px">
              <span class="dbminputlabel">Color</span><br>
              <input type="color" value="#ffffff" class="round" id="descriptioncolor">
            </td>
          </tr>
        </table>
      </div>
    </div>
    </div>
  </tab>
</tab-system></div>`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  // ---------------------------------------------------------------------

  init() {
    const { glob, document } = this;

    glob.fitSettingsScroll = function () {
      const outer = document.getElementById('settingsTabOuter');
      if (!outer) return;

      const top = outer.getBoundingClientRect().top;
      let bottom = window.innerHeight - 96;

      document.querySelectorAll('.ui.modal, .ui.modal.active, .ui.modal.visible, dialog').forEach((modal) => {
        const rect = modal.getBoundingClientRect();
        if (rect.height > 180 && rect.width > 200 && rect.top <= top + 40 && rect.bottom > top + 80) {
          bottom = Math.min(bottom, rect.bottom - 56);
        }
      });

      let height = Math.floor(bottom - top);
      if (!Number.isFinite(height) || height < 200) height = 340;
      height = Math.max(200, Math.min(height, 560));

      outer.style.height = `${height}px`;
      outer.style.maxHeight = `${height}px`;
    };

    glob.fitSettingsScroll();
    setTimeout(glob.fitSettingsScroll, 0);
    setTimeout(glob.fitSettingsScroll, 100);
    setTimeout(glob.fitSettingsScroll, 350);
    window.addEventListener('resize', glob.fitSettingsScroll);

    const tabSystem = document.querySelector('tab-system');
    if (tabSystem) {
      tabSystem.addEventListener('click', () => setTimeout(glob.fitSettingsScroll, 30));
      if (typeof ResizeObserver !== 'undefined') {
        const observer = new ResizeObserver(() => glob.fitSettingsScroll());
        observer.observe(tabSystem);
        const outer = document.getElementById('settingsTabOuter');
        if (outer?.parentElement) observer.observe(outer.parentElement);
      }
    }

    glob.onComparisonChanged = function (event) {
      if (event.value > '1') {
        document.getElementById('iffalseContainer').style.display = null;
      } else {
        document.getElementById('iffalseContainer').style.display = 'none';
      }
    };

    glob.onComparisonChanged(document.getElementById('iffalse'));

    glob.onComparisonChanged2 = function (event) {
      if (event.value > '0') {
        document.getElementById('webhookdiv').style.display = null;
        document.getElementById('webhookdiv2').style.display = null;
        document.getElementById('xincheck').style.display = 'none';
        document.getElementById('xin1').style.display = 'none';
        document.getElementById('xin2').style.display = 'none';
        document.getElementById('xin3').style.display = 'block';
        document.getElementById('xin4').style.display = 'none';
        document.getElementById('xin5').style.display = 'none';
        document.getElementById('xin4n').style.display = null;
        document.getElementById('xin5n').style.display = null;
        const myInput = document.querySelector('#reply');
        myInput.value = false;
        const myInput2 = document.querySelector('#dontSend');
        myInput2.value = false;
        const myInput3 = document.querySelector('#ephemeral');
        myInput3.value = false;
        const myInput4 = document.querySelector('#tts');
        myInput4.value = false;
        const myInput5 = document.querySelector('#overwrite');
        myInput5.value = false;
        const myInput6 = document.querySelector('#editMessage');
        myInput6.value = 0;
        const myInput7 = document.querySelector('#channel');
        myInput7.value = 0;
      } else {
        document.getElementById('webhookdiv').style.display = 'none';
        document.getElementById('webhookdiv2').style.display = 'none';
        document.getElementById('xincheck').style.display = null;
        document.getElementById('xin1').style.display = null;
        document.getElementById('xin2').style.display = 'block';
        document.getElementById('xin3').style.display = 'none';
        document.getElementById('xin4').style.display = null;
        document.getElementById('xin5').style.display = null;
        document.getElementById('xin4n').style.display = 'none';
        document.getElementById('xin5n').style.display = 'none';
      }
    };

    glob.onComparisonChanged2(document.getElementById('storagewebhook'));
    setTimeout(glob.fitSettingsScroll, 50);

    glob.formatItem = function (data) {
      let result = '<div style="display: inline-block; width: 200px; padding-left: 8px;">';
      const comp = data.type;
      switch (comp) {
        case '0':
          result += `Attachment: ${data.url}`;
          break;
        case '1':
          result += `Canvas: ${data.canvasname}`;
          break;
        case '2':
          result += `DBM Images: ${data.canvasname}`;
          break;
      }
      result += '</div>';
      return result;
    };
  },
  // ---------------------------------------------------------------------
  // Action Editor On Save
  //
  // When the data for the action is saved, this function is called.
  // It provides the ability to modify the final data associated with
  // the action by retrieving it as an argument and returning a modified
  // version through the return value. This can be used to verify the
  // data and fill required entries the user did not.
  //
  // Its inclusion within action mods is optional.
  // ---------------------------------------------------------------------

  onSave(data, helpers) {
    // generate unique ids if not provided by user since they are important
    if (Array.isArray(data?.buttons)) {
      for (let i = 0; i < data.buttons.length; i++) {
        if (!data.buttons[i].id) {
          data.buttons[i].id = `msg-button-${helpers.generateUUID().substring(0, 7)}`;
        }
      }
    }
    if (Array.isArray(data?.selectMenus)) {
      for (let i = 0; i < data.selectMenus.length; i++) {
        if (!data.selectMenus[i].id) {
          data.selectMenus[i].id = `msg-select-${helpers.generateUUID().substring(0, 7)}`;
        }
      }
    }
    return data;
  },

  // ---------------------------------------------------------------------
  // Action Editor On Paste
  //
  // When the data for the action is pasted, this function is called.
  // It provides the ability to modify the final data associated with
  // the action by retrieving it as an argument and returning a modified
  // version through the return value.
  //
  // Its inclusion within action mods is optional.
  // ---------------------------------------------------------------------

  onPaste(data, helpers) {
    if (Array.isArray(data?.buttons)) {
      for (let i = 0; i < data.buttons.length; i++) {
        const id = data.buttons[i].id;
        if (!id || id.startsWith('msg-button-')) {
          data.buttons[i].id = `msg-button-${helpers.generateUUID().substring(0, 7)}`;
        }
      }
    }
    if (Array.isArray(data?.selectMenus)) {
      for (let i = 0; i < data.selectMenus.length; i++) {
        const id = data.selectMenus[i].id;
        if (!id || id.startsWith('msg-select-')) {
          data.selectMenus[i].id = `msg-select-${helpers.generateUUID().substring(0, 7)}`;
        }
      }
    }
    return data;
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  //
  // This is the function for the action within the Bot's Action class.
  // Keep in mind event calls won't have access to the "msg" parameter,
  // so be sure to provide checks for variable existence.
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];

    const channel = parseInt(data.channel, 10);
    const message = data.message;
    const storagewebhook = parseInt(String(data.storagewebhook), 10) || 0;
    const webhookname = this.evalMessage(data.webhookname, cache);
    const webhookavatar = this.evalMessage(data.webhookavatar, cache);
    let varwebhook = '';
    let webhook = null;
    if (storagewebhook > 0) {
      varwebhook = this.evalMessage(data.varwebhook, cache);
      const Mods = this.getMods();
      webhook = Mods.getWebhook(storagewebhook, varwebhook, cache);
    }
    if (data.channel === undefined || message === undefined) {
      return;
    }

    let target = await this.getSendReplyTarget(channel, this.evalMessage(data.varName, cache), cache);

    let messageOptions = {};

    const overwrite = data.overwrite;

    let isEdit = 0;
    if (data.editMessage === 'intUpdate') {
      isEdit = 2;
    } else {
      const editMessage = parseInt(data.editMessage, 10);
      if (typeof editMessage === 'number' && editMessage >= 0) {
        const editVarName = this.evalMessage(data.editMessageVarName, cache);
        const editObject = this.getVariable(editMessage, editVarName, cache);
        const { Message } = this.getDBM().DiscordJS;
        if (editObject) {
          if (editObject instanceof Message) {
            target = editObject;
            isEdit = 1;
          } else {
            messageOptions = editObject;
          }
        }
      }
    }

    let content;

    if (
      data.embeds?.length > 0 ||
      data.attachments?.length > 0 ||
      data.buttons?.length > 0 ||
      data.selectMenus?.length > 0
    ) {
      content = this.evalMessage(message, cache);
    } else {
      content = this.evalMessage(message || '\u200b', cache);
    }

    if (content) {
      if (messageOptions.content && !overwrite) {
        messageOptions.content += content;
      } else {
        messageOptions.content = content;
      }
    }

    if (data.embeds?.length > 0) {
      const { MessageEmbed } = this.getDBM().DiscordJS;

      if (!Array.isArray(messageOptions.embeds) || overwrite) {
        messageOptions.embeds = [];
      }

      const embedDatas = data.embeds;
      for (let i = 0; i < embedDatas.length; i++) {
        const embedData = embedDatas[i];
        const embed = new MessageEmbed();

        if (embedData.title) embed.setTitle(this.evalMessage(embedData.title, cache));
        if (embedData.url) embed.setURL(this.evalMessage(embedData.url, cache));
        if (embedData.color) {
          let color = this.evalMessage(embedData.color, cache);
          // v14 compatibility: Convert "RANDOM" to random color number
          if (color === 'RANDOM' || color === 'random') {
            color = Math.floor(Math.random() * 0xffffff);
          }
          try {
            embed.setColor(color);
          } catch (e) {
            // If color conversion fails, try as number or default to random
            const colorNum = parseInt(color, 16) || parseInt(color, 10) || Math.floor(Math.random() * 0xffffff);
            embed.setColor(colorNum);
          }
        }
        if (embedData.timestamp === 'true') embed.setTimestamp();
        if (embedData.imageUrl) embed.setImage(this.evalMessage(embedData.imageUrl, cache));
        if (embedData.thumbUrl) embed.setThumbnail(this.evalMessage(embedData.thumbUrl, cache));

        if (embedData.description) {
          const description = this.evalMessage(embedData.description || '\u200B', cache);
          // Ensure description is not empty (Discord.js v14+ validation requires non-empty string or null)
          if (description && description.trim() !== '') {
            embed.setDescription(description);
          } else {
            embed.setDescription('\u200B');
          }
        }

        if (embedData.fields?.length > 0) {
          const fields = embedData.fields;
          for (let i = 0; i < fields.length; i++) {
            const f = fields[i];
            const fieldName = this.evalMessage(f.name || '\u200B', cache);
            let fieldValue = this.evalMessage(f.value || '\u200B', cache);

            // Ensure field value is not empty and truncate if too long
            if (!fieldValue || fieldValue.trim() === '') {
              fieldValue = '\u200B';
            }
            // Discord embed field values have a max length of 1024 characters
            if (fieldValue.length > 1024) {
              fieldValue = `${fieldValue.substring(0, 1021)}...`;
            }
            // Field names have a max length of 256 characters
            const safeName = fieldName.length > 256 ? `${fieldName.substring(0, 253)}...` : fieldName;

            // Discord.js v14+ uses addFields instead of addField
            if (embed.addFields) {
              embed.addFields({ name: safeName, value: fieldValue, inline: f.inline === 'true' });
            } else {
              // Fallback for older Discord.js versions
              embed.addField(safeName, fieldValue, f.inline === 'true');
            }
          }
        }

        if (embedData.author) {
          embed.setAuthor({
            name: this.evalMessage(embedData.author, cache),
            iconURL: embedData.authorIcon ? this.evalMessage(embedData.authorIcon, cache) : null,
            url: embedData.authorUrl ? this.evalMessage(embedData.authorUrl, cache) : null,
          });
        }

        if (embedData.footerText) {
          embed.setFooter({
            text: this.evalMessage(embedData.footerText, cache),
            iconURL: embedData.footerIconUrl ? this.evalMessage(embedData.footerIconUrl, cache) : null,
          });
        }

        messageOptions.embeds.push(embed);
      }
    }

    let componentsArr = [];
    let awaitResponses = [];

    if (!overwrite && messageOptions.components?.length > 0) {
      componentsArr = messageOptions.components.map(function (comps) {
        return comps.components;
      });
    }

    const defaultTime = 60000;

    if (Array.isArray(data.buttons)) {
      for (let i = 0; i < data.buttons.length; i++) {
        const button = data.buttons[i];
        const buttonData = this.generateButton(button, cache);
        this.addButtonToActionRowArray(componentsArr, this.evalMessage(button.row, cache), buttonData, cache);

        if (button.mode !== 'PERSISTENT') {
          awaitResponses.push({
            type: 'BUTTON',
            time: button.time ? parseInt(this.evalMessage(button.time, cache), 10) || defaultTime : defaultTime,
            id: this.evalMessage(button.id, cache),
            user: button.mode.endsWith('PERSONAL') ? cache.getUser()?.id : null,
            multi: button.mode.startsWith('MULTI'),
            data: button,
          });
        }
      }
    }

    if (Array.isArray(data.selectMenus)) {
      for (let i = 0; i < data.selectMenus.length; i++) {
        const select = data.selectMenus[i];
        const selectData = this.generateSelectMenu(select, cache);
        this.addSelectToActionRowArray(componentsArr, this.evalMessage(select.row, cache), selectData, cache);

        if (select.mode !== 'PERSISTENT') {
          awaitResponses.push({
            type: 'SELECT',
            time: select.time ? parseInt(this.evalMessage(select.time, cache), 10) || defaultTime : defaultTime,
            id: this.evalMessage(select.id, cache),
            user: select.mode.endsWith('PERSONAL') ? cache.getUser()?.id : null,
            multi: select.mode.startsWith('MULTI'),
            data: select,
          });
        }
      }
    }

    if (messageOptions._awaitResponses?.length > 0) {
      if (overwrite && awaitResponses.length > 0) {
        messageOptions._awaitResponses = [];
      } else {
        awaitResponses = messageOptions._awaitResponses.concat(awaitResponses);
      }
    }

    if (componentsArr.length > 0) {
      const { DiscordJS } = this.getDBM();
      const isV14 = this.getDBM().isDiscordJSv14 ? this.getDBM().isDiscordJSv14() : false;
      const ComponentType = isV14 ? DiscordJS.ComponentType : DiscordJS.Constants?.MessageComponentTypes || {};
      // ActionRow type: 1 in both v13 and v14
      const actionRowType = isV14 ? ComponentType.ActionRow || 1 : ComponentType.ACTION_ROW || 1;

      const newComponents = componentsArr
        .filter((comps) => comps.length > 0)
        .map(function (comps) {
          // Ensure components are plain objects with numeric types
          const plainComponents = comps.map((comp) => {
            if (comp && typeof comp === 'object') {
              // Ensure type is numeric
              const compType = typeof comp.type === 'number' ? comp.type : comp.type?.valueOf?.() || comp.type;
              return {
                ...comp,
                type: compType,
              };
            }
            return comp;
          });

          return {
            type: actionRowType,
            components: plainComponents,
          };
        });

      messageOptions.components = newComponents;
    }

    if (storagewebhook > 0) {
      if (webhookname !== '') {
        messageOptions.username = webhookname;
      }
      if (webhookavatar !== '') {
        messageOptions.avatarURL = await webhookavatar;
      }
    }

    if (data.tts) {
      messageOptions.tts = true;
    }

    if (data.attachments?.length > 0) {
      const { Util, MessageAttachment } = this.getDBM().DiscordJS;
      const DBM = this.getDBM();
      const isV14 = DBM.isDiscordJSv14 ? DBM.isDiscordJSv14() : false;
      const fs = require('fs');
      const path = require('path');

      if (!Array.isArray(messageOptions.files) || overwrite) {
        messageOptions.files = [];
      }
      for (let i = 0; i < data.attachments.length; i++) {
        if (data.attachments[i].type === '1') {
          const Canvas = require('canvas');
          const attachment = data.attachments[i];
          const varnamer = this.evalMessage(attachment?.canvasname, cache);
          const varid = this.evalMessage(attachment?.canvasvar, cache);
          const imagedata = this.getVariable(varid, varnamer, cache);
          if (!imagedata) {
            this.callNextAction(cache);
            return;
          }
          const image = new Canvas.Image();
          image.src = imagedata;
          const canvas = Canvas.createCanvas(image.width, image.height);
          const ctx = canvas.getContext('2d');
          ctx.drawImage(image, 0, 0, image.width, image.height);
          const buffer = canvas.toBuffer('image/png', { compressionLevel: data.attachments[i].compress });
          const spoiler = Boolean(attachment?.spoiler);
          let name = attachment?.name || (spoiler ? Util.basename('image.png') : undefined);

          // Handle spoiler for v14 - prefix filename
          if (spoiler && isV14 && name) {
            name = `SPOILER_${name}`;
          }

          const msgAttachment = new MessageAttachment(buffer, name);
          if (spoiler && !isV14) {
            msgAttachment.setSpoiler(true);
          }
          messageOptions.files.push(msgAttachment);
        }
        if (data.attachments[i].type === '2') {
          const { Images } = this.getDBM();
          const attachment = data.attachments[i];
          const varnamer = this.evalMessage(attachment?.canvasname, cache);
          const varid = this.evalMessage(attachment?.canvasvar, cache);
          const imagedata = this.getVariable(varid, varnamer, cache);
          const spoiler = Boolean(attachment?.spoiler);
          let name = attachment?.name || (spoiler ? Util.basename('image.png') : undefined);

          // Handle spoiler for v14 - prefix filename
          if (spoiler && isV14 && name) {
            name = `SPOILER_${name}`;
          }

          const buffer = await Images.createBuffer(imagedata);
          const msgAttachment = new MessageAttachment(buffer, name);
          if (spoiler && !isV14) {
            msgAttachment.setSpoiler(true);
          }
          messageOptions.files.push(msgAttachment);
        }
        if (data.attachments[i].type === '0' || data.attachments[i].type === undefined) {
          const attachment = data.attachments[i];
          const url = this.evalMessage(attachment?.url, cache);
          if (url) {
            const spoiler = Boolean(attachment?.spoiler);

            // Trim and normalize URL to handle whitespace issues
            const normalizedUrl = String(url).trim();

            // Check if URL is remote (http/https) or local file path
            const isRemoteUrl = normalizedUrl.startsWith('http://') || normalizedUrl.startsWith('https://');

            let msgAttachment;
            let finalName = attachment?.name;

            if (isRemoteUrl) {
              // Remote URL - for v14, we need to fetch it first and pass as buffer
              // For v13, we can pass URL string directly
              try {
                if (isV14) {
                  // v14: Fetch remote URL and pass as buffer
                  let fetchModule;
                  try {
                    fetchModule = this.getDBM().Mods.require('node-fetch', '2');
                  } catch (requireError) {
                    // Fallback to global fetch if available (Node 18+)
                    if (typeof globalThis.fetch === 'function') {
                      fetchModule = globalThis.fetch;
                    } else {
                      throw new Error('fetch is not available');
                    }
                  }

                  const response = await fetchModule(normalizedUrl);
                  if (!response.ok) {
                    throw new Error(`Failed to fetch remote URL: ${response.statusText}`);
                  }

                  // Get buffer from response (node-fetch v2 uses .buffer(), native fetch uses .arrayBuffer())
                  let buffer;
                  if (typeof response.buffer === 'function') {
                    buffer = await response.buffer();
                  } else if (typeof response.arrayBuffer === 'function') {
                    buffer = Buffer.from(await response.arrayBuffer());
                  } else {
                    throw new Error('Unable to get buffer from response');
                  }

                  finalName = finalName || (spoiler ? Util.basename(normalizedUrl) : undefined);

                  // Handle spoiler for v14 - prefix filename
                  if (spoiler && finalName) {
                    finalName = `SPOILER_${finalName}`;
                  }

                  msgAttachment = new MessageAttachment(buffer, finalName);
                } else {
                  // v13: Pass URL string directly
                  finalName = finalName || (spoiler ? Util.basename(normalizedUrl) : undefined);
                  msgAttachment = new MessageAttachment(normalizedUrl, finalName);
                  if (spoiler) {
                    msgAttachment.setSpoiler(true);
                  }
                }
              } catch (fetchError) {
                console.error(`[Send Message] Error fetching remote URL ${normalizedUrl}:`, fetchError.message);
                continue; // Skip this attachment on error
              }
            } else {
              // Local file path - read file as buffer
              try {
                // Resolve file path (handle both relative and absolute paths)
                const filePath = path.isAbsolute(normalizedUrl)
                  ? normalizedUrl
                  : path.resolve(process.cwd(), normalizedUrl);

                // Check if file exists
                if (!fs.existsSync(filePath)) {
                  console.error(`[Send Message] File not found: ${filePath}`);
                  continue; // Skip this attachment
                }

                // Read file as buffer
                const buffer = fs.readFileSync(filePath);

                // Determine filename
                finalName = finalName || path.basename(filePath);

                // Handle spoiler for v14 - prefix filename
                if (spoiler && isV14 && finalName) {
                  finalName = `SPOILER_${finalName}`;
                }

                msgAttachment = new MessageAttachment(buffer, finalName);
                if (spoiler && !isV14) {
                  msgAttachment.setSpoiler(true);
                }
              } catch (fileError) {
                console.error(`[Send Message] Error reading file ${normalizedUrl}:`, fileError.message);
                continue; // Skip this attachment on error
              }
            }

            messageOptions.files.push(msgAttachment);
          }
        }
      }
    }

    let defaultResultMsg = null;
    const onComplete = (resultMsg) => {
      if (defaultResultMsg) {
        resultMsg ??= defaultResultMsg;
      }

      try {
        if (resultMsg) {
          const varName2 = this.evalMessage(data.varName2, cache);
          const storage = parseInt(data.storage, 10);
          this.storeValue(resultMsg, storage, varName2, cache);
          this.callNextAction(cache);

          for (let i = 0; i < awaitResponses.length; i++) {
            const response = awaitResponses[i];
            const originalInteraction = cache.interaction?.__originalInteraction ?? cache.interaction;
            const tempVariables = cache.temp || {};
            this.registerTemporaryInteraction(
              resultMsg.id,
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
                    this.preformActionsFromSelectInteraction(interaction, response.data, cache.meta, tempVariables);
                  }
                }
              },
            );
          }
        } else {
          this.callNextAction(cache);
        }
      } catch (err) {
        console.error('[Send Message] onComplete error:', err);
        const interaction = cache.interaction?.__originalInteraction ?? cache.interaction;
        if (
          interaction &&
          typeof interaction.editReply === 'function' &&
          interaction.replied === false &&
          interaction.deferred
        ) {
          interaction.editReply({ content: 'Something went wrong.' }).catch(() => {});
        } else if (interaction && typeof interaction.followUp === 'function') {
          interaction
            .followUp({
              content: 'Something went wrong.',
              flags: this.getDBM().DiscordJS?.MessageFlags?.Ephemeral ?? 64,
            })
            .catch(() => {});
        }
        this.callNextAction(cache);
      }
    };

    const isMessageTarget = target instanceof this.getDBM().DiscordJS.Message;

    const sameId = target?.id?.length > 0 && (target?.id ?? '') === cache?.interaction?.channel?.id;
    const sameChannel = channel === 0 || sameId;
    const canReply = !isMessageTarget && cache?.interaction?.replied === false && sameChannel;

    if (data.dontSend) {
      const varName2 = this.evalMessage(data.varName2, cache);
      const storage = parseInt(data.storage, 10);
      messageOptions._awaitResponses = awaitResponses;
      this.storeValue(messageOptions, storage, varName2, cache);
      this.callNextAction(cache);
    } else if (isEdit === 2) {
      let promise = null;

      const interaction = cache.interaction;
      const isMessageComponentInteraction =
        typeof interaction?.isMessageComponent === 'function' ? interaction.isMessageComponent() : false;

      defaultResultMsg = cache.interaction?.message ?? interaction?.message;

      if (isMessageComponentInteraction && typeof interaction?.update === 'function') {
        const DiscordJS = this.getDBM().DiscordJS;
        const MessageFlags = DiscordJS.MessageFlags;
        const srcMsgFlags = cache.interaction?.message?.flags;
        if (
          MessageFlags != null &&
          srcMsgFlags &&
          typeof srcMsgFlags.has === 'function' &&
          srcMsgFlags.has(MessageFlags.Ephemeral)
        ) {
          const existing = messageOptions.flags;
          const eph = MessageFlags.Ephemeral;
          if (existing == null) {
            messageOptions.flags = eph;
          } else if (typeof existing === 'number') {
            if ((existing & eph) !== eph) {
              messageOptions.flags = existing | eph;
            }
          } else if (existing && typeof existing.bitfield !== 'undefined') {
            const n = Number(existing.bitfield);
            if (!Number.isNaN(n) && (n & eph) !== eph) {
              messageOptions.flags = n | eph;
            }
          } else if (typeof existing?.add === 'function' && typeof existing?.has === 'function' && !existing.has(eph)) {
            messageOptions.flags = existing.add(eph);
          }
        }
        promise = interaction.update(messageOptions);
      } else if (interaction?.editReply && (interaction.replied || interaction.deferred)) {
        promise = interaction.editReply(messageOptions);
      } else {
        this.displayError(
          data,
          cache,
          'Send Message -> Message/Options to Edit -> Interaction Update / Could not find interaction to edit',
        );
      }

      if (promise) {
        promise
          .then(onComplete)
          .catch((err) => this.displayError(data, cache, err) || this.executeResults(false, data, cache));
      }
    } else if (Array.isArray(target)) {
      this.callListFunc(target, 'send', [messageOptions]).then(onComplete);
    } else if (isEdit === 1 && target?.edit) {
      target
        .edit(messageOptions)
        .then(onComplete)
        .catch((err) => this.displayError(data, cache, err) || this.executeResults(false, data, cache));
    } else if (isMessageTarget && target?.reply) {
      target
        .reply(messageOptions)
        .then(onComplete)
        .catch((err) => this.displayError(data, cache, err) || this.executeResults(false, data, cache));
    } else if (data.reply === true && canReply) {
      messageOptions.withResponse = true;
      if (data.ephemeral === true) {
        messageOptions.flags = this.getDBM().DiscordJS?.MessageFlags?.Ephemeral ?? 64;
      }
      let promise = null;
      if (cache.interaction.deferred) {
        promise = cache.interaction.editReply(messageOptions);
      } else {
        promise = cache.interaction.reply(messageOptions);
      }
      promise.then(onComplete).catch((err) => this.displayError(data, cache, err));
    } else if (target?.send) {
      if (storagewebhook > 0) {
        webhook
          .send(messageOptions)
          .then(onComplete)
          .catch((err) => this.displayError(data, cache, err) || this.executeResults(false, data, cache));
      } else {
        target
          .send(messageOptions)
          .then(onComplete)
          .catch((err) => this.displayError(data, cache, err) || this.executeResults(false, data, cache));
      }
    } else {
      this.callNextAction(cache);
    }
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod Init
  //
  // An optional function for action mods. Upon the bot's initialization,
  // each command/event's actions are iterated through. This is to
  // initialize responses to interactions created within actions
  // (e.g. buttons and select menus for Send Message).
  //
  // If an action provides inputs for more actions within, be sure
  // to call the `this.prepareActions` function to ensure all actions are
  // recursively iterated through.
  // ---------------------------------------------------------------------

  modInit(data) {
    if (Array.isArray(data?.buttons)) {
      for (let i = 0; i < data.buttons.length; i++) {
        const button = data.buttons[i];
        if (button.mode === 'PERSISTENT') {
          this.registerButtonInteraction(button.id, button);
        }
        this.prepareActions(button.actions);
      }
    }
    if (Array.isArray(data?.selectMenus)) {
      for (let i = 0; i < data.selectMenus.length; i++) {
        const select = data.selectMenus[i];
        if (select.mode === 'PERSISTENT') {
          this.registerSelectMenuInteraction(select.id, select);
        }
        this.prepareActions(select.actions);
      }
    }
  },

  // ---------------------------------------------------------------------
  // Action Bot Mod
  //
  // Upon initialization of the bot, this code is run. Using the bot's
  // DBM namespace, one can add/modify existing functions if necessary.
  // In order to reduce conflicts between mods, be sure to alias
  // functions you wish to overwrite.
  // ---------------------------------------------------------------------

  mod() {},
};

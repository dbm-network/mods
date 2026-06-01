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
      text = `Message Options - ${presets.getVariableText(data.editMessage, data.editMessageVarName)}`;
    } else {
      text = `Nothing (might cause error)`;
    }
    if (data.dontSend) {
      return `Store Data: ${text}`;
    }
    return `${presets.getSendReplyTargetText(data.channel, data.varName)}: ${text}`;
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

  meta: { version: '2.2.0', preciseCheck: true, author: null, authorUrl: null, downloadUrl: null },

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
<send-reply-target-input selectId="channel" variableInputId="varName"></send-reply-target-input>

<br><br><br>

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
									<input id="color" class="round" type="text" placeholder="Leave blank for default...">
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
		<div style="padding: 8px;">

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


	<tab label="Selects" icon="list alternate">
		<div style="padding: 8px;">

			<dialog-list id="selectMenus" fields='["placeholder", "id", "tempVarName", "row", "min", "max", "mode", "time", "options", "actions"]' dialogTitle="Select Menu Info" dialogWidth="800" dialogHeight="700" listLabel="Select Menus" listStyle="height: calc(100vh - 350px);" itemName="Select Menu" itemCols="1" itemHeight="40px;" itemTextFunction="data.placeholder + '<br>' + data.options" itemStyle="text-align: left; line-height: 40px;">
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

			<dialog-list id="attachments" fields='["url", "name", "spoiler"]' dialogTitle="Attachment Info" dialogWidth="400" dialogHeight="280" listLabel="Files" listStyle="height: calc(100vh - 350px);" itemName="File" itemCols="1" itemHeight="30px;" itemTextFunction="data.url" itemStyle="text-align: left; line-height: 30px;">
				<div style="padding: 16px;">
					<span class="dbminputlabel">Attachment Local/Web URL</span>
					<input id="url" class="round" type="text" value="resources/">

					<br>

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
		<div style="padding: 8px;">
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
  //
  // When the HTML is first applied to the action editor, this code
  // is also run. This helps add modifications or setup reactionary
  // functions for the DOM elements.
  // ---------------------------------------------------------------------

  init() {},

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

    const content = this.evalMessage(message, cache);
    if (content) {
      if (messageOptions.content && !overwrite) {
        messageOptions.content += content;
      } else {
        messageOptions.content = content;
      }
    }

    if (data.embeds?.length > 0) {
      const { EmbedBuilder } = this.getDBM().DiscordJS;

      if (!Array.isArray(messageOptions.embeds) || overwrite) {
        messageOptions.embeds = [];
      }

      const embedDatas = data.embeds;
      for (let i = 0; i < embedDatas.length; i++) {
        const embedData = embedDatas[i];
        const embed = new EmbedBuilder();

        if (embedData.title) embed.setTitle(this.evalMessage(embedData.title, cache));
        if (embedData.url) embed.setURL(this.evalMessage(embedData.url, cache));
        if (embedData.color) embed.setColor(this.evalMessage(embedData.color, cache));
        if (embedData.timestamp === 'true') embed.setTimestamp();
        if (embedData.imageUrl) embed.setImage(this.evalMessage(embedData.imageUrl, cache));
        if (embedData.thumbUrl) embed.setThumbnail(this.evalMessage(embedData.thumbUrl, cache));

        if (embedData.description) embed.setDescription(this.evalMessage(embedData.description, cache));

        if (embedData.fields?.length > 0) {
          embed.addFields(
            embedData.fields.map((f) => ({
              name: this.evalMessage(f.name, cache),
              value: this.evalMessage(f.value, cache),
              inline: f.inline === 'true',
            })),
          );
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
            type: 'DBM_AWAIT_RESPONSE_BUTTON',
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
            type: 'DBM_AWAIT_RESPONSE_SELECT',
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
      const { ComponentType } = this.getDBM().DiscordJS;
      const newComponents = componentsArr
        .filter((comps) => comps.length > 0)
        .map(function (comps) {
          return {
            type: ComponentType.ActionRow,
            components: comps,
          };
        });

      messageOptions.components = newComponents;
    }

    if (data.tts) {
      messageOptions.tts = true;
    }

    if (data.attachments?.length > 0) {
      const { Util, AttachmentBuilder } = this.getDBM().DiscordJS;
      if (!Array.isArray(messageOptions.files) || overwrite) {
        messageOptions.files = [];
      }
      for (let i = 0; i < data.attachments.length; i++) {
        const attachment = data.attachments[i];
        const url = this.evalMessage(attachment?.url, cache);
        if (url) {
          const spoiler = Boolean(attachment?.spoiler);
          const name = attachment?.name || (spoiler ? Util.basename(url) : undefined);
          const msgAttachment = new AttachmentBuilder(url, { name });
          if (spoiler) {
            msgAttachment.setSpoiler(true);
          }
          messageOptions.files.push(msgAttachment);
        }
      }
    }

    let defaultResultMsg = null;
    const onComplete = (resultMsg) => {
      if (defaultResultMsg) {
        resultMsg ??= defaultResultMsg;
      }

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
                if (response.type === 'DBM_AWAIT_RESPONSE_BUTTON') {
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
        promise.then(onComplete).catch((err) => this.displayError(data, cache, err));
      }
    } else if (Array.isArray(target)) {
      this.callListFunc(target, 'send', [messageOptions]).then(() => onComplete());
    } else if (isEdit === 1 && target?.edit) {
      target
        .edit(messageOptions)
        .then(onComplete)
        .catch((err) => this.displayError(data, cache, err));
    } else if (isMessageTarget && target?.reply) {
      target
        .reply(messageOptions)
        .then(onComplete)
        .catch((err) => this.displayError(data, cache, err));
    } else if (data.reply === true && canReply) {
      messageOptions.fetchReply = true;
      if (data.ephemeral === true) {
        messageOptions.ephemeral = true;
      }
      let promise = null;
      if (cache.interaction.deferred || cache.interaction.replied) {
        promise = cache.interaction.editReply(messageOptions);
      } else {
        promise = cache.interaction.reply(messageOptions);
      }
      promise.then(onComplete).catch((err) => this.displayError(data, cache, err));
    } else if (target?.send) {
      target
        .send(messageOptions)
        .then(onComplete)
        .catch((err) => this.displayError(data, cache, err));
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

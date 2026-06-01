module.exports = {
  // ---------------------------------------------------------------------
  // Action Name
  // ---------------------------------------------------------------------

  name: 'Show Modal MOD',
  displayName: 'Show Modal MOD',

  // ---------------------------------------------------------------------
  // Action Section
  // ---------------------------------------------------------------------

  section: 'Messaging',

  // ---------------------------------------------------------------------
  // Action Subtitle
  // ---------------------------------------------------------------------

  subtitle(data) {
    return `[${data.modalTitle || 'My Modal'}] - with ${data.modalComponents.length} components`;
  },

  // ---------------------------------------------------------------------
  // Action Storage Function
  // ---------------------------------------------------------------------

  variableStorage(data, varType) {
    if (!Array.isArray(data.modalComponents)) return;
    const result = [];
    for (const { storage, varName2: name, componentType } of data.modalComponents) {
      const type = parseInt(storage, 10);
      if (type !== varType || !name) continue;
      const desc =
        componentType === 'textInput'
          ? 'Text From Input'
          : componentType === 'selectMenu'
          ? 'Option From Select'
          : 'Modal Component';

      result.push(name, desc);
    }
    return result.length ? result : undefined;
  },

  // ---------------------------------------------------------------------
  // Action Meta Data
  // ---------------------------------------------------------------------

  meta: {
    version: '2.2.0',
    preciseCheck: true,
    author: 'Shadow',
    authorUrl: 'https://github.com/shadoow051',
    downloadUrl: 'https://github.com/dbm-network/mods',
  },

  // ---------------------------------------------------------------------
  // Action Fields
  // ---------------------------------------------------------------------

  fields: ['modalTitle', 'modalComponents'],

  // ---------------------------------------------------------------------
  // Command HTML
  // ---------------------------------------------------------------------

  html(data) {
    return `
<div style="position:fixed;bottom:0;left:0;padding:5px;padding-top:5px;padding-bottom:5px;font:13px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'">Creator: Shadow<br><br>Help: <a href='https://discord.gg/9HYB4n3Dz4' target='_blank' style='color:#07f;text-decoration:none'>Discord</a></div><div style="position:fixed;bottom:0;right:0;padding:5px;font:20px sans-serif;border-radius:10px;background:rgba(0,0,0,0.7);color:#999;border:1px solid rgba(50,50,50,.7);z-index:999999;opacity:0.5;transition:all .3s" onmouseover="this.style.opacity='1';this.style.borderColor='gray'" onmouseout="this.style.opacity='0.5';this.style.borderColor='rgba(50,50,50,.7)'"><a href='https://dbm-polska.github.io/DBM-14/' target='_blank' style='color:#07f;text-decoration:none'><!--Version-->1.0</a></div>

<span class="dbminputlabel">Modal Title</span><br>
<input id="modalTitle" class="round" type="text" value="My Modal">
<br><br>

<dialog-list id="modalComponents" fields='["componentType", "modalLabel", "modalDescription", "textInputDefaultValue", "modalPlaceholder", "textInputMinLength", "textInputMaxLength", "textInputStyle", "textInputRequired", "selectsMinSelectNumber", "selectsMaxSelectNumber", "selectsSelectMenuType", "selectsRequired", "options", "storage", "varName2"]' dialogTitle="Modal Component Info" dialogWidth="600" dialogHeight="580" listLabel="Modal Components (max 5)" listStyle="height: calc(100vh - 300px);" itemName="Modal Component" itemCols="1" itemHeight="47px;" itemTextFunction="glob.formatItemModalComponent(data)" itemStyle="line-height: 40px;">

<br>
<div style="float: left; display: inline-block; width: 49%;">
    <span class="dbminputlabel">Label</span><br>
    <input id="modalLabel" class="round" type="text">
</div>
<div style="float: right; display: inline-block; width: 49%;">
    <span class="dbminputlabel">Description</span><br>
    <input id="modalDescription" class="round" type="text" placeholder="Leave blank for none...">
</div>
<br><br><br>
<div style="float: left; display: inline-block; width: 100%;">
    <span class="dbminputlabel">Placeholder</span><br>
    <input id="modalPlaceholder" class="round" type="text" placeholder="Leave blank for none...">
</div>
<div style="clear: both;"></div>

<div style="position: fixed; top: 26%; left: 85%; transform: translate(-50%, -50%); z-index: 10;">
<span class="dbminputlabel">Component Type</span><br>
<select id="componentType" class="round" style="width: 170px;">
    <option value="textInput">Text Input</option>
    <option value="selectMenu">Select Menu</option>
</select>
</div>

<tab-system style="margin-top: 13px;">
<tab label="Text Input" icon="book image">
<div style="float: left; display: inline-block; padding-top: 10px; width: 49%;">
    <span class="dbminputlabel">Min Length</span><br>
    <input id="textInputMinLength" class="round" type="text" value="1">
</div>
<div style="float: right; display: inline-block; padding-top: 10px; width: 49%;">
    <span class="dbminputlabel">Max Length</span><br>
    <input id="textInputMaxLength" class="round" type="text" value="4000">
</div>
<div style="float: left; display: inline-block; padding-top: 10px; width: 49%;">
<span class="dbminputlabel">Style</span><br>
<select id="textInputStyle" class="round">
    <option value="1">Short</option>
    <option value="2">Paragraph</option>
</select>
</div>
<div style="float: right; display: inline-block; padding-top: 10px; width: 49%;">
<span class="dbminputlabel">Required</span><br>
<select id="textInputRequired" class="round">
    <option value="true">Yes</option>
    <option value="false">No</option>
</select>
</div>
<br><br><br><br><br><br><br>
<div style="float: left; display: inline-block; width: 100%;">
    <span class="dbminputlabel">Default Value</span><br>
    <input id="textInputDefaultValue" class="round" type="text" placeholder="Leave blank for none...">
</div>
</tab>

<tab label="Select Menu" icon="book image">

<div style="float: left; display: inline-block; padding-top: 10px; width: 49%;">
    <span class="dbminputlabel">Min Select Number</span><br>
    <input id="selectsMinSelectNumber" class="round" type="text" value="1">
</div>
<div style="float: right; display: inline-block; padding-top: 10px; width: 49%;">
    <span class="dbminputlabel">Max Select Number</span><br>
    <input id="selectsMaxSelectNumber" class="round" type="text" value="1">
</div>
<div style="float: left; display: inline-block; padding-top: 10px; width: 49%;">
<span class="dbminputlabel">Select Menu Type</span><br>
<select id="selectsSelectMenuType" class="round">
<optgroup label="Default Select Menu">
    <option value="stringSelectMenu">String Select Menu</option>
    <option value="userSelectMenu">User Select Menu</option>
    <option value="roleSelectMenu">Role Select Menu</option>
    <option value="mentionableSelectMenu">Mentionable Select Menu</option>
    <option value="channelSelectMenu">Channel Select Menu</option>
</optgroup>
</select>
</div>
<div style="float: right; display: inline-block; padding-top: 10px; width: 49%;">
<span class="dbminputlabel">Required</span><br>
<select id="selectsRequired" class="round">
    <option value="true">Yes</option>
    <option value="false">No</option>
</select>
</div>
<br><br><br><br><br>
<dialog-list id="options" fields='["label", "description", "value", "emoji", "default"]' saveButtonText="Save Option", dialogTitle="Select Menu Option Info" dialogWidth="360" dialogHeight="440" listLabel="Options" listStyle="height: 90px; width: 200px;" itemName="Option" itemCols="1" itemHeight="20px;" itemTextFunction="data.label" itemStyle="text-align: left; line-height: 20px;" style="float: right; margin-right: 0px;">
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

</tab>
</tab-system>
<br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
<store-in-variable dropdownLabel="Store Result In" selectId="storage" variableContainerId="varNameContainer2" variableInputId="varName2"></store-in-variable>

</dialog-list>
`;
  },

  // ---------------------------------------------------------------------
  // Action Editor Init Code
  // ---------------------------------------------------------------------

  init() {
    const { glob } = this;

    glob.formatItemModalComponent = function (data) {
      const selectMenuType = data.componentType;
      let result =
        '<div style="display: inline-block; width: 100%; padding-left: 8px">' +
        '<div style="float:left;width: calc(100% - 200px);overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">';
      result += data.modalLabel;
      result +=
        "</div><div style='float:right;width:190px;text-align:right;padding:0px 10px 0px 0px;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;'>";
      if (selectMenuType === 'textInput') {
        result += '(Text Input)';
      } else if (selectMenuType === 'selectMenu') {
        result += '(Select Menu)';
      }
      result += '</div></div>';
      return result;
    };
  },

  // ---------------------------------------------------------------------
  // Action Bot Function
  // ---------------------------------------------------------------------

  async action(cache) {
    const data = cache.actions[cache.index];
    const {
      ModalBuilder,
      LabelBuilder,
      TextInputBuilder,
      StringSelectMenuBuilder,
      UserSelectMenuBuilder,
      RoleSelectMenuBuilder,
      MentionableSelectMenuBuilder,
      ChannelSelectMenuBuilder,
    } = require('discord.js');
    const modalTitle = this.evalMessage(data.modalTitle, cache) || 'My Modal';

    const finalLabelComponents = [];
    for (const component of data.modalComponents) {
      const modalLabel = this.evalMessage(component.modalLabel, cache);
      const modalDescription = this.evalMessage(component.modalDescription, cache);
      const modalPlaceholder = this.evalMessage(component.modalPlaceholder, cache);
      const customId = `${this.evalMessage(component.varName2, cache) || Math.random().toString(36).substring(2, 8)}`;

      const labelComponent = new LabelBuilder().setLabel(modalLabel);
      if (modalDescription) {
        labelComponent.setDescription(modalDescription);
      }

      if (component.componentType === 'textInput') {
        const textInputMinLength = parseInt(this.evalMessage(component.textInputMinLength, cache), 10) || 1;
        const textInputMaxLength = parseInt(this.evalMessage(component.textInputMaxLength, cache), 10) || 4000;
        const textInputStyle = Number(component.textInputStyle) || 1;
        const textInputRequired = component.textInputRequired === 'true';
        const textInputDefaultValue = this.evalMessage(component.textInputDefaultValue, cache) || '';
        const textInputComponent = new TextInputBuilder()
          .setCustomId(customId)
          .setMaxLength(textInputMinLength)
          .setMaxLength(textInputMaxLength)
          .setStyle(textInputStyle)
          .setRequired(textInputRequired)
          .setValue(textInputDefaultValue);
        if (modalPlaceholder) {
          textInputComponent.setPlaceholder(modalPlaceholder);
        }
        labelComponent.setTextInputComponent(textInputComponent);
      } else if (component.componentType === 'selectMenu') {
        const selectsMinSelectNumber = parseInt(this.evalMessage(component.selectsMinSelectNumber, cache), 10) || 1;
        const selectsMaxSelectNumber = parseInt(this.evalMessage(component.selectsMaxSelectNumber, cache), 10) || 1;
        const selectsRequired = component.selectsRequired === 'true';
        let selectMenuComponent;
        switch (component.selectsSelectMenuType) {
          case 'stringSelectMenu':
            const options = [];
            for (const option of component.options) {
              const payload = {
                label: option.label || '',
                description: option.description || '',
                value: option.value || '',
                emoji: option.emoji || undefined,
                default: option.default === 'true',
              };
              options.push(payload);
            }
            selectMenuComponent = new StringSelectMenuBuilder()
              .setOptions(options)
              .setCustomId(customId)
              .setMinValues(selectsMinSelectNumber)
              .setMaxValues(selectsMaxSelectNumber)
              .setRequired(selectsRequired);
            labelComponent.setStringSelectMenuComponent(selectMenuComponent);
            break;
          case 'userSelectMenu':
            selectMenuComponent = new UserSelectMenuBuilder()
              .setCustomId(customId)
              .setMinValues(selectsMinSelectNumber)
              .setMaxValues(selectsMaxSelectNumber)
              .setRequired(selectsRequired);
            labelComponent.setUserSelectMenuComponent(selectMenuComponent);
            break;
          case 'roleSelectMenu':
            selectMenuComponent = new RoleSelectMenuBuilder()
              .setCustomId(customId)
              .setMinValues(selectsMinSelectNumber)
              .setMaxValues(selectsMaxSelectNumber)
              .setRequired(selectsRequired);
            labelComponent.setRoleSelectMenuComponent(selectMenuComponent);
            break;
          case 'mentionableSelectMenu':
            selectMenuComponent = new MentionableSelectMenuBuilder()
              .setCustomId(customId)
              .setMinValues(selectsMinSelectNumber)
              .setMaxValues(selectsMaxSelectNumber)
              .setRequired(selectsRequired);
            labelComponent.setMentionableSelectMenuComponent(selectMenuComponent);
            break;
          case 'channelSelectMenu':
            selectMenuComponent = new ChannelSelectMenuBuilder()
              .setCustomId(customId)
              .setMinValues(selectsMinSelectNumber)
              .setMaxValues(selectsMaxSelectNumber)
              .setRequired(selectsRequired);
            labelComponent.setChannelSelectMenuComponent(selectMenuComponent);
            break;
        }
        if (modalPlaceholder) {
          selectMenuComponent.setPlaceholder(modalPlaceholder);
        }
      }

      finalLabelComponents.push(labelComponent);
    }

    // ////////////////////////////////////////////////////////////

    const modal = new ModalBuilder()
      .setCustomId(cache.interaction.id)
      .setTitle(modalTitle)
      .setLabelComponents(finalLabelComponents);

    // ////////////////////////////////////////////////////////////

    this.registerModalSubmitResponses(cache.interaction.id, async (newInteraction) => {
      newInteraction.__originalInteraction = cache.interaction;
      cache.interaction = newInteraction;

      const getFieldVal = (f) => {
        if (!f) return '';
        if ('value' in f) return f.value ?? '';
        if (Array.isArray(f.values)) return f.values;
        if (f.users) return [...f.users.keys()];
        if (f.members) return [...f.members.keys()];
        if (f.roles) return [...f.roles.keys()];
        return '';
      };
      for (const comp of data.modalComponents) {
        const cid = `${this.evalMessage(comp.varName2, cache)}`;
        const storage = parseInt(comp.storage, 10);
        const varName = cid;
        let value = '';
        if (comp.componentType === 'textInput' && newInteraction.fields?.getTextInputValue) {
          try {
            value = newInteraction.fields.getTextInputValue(cid);
          } catch {}
        }
        if (!value) value = getFieldVal(newInteraction.fields?.fields?.get?.(cid)) || '';
        if (Array.isArray(value) && value.length === 1) value = value[0];

        if (!Number.isNaN(storage) && varName) this.storeValue(value, storage, varName, cache);
      }

      this.callNextAction(cache);
    });

    await cache.interaction.showModal(modal);
  },
};

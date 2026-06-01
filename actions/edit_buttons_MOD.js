module.exports = {
  name: 'Edit Buttons',
  section: 'Messaging',
  meta: {
    version: '2.1.6',
    preciseCheck: true,
    author: 'DBM Extended',
    authorUrl: 'https://github.com/DBM-Extended/mods',
    downloadURL: 'https://github.com/DBM-Extended/mods',
  },

  subtitle(data, presets) {
    const type = `${data.type}`;
    let selects;
    switch (type) {
      case 'all': {
        selects = 'All buttons';
        break;
      }
      case 'sourceButton': {
        selects = 'Current button';
        break;
      }
      case 'findButton': {
        selects = 'Specific button';
        break;
      }
    }
    return `Edit "${selects}" in "${presets.getMessageText(data.storage, data.varName)}"`;
  },

  fields: ['storage', 'varName', 'type', 'alterartype', 'alterarnome', 'alteraremoji', 'searchValue'],

  html(isEvent, data) {
    return `
    <div id="wrexdiv" style="height: 370px; overflow-y: scroll;padding:5px 10px">
<message-input dropdownLabel="Source message" selectId="storage" variableContainerId="varNameContainer" variableInputId="varName"></message-input>

<br><br><br><br>

<div style="float: left; width: calc(50% - 12px);">
  <span class="dbminputlabel">Componentes para alterar</span><br>
  <select id="type" class="round" onchange="glob.onButtonSelectTypeChange(this)">
  <option value="all" selected>All buttons</option>
  <option value="sourceButton">Current button</option>
  <option value="findButton">Specific button</option>
  </select>
</div>

<div style="float: right; width: calc(50% - 12px);">
<div id="nameContainer" style="width: 100%">
  <span class="dbminputlabel">Button ID</span><br>
  <input id="searchValue" class="round" type="text">
</div>
</div>

<br><br><br><br>


  <span class="dbminputlabel">Change name to</span><br>
  <input id="alterarnome" class="round" type="text">

  <br>

  <span class="dbminputlabel">Change emoji to</span><br>
  <input id="alteraremoji" class="round" type="text">

  <br>


<span class="dbminputlabel">Change the type to</span><br>
<input id="alterartype" value="PRIMARY" class="round" type="text"><br>
PRIMARY (Blue)<br>
SECONDARY (Grey)<br>
SUCCESS (Green)<br>
DANGER (Red)<br>
Or use a variable, example \${tempVars("color")}</div>
`;
  },

  preInit(data, formatters) {
    return formatters.compatibility_2_0_0_iftruefalse_to_branch(data);
  },

  init() {
    const { glob, document } = this;

    glob.onButtonSelectTypeChange = function (event) {
      const input = document.getElementById('nameContainer');
      input.style.display = event.value === 'findButton' || event.value === 'findSelect' ? null : 'none';
    };

    glob.onButtonSelectTypeChange(document.getElementById('type'));
  },

  async action(cache) {
    const data = cache.actions[cache.index];
    const alterartype = this.evalMessage(data.alterartype, cache);
    const alteraremoji = this.evalMessage(data.alteraremoji, cache);
    const alterarnome = this.evalMessage(data.alterarnome, cache);
    const message = await this.getMessageFromData(data.storage, data.varName, cache);

    const type = data.type;

    let sourceButton = null;
    if (cache.interaction.isButton()) {
      sourceButton = cache.interaction.customId;
    }

    if (cache.interaction.isSelectMenu()) {
      const _sourceSelect = cache.interaction.customId;
    }

    let components = null;
    let searchValue = null;

    if (message?.components) {
      const { MessageActionRow } = this.getDBM().DiscolordJS;
      const oldComponents = message.components;
      const newComponents = [];

      for (let i = 0; i < oldComponents.length; i++) {
        const compData = oldComponents[i];
        const comps = compData instanceof MessageActionRow ? compData.toJSON() : compData;

        for (let j = 0; j < comps.components.length; j++) {
          const comp = comps.components[j];
          const id = comp.custom_id ?? comp.customId;

          switch (type) {
            case 'all': {
              comp.style = alterartype;
              comp.label = alterarnome;
              comp.emoji = alteraremoji;
              break;
            }
            case 'sourceButton': {
              if (id === sourceButton) comp.style = alterartype;
              if (id === sourceButton) comp.label = alterarnome;
              if (id === sourceButton) comp.emoji = alteraremoji;
              break;
            }
            case 'findButton': {
              if (searchValue === null) searchValue = this.evalMessage(data.searchValue, cache);
              if (id === searchValue || comp.style === searchValue) comp.style = alterartype;
              if (id === searchValue || comp.label === searchValue) comp.label = alterarnome;
              if (id === searchValue || comp.emoji === searchValue) comp.emoji = alteraremoji;
              break;
            }
          }
        }

        newComponents.push(comps);
      }

      components = newComponents;
    }

    if (components) {
      if (Array.isArray(message)) {
        this.callListFunc(message, 'edit', [{ components }]).then(() => this.callNextAction(cache));
      } else if (
        cache.interaction?.message?.id === message?.id &&
        cache.interaction?.update &&
        !cache.interaction?.replied
      ) {
        cache.interaction
          .update({ components })
          .then(() => this.callNextAction(cache))
          .catch((err) => this.displayError(data, cache, err));
      } else if (message?.edit) {
        message
          .edit({ components })
          .then(() => this.callNextAction(cache))
          .catch((err) => this.displayError(data, cache, err));
      } else {
        if (message.components) {
          message.components = components;
        }
        this.callNextAction(cache);
      }
    } else {
      this.callNextAction(cache);
    }
  },

  mod() {},
};

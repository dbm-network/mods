module.exports = {
  name: 'Multiple Bot Owners',
  version: '1.0.0',
  isCommandExtension: false,
  isEventExtension: false,
  isEditorExtension: true,

  fields: [],
  defaultFields: {},

  size() {
    return { height: 500, width: 500 };
  },

  html() {
    return `
<style>
  html, body {
    text-align: center;
    height: 100%;
    width: 100%;
    background-color: #23272a;
  }

  .input {
    border-top-right-radius: 0px !important;
    border-bottom-right-radius: 0px !important;
  }

  .currentowners {
    max-height: 150px;
    height: 150px;
    overflow-y: scroll !important;
    overflow-x: hidden;
  }

  .container {
    margin-left: 15% !important;
    margin-right: 15% !important;
  }

  .input {
    width: 100% !important;
  }

  label, p {
    color: white !important;
  }
</style>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.12.1/css/all.min.css">
<script src="https://kit.fontawesome.com/9f46650366.js" crossorigin="anonymous"></script>
<div class="container has-text-centered"><br>
  The addition or removal of owners requires a bot restart.<br><br>
  <label class="label">Current Owners</label>
  <div class="currentowners" id="current-owners"></div>
  <label class="label">Add owners</label>
  <div class="field has-addons">
    <input id="ownerinput" class="input" type="text" placeholder="User ID">
    <div class="control">
      <a class="button is-info" onclick="document.addOwner()">
        <i class="fas fa-plus"></i>
      </a>
    </div>
  </div>
</div>`;
  },

  init(document) {
    try {
      const fs = require('fs');
      const path = require('path');

      const filepath = path.join(__dirname, '../data', 'multiple_bot_owners.json');

      let botOwners = [];

      function addOwnerHTML(owner) {
        document.getElementById('current-owners').innerHTML += `
                <div class="field has-addons" id="${owner}_DIV"> <input id="${owner}_INPUT" class="input" type="text" placeholder="User ID" disabled
                value="${owner}">
                <div class="control"> <a class="button is-info" onclick="document.delOwner(document.getElementById('${owner}_INPUT'))"> <i class="fas fa-minus"></i> </a> </div>
                </div>
              `;
      }

      function loadOwners() {
        if (!fs.existsSync(filepath)) {
          fs.writeFileSync(filepath, JSON.stringify(botOwners));
        } else {
          botOwners = JSON.parse(fs.readFileSync(filepath, 'utf8'));
        }

        botOwners.forEach((owner) => {
          if (owner && /^\d+$/.test(owner)) {
            addOwnerHTML(owner);
          }
        });
      }

      document.delOwner = function delOwner(element) {
        const owner = element && element.value;
        const element2 = document.getElementById(`${owner}_DIV`);
        alert(`${owner} was removed.`);
        if (!owner) return;

        botOwners.splice(botOwners.indexOf(owner), 1);

        element.parentNode.removeChild(element);
        element2.parentNode.removeChild(element2);

        fs.writeFileSync(filepath, JSON.stringify(botOwners, null, 2));
      };

      document.addOwner = function addOwner(owner = false) {
        if (!owner) owner = document.getElementById('ownerinput').value;

        if (!owner) {
          return alert('MultipleBotOwners\nYou must enter a value!');
        }
        if (!/^\d+$/.test(owner)) {
          return alert(`MultipleBotOwners\nThe inputted value can only be a discord ID.\nYou put ${owner}.`);
        }
        if (botOwners.includes(owner)) {
          return alert('MultipleBotOwners\nThat ID already exists!.');
        }

        addOwnerHTML(owner);
        botOwners.push(owner);
        fs.writeFileSync(filepath, JSON.stringify(botOwners));

        return 'ADDED';
      };
      loadOwners();
    } catch (error) {
      alert(`MultipleBotOwners Error: \n${error}`);
    }
  },

  close() {},

  mod(DBM) {
    const { Actions, Files } = DBM;

    const fs = require('fs');
    const path = require('path');

    try {
      const filepath = path.join(__dirname, '../data', 'multiple_bot_owners.json');

      let botOwners = [];

      if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, JSON.stringify(botOwners));
      } else {
        botOwners = JSON.parse(fs.readFileSync(filepath, 'utf8'));
      }

      Actions.checkConditions = function checkConditions(msg, cmd) {
        const isServer = Boolean(msg.guild && msg.member);
        const restriction = parseInt(cmd.restriction, 10);
        const { permissions } = cmd;
        switch (restriction) {
          case 0:
            if (isServer) {
              return this.checkPermissions(msg, permissions);
            }
            return true;

          case 1:
            return isServer && this.checkPermissions(msg, permissions);
          case 2:
            return isServer && msg.guild.owner === msg.member;
          case 3:
            return !isServer;
          case 4:
            return (
              (botOwners.length > 0 && botOwners.includes(msg.author.id)) ||
              (Files.data.settings.ownerId && msg.author.id === Files.data.settings.ownerId)
            );
          default:
            return true;
        }
      };
    } catch (error) {
      console.error(`MultipleBotOwners_ERROR:\n${error}`);
    }

    console.log('Multiple Bot Owners Extension Loaded!');
  },
};
